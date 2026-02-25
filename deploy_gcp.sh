#!/bin/bash
set -e

echo "================================================="
echo "🍰 Antreme Auto-Deploy to Google Cloud Platform 🍰"
echo "================================================="

# Variables
PROJECT_ID=$(gcloud config get-value project)
ZONE="us-central1-a"
INSTANCE_NAME="antreme-server"

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No GCP Project found. Please select a project in the top bar of the Google Cloud Console."
    exit 1
fi

echo "✅ Using Project: $PROJECT_ID"
echo "✅ Instance Name: $INSTANCE_NAME in zone $ZONE"

# 1. Enable Compute APIs
echo "⏳ Enabling Compute Engine API (this might take a few moments)..."
gcloud services enable compute.googleapis.com

# 2. Create Firewall Rules (Port 80 for HTTP)
echo "🛡️ Configuring Firewall to allow web traffic..."
gcloud compute firewall-rules create allow-http-https \
    --action=ALLOW \
    --rules=tcp:80,tcp:443 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=http-server,https-server \
    --quiet 2>/dev/null || echo "✅ Firewall rules already exist."

# 3. Generate the Startup Script for the VM
# This script runs ONCE automatically inside the VM on its very first boot!
cat << 'EOF' > vm_startup.sh
#!/bin/bash
set -e
exec > /var/log/antreme_startup.log 2>&1

echo "Updating system and installing dependencies..."
export DEBIAN_FRONTEND=noninteractive
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get update
apt-get install -y nginx python3-pip python3-venv git nodejs
npm install -g pm2

# Clone Repository
echo "Cloning Antreme repository..."
cd /var/www
rm -rf antreme
git clone https://github.com/viteksv1983-spec/-.git antreme
cd antreme

# Setup Backend (FastAPI)
echo "Setting up FastAPI backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install uvicorn
deactivate

# Setup Systemd Service for Backend
cat << 'SYS' > /etc/systemd/system/antreme-backend.service
[Unit]
Description=Antreme FastAPI Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/antreme/backend
Environment="PATH=/var/www/antreme/backend/venv/bin"
ExecStart=/var/www/antreme/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
SYS

systemctl daemon-reload
systemctl enable antreme-backend
systemctl start antreme-backend

# Setup Frontend (React/Vite)
echo "Building Frontend..."
cd /var/www/antreme/frontend
# Inject /api as baseURL for Nginx proxying
echo "VITE_API_URL=/api" > .env.production
npm config set legacy-peer-deps true
npm install
npm run build

# Configure Nginx
echo "Configuring Nginx Web Server..."
cat << 'NGINX' > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _; 

    client_max_body_size 50M;

    # Serve built React frontend
    root /var/www/antreme/frontend/dist;
    index index.html;

    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Serve Media Directly for speed
    location /media/ {
        alias /var/www/antreme/backend/media/;
    }

    # Proxy API requests to FastAPI
    location /api/ {
        # The trailing slash on the proxy_pass strips the /api part,
        # so /api/cakes/ becomes /cakes/ on the backend!
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

systemctl restart nginx
echo "✅ Setup Complete!"
EOF

# 4. Create the Virtual Machine
echo "🚀 Creating Google Compute Engine VM (e2-micro Free Tier)..."
gcloud compute instances create $INSTANCE_NAME \
    --project=$PROJECT_ID \
    --zone=$ZONE \
    --machine-type=e2-micro \
    --network-interface=network-tier=STANDARD,subnet=default \
    --tags=http-server,https-server \
    --image-family=debian-12 \
    --image-project=debian-cloud \
    --boot-disk-size=30GB \
    --boot-disk-type=pd-standard \
    --metadata-from-file startup-script=vm_startup.sh \
    --quiet

# 5. Output Success and Instructions
VM_IP=$(gcloud compute instances describe $INSTANCE_NAME --zone=$ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "================================================="
echo "🎉 DEPLOYMENT INITIATED SUCESSFULLY! 🎉"
echo "================================================="
echo "Your server is currently booting up and installing everything."
echo "Wait for about 3-5 minutes, then open your browser and go to:"
echo ""
echo "👉 http://$VM_IP 👈"
echo ""
echo "Note: It takes a few minutes for the setup to install Node.js and Python."
echo "If it doesn't work right away, have a coffee and refresh the page!"
echo "================================================="

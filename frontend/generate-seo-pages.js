import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read category SEO data
import { categorySeoData } from './src/constants/categorySeo.js';

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    console.error('Directory "dist" not found. Run "vite build" first.');
    process.exit(1);
}

const indexPath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(indexPath, 'utf-8');

const domain = 'https://antreme.kyiv.ua';

// Define static routes
const routes = [
    {
        path: '/',
        title: 'Торти на замовлення Київ | Antreme – Кондитерська майстерня',
        description: 'Авторські торти на замовлення у Києві від кондитерської Antreme. Готуємо з 100% натуральних інгредієнтів: весільні, бенто-торти, дитячі. Доставка по Києву.'
    },
    {
        path: '/cakes',
        title: 'Каталог тортів | Antreme',
        description: 'Повний каталог тортів на замовлення в Києві.'
    },
    {
        path: '/delivery',
        title: 'Доставка та оплата | Antreme',
        description: 'Умови доставки та оплати тортів на замовлення в Києві. Швидка та безпечна доставка кур\'єром.'
    },
    {
        path: '/fillings',
        title: 'Начинки для тортів | Antreme',
        description: 'Вибір натуральних начинок для бісквітних та мусових тортів: Снікерс, Червоний оксамит, Манго-Маракуйя та інші.'
    },
    {
        path: '/about',
        title: 'Про нас | Кондитерська майстерня Antreme',
        description: 'Історія кондитерської Antreme. Ми створюємо ідеальні торти з натуральних інгредієнтів у Києві.'
    },
    {
        path: '/reviews',
        title: 'Відгуки клієнтів | Antreme',
        description: 'Що кажуть наші клієнти про торти Antreme. Справжні відгуки та фото з доставкою по Києву.'
    },
    {
        path: '/holiday',
        title: 'Святкова пропозиція | Antreme',
        description: 'Спеціальні пропозиції та знижки на торти для ваших свят.'
    }
];

// Add category routes dynamically
for (const key in categorySeoData) {
    const cat = categorySeoData[key];
    routes.push({
        path: `/${cat.slug}`,
        title: cat.title,
        description: cat.description
    });
}

async function fetchCakes() {
    try {
        const response = await axios.get('https://cake-shop-backend.onrender.com/cakes/?limit=1000', { timeout: 60000 });
        return response.data;
    } catch (error) {
        console.error("Error fetching cakes for SSG:", error.message);
        return [];
    }
}

async function generatePages() {
    // Fetch products and add them to routes
    const cakes = await fetchCakes();
    cakes.forEach(cake => {
        const title = cake.meta_title || `${cake.name} - Купити в Києві | Antreme`;
        const description = cake.meta_description || `Замовити торт ${cake.name}. ${cake.description?.slice(0, 100)}...`;

        routes.push({
            path: `/cakes/${cake.id}`,
            title: title,
            description: description,
            ogImage: cake.image_url
        });
    });

    console.log(`Starting SSG injection for ${routes.length} pages...`);

    routes.forEach(route => {
        // Determine path
        const relativePath = route.path === '/' ? '' : route.path.replace(/^\//, '');
        const folderPath = path.join(distDir, relativePath);

        // Create subfolder if needed
        if (route.path !== '/') {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const fullUrl = `${domain}${route.path === '/' ? '' : route.path}`;

        // Handle OG image correctly
        let ogImageUrl = '/og-image.jpg';
        if (route.ogImage) {
            ogImageUrl = route.ogImage.startsWith('http') ? route.ogImage : `${domain}${route.ogImage}`;
        } else {
            ogImageUrl = `${domain}/og-image.jpg`;
        }

        // 1. Remove existing <title> and any existing meta description to avoid duplicates
        let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/gi, '');
        html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');

        // Remove existing OG tags and standard canonical from Vite base to avoid duplicates if any
        html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
        html = html.replace(/<meta[^>]*property="og:[^>]*>/gi, '');
        html = html.replace(/<meta[^>]*name="twitter:[^>]*>/gi, '');

        // 2. Prepare our new meta tags block
        const metaTags = `
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <link rel="canonical" href="${fullUrl}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
</head>`;

        // 3. Inject exactly before the closing </head> tag
        html = html.replace(/<\/head>/i, metaTags);

        // 4. Write modified HTML
        const filePath = path.join(folderPath, 'index.html');
        fs.writeFileSync(filePath, html, 'utf-8');

        console.log(`✅ Injected SEO for: ${route.path === '/' ? 'Root (Homepage)' : route.path}`);
    });

    console.log('🎉 SSG SEO Injection complete!');
}

generatePages();

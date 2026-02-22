import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://cake-shop-backend.onrender.com/cakes/?limit=1000';
const BASE_URL = 'https://antreme.kyiv.ua';

const staticRoutes = [
    '/',
    '/cakes',
    '/delivery',
    '/about',
    '/reviews',
    '/holiday',
    '/bento-torty',
    '/biskvitni-torty',
    '/vesilni-torty',
    '/musovi-torty',
    '/kapkeyki',
    '/imbirni-pryaniki',
    '/torty-na-den-narodzhennya',
    '/torty-na-yuviley',
    '/dytyachi-torty',
    '/torty-dlya-khlopchykiv',
    '/torty-dlya-divchatok',
    '/torty-dlya-zhinok',
    '/torty-dlya-cholovikiv',
    '/patriotychni-torty',
    '/torty-na-profesiyne-svyato',
    '/torty-gender-reveal-party',
    '/torty-za-khobi',
    '/korporatyvni-torty',
    '/torty-na-khrestyny',
    '/sezonni-torty',
    '/foto-torty'
];

async function fetchCakes() {
    return new Promise((resolve, reject) => {
        https.get(API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}

async function generateSitemap() {
    try {
        console.log('Fetching cakes for sitemap...');
        const cakes = await fetchCakes();

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        const today = new Date().toISOString().split('T')[0];

        // Static Routes
        staticRoutes.forEach(route => {
            const priority = route === '/' ? '1.0' : '0.9';
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${BASE_URL}${route}</loc>\n`;
            sitemap += `    <lastmod>${today}</lastmod>\n`;
            sitemap += `    <changefreq>daily</changefreq>\n`;
            sitemap += `    <priority>${priority}</priority>\n`;
            sitemap += `  </url>\n`;
        });

        // Dynamic Cake Routes
        cakes.forEach(cake => {
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${BASE_URL}/cakes/${cake.id}</loc>\n`;
            sitemap += `    <lastmod>${today}</lastmod>\n`;
            sitemap += `    <changefreq>weekly</changefreq>\n`;
            sitemap += `    <priority>0.7</priority>\n`;
            sitemap += `  </url>\n`;
        });

        sitemap += `</urlset>`;

        const publicDir = path.join(__dirname, '..', 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        const sitemapPath = path.join(publicDir, 'sitemap.xml');
        fs.writeFileSync(sitemapPath, sitemap, 'utf8');
        console.log(`Sitemap generated successfully at ${sitemapPath} with ${staticRoutes.length + cakes.length} URLs.`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();

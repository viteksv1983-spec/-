import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read category SEO data
import { categorySeoData } from './src/constants/categorySeo.js';

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    console.error('dist directory not found. Run npm run build first.');
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

// Add category routes
for (const key in categorySeoData) {
    const cat = categorySeoData[key];
    routes.push({
        path: `/${cat.slug}`,
        title: cat.title,
        description: cat.description
    });
}

console.log(`Generating ${routes.length} SEO static pages...`);

routes.forEach(route => {
    const folderPath = path.join(distDir, route.path === '/' ? '' : route.path);

    // Create folders if they don't exist
    if (route.path !== '/') {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const fullUrl = `${domain}${route.path === '/' ? '' : route.path}`;

    // Inject SEO tags
    let html = baseHtml;

    // Replace title
    html = html.replace(
        /<title>.*?<\/title>/,
        `<title>${route.title}</title>`
    );

    // Provide default description insertion if not exists, else create it
    const metaTags = `
  <meta name="description" content="${route.description}" />
  <link rel="canonical" href="${fullUrl}" />
  <meta property="og:title" content="${route.title}" />
  <meta property="og:description" content="${route.description}" />
  <meta property="og:url" content="${fullUrl}" />
  <meta name="twitter:title" content="${route.title}" />
  <meta name="twitter:description" content="${route.description}" />`;

    // Inject right after <head>
    html = html.replace('<head>', `<head>${metaTags}`);

    const filePath = path.join(folderPath, 'index.html');
    fs.writeFileSync(filePath, html);
    console.log(`Generated HTML for ${route.path}`);
});

console.log('Static pages generated successfully!');

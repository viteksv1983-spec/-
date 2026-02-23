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

// ─── Group A: Occasion-based (nested under /torty-na-zamovlennya/) ───
const GROUP_A = {
    'vesilni': 'wedding',
    'na-den-narodzhennya': 'birthday',
    'na-yuviley': 'anniversary',
    'dytyachi': 'kids',
    'dlya-hlopchykiv': 'boy',
    'dlya-divchat': 'girl',
    'dlya-zhinok': 'for-women',
    'dlya-cholovikiv': 'for-men',
    'gender-reveal': 'gender-reveal',
    'korporatyvni': 'corporate',
    'sezonni': 'seasonal',
    'foto-torty': 'photo-cakes',
    'profesiine-svyato': 'professional',
    'patriotychni': 'patriotic',
    'na-khrestyny': 'christening',
    'za-hobi': 'hobby',
};

// ─── Group B: Type-based (standalone at root /) ───
const GROUP_B = {
    'bento-torty': 'bento',
    'biskvitni-torty': 'biscuit',
    'musovi-torty': 'mousse',
    'kapkeyky': 'cupcakes',
    'imbirni-pryanyky': 'gingerbread',
    'nachynky': 'fillings',
};

// Reverse map: dbCategory -> { urlSlug, group }
const dbCatToUrl = {};
for (const [slug, dbCat] of Object.entries(GROUP_A)) {
    dbCatToUrl[dbCat] = { slug, group: 'A' };
}
for (const [slug, dbCat] of Object.entries(GROUP_B)) {
    dbCatToUrl[dbCat] = { slug, group: 'B' };
}

function getProductUrl(cake) {
    const info = dbCatToUrl[cake.category];
    if (!info) {
        console.warn(`[WARNING] Category not mapped in GROUP_A or GROUP_B for product: ${cake.name}`);
        // Skip unmapped categories entirely instead of polluting Vercel routes with /cakes/:id
        return null;
    }
    if (info.group === 'A') return `/torty-na-zamovlennya/${info.slug}/${cake.slug}`;
    return `/${info.slug}/${cake.slug}`;
}

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
        path: '/torty-na-zamovlennya',
        title: 'Торти на замовлення Київ | Antreme',
        description: 'Замовити торт на будь-яке свято в Києві. Весільні, дитячі, корпоративні торти від кондитерської Antreme.'
    }
];

// Add Group A category routes (nested under /torty-na-zamovlennya/)
for (const [slug, dbCat] of Object.entries(GROUP_A)) {
    const seoData = categorySeoData[dbCat];
    if (seoData) {
        routes.push({
            path: `/torty-na-zamovlennya/${slug}`,
            title: seoData.title,
            description: seoData.description
        });
    }
}

// Add Group B category routes (standalone at root)
for (const [slug, dbCat] of Object.entries(GROUP_B)) {
    const seoData = categorySeoData[dbCat];
    if (seoData) {
        routes.push({
            path: `/${slug}`,
            title: seoData.title,
            description: seoData.description
        });
    }
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
        if (!cake.slug) {
            console.warn(`[WARNING] Product ${cake.id} missing slug. Migrations required.`);
            return;
        }

        const url = getProductUrl(cake);
        if (!url) return; // Skip if category is mismatched

        const title = cake.meta_title || `${cake.name} - Купити в Києві | Antreme`;
        const description = cake.meta_description || `Замовити торт ${cake.name}. ${cake.description ? cake.description.slice(0, 100) : ''}...`;

        routes.push({
            path: url,
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

        let fullUrl = `${domain}${route.path}`;
        if (fullUrl !== domain + '/' && !fullUrl.endsWith('/')) {
            fullUrl += '/';
        }

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
        //    data-rh="true" ensures react-helmet-async REPLACES these tags
        //    instead of creating duplicates when React loads on client
        const metaTags = `
    <title data-rh="true">${route.title}</title>
    <meta name="description" content="${route.description}" data-rh="true" />
    <link rel="canonical" href="${fullUrl}" data-rh="true" />
    <meta name="robots" content="index, follow" data-rh="true" />
    <meta property="og:type" content="website" data-rh="true" />
    <meta property="og:title" content="${route.title}" data-rh="true" />
    <meta property="og:description" content="${route.description}" data-rh="true" />
    <meta property="og:url" content="${fullUrl}" data-rh="true" />
    <meta property="og:image" content="${ogImageUrl}" data-rh="true" />
    <meta property="og:site_name" content="Antreme – Кондитерська майстерня" data-rh="true" />
    <meta name="twitter:card" content="summary_large_image" data-rh="true" />
    <meta name="twitter:title" content="${route.title}" data-rh="true" />
    <meta name="twitter:description" content="${route.description}" data-rh="true" />
    <meta name="twitter:image" content="${ogImageUrl}" data-rh="true" />
</head>`;

        // 3. Inject meta tags before closing </head> tag
        html = html.replace(/<\/head>/i, metaTags);

        // 3b. Inject JSON-LD schema into <head> (not body) for key routes
        const jsonLd = getSeoJsonLd(route.path);
        if (jsonLd) {
            html = html.replace(/<\/head>/i, `    <script type="application/ld+json" data-rh="true">${jsonLd}</script>\n</head>`);
        }

        // 4. Inject SEO HTML content into <div id="root"> for key routes
        //    This ensures Googlebot sees full content without JavaScript
        const seoContent = getSeoHtmlContent(route.path);
        if (seoContent) {
            html = html.replace(
                '<div id="root"></div>',
                `<div id="root">${seoContent}</div>`
            );
        }

        // 5. Write modified HTML
        const filePath = path.join(folderPath, 'index.html');
        fs.writeFileSync(filePath, html, 'utf-8');

        const hasContent = seoContent ? ' + SEO HTML' : '';
        console.log(`✅ Injected SEO for: ${route.path === '/' ? 'Root (Homepage)' : route.path}${hasContent}`);
    });

    // 6. Create 404.html for Vercel to serve with a genuine 404 HTTP status
    let html404 = baseHtml.replace(/<title>[\s\S]*?<\/title>/gi, '<title>Сторінку не знайдено | Antreme</title>');
    html404 = html404.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    html404 = html404.replace(/<meta[^>]*property="og:[^>]*>/gi, '');
    html404 = html404.replace(/<meta[^>]*name="twitter:[^>]*>/gi, '');
    html404 = html404.replace(/<\/head>/i, `    <meta name="robots" content="noindex, follow" />\n</head>`);

    fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8');
    console.log('✅ Created strict SEO-hardened 404.html');

    console.log('🎉 SSG SEO Injection complete!');
}

// ─── JSON-LD Schema for key routes (injected into <head>) ───
function getSeoJsonLd(routePath) {
    if (routePath === '/') {
        return JSON.stringify([
            {
                "@context": "https://schema.org",
                "@type": ["LocalBusiness", "Bakery"],
                "name": "Antreme",
                "image": "https://antreme.kyiv.ua/og-image.jpg",
                "url": "https://antreme.kyiv.ua/",
                "telephone": "+380979081504",
                "priceRange": "₴₴",
                "areaServed": { "@type": "City", "name": "Kyiv" },
                "sameAs": ["https://www.instagram.com/antreme.kyiv/"],
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Харківське шосе, 180/21",
                    "addressLocality": "Київ",
                    "postalCode": "02091",
                    "addressRegion": "Київська область",
                    "addressCountry": "UA"
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "opens": "09:00",
                    "closes": "20:00"
                }
            },
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    { "@type": "Question", "name": "Чи можна замовити торт у Києві терміново?", "acceptedAnswer": { "@type": "Answer", "text": "Залежить від завантаженості та складності замовлення. Прості торти без складного декору ми іноді виконуємо за 2 дні. Уточнюйте наявність через контакти." } },
                    { "@type": "Question", "name": "За скільки днів потрібно робити замовлення?", "acceptedAnswer": { "@type": "Answer", "text": "Мінімальний термін — 3 робочі дні. Для складних весільних тортів рекомендуємо звертатися за 2–4 тижні." } },
                    { "@type": "Question", "name": "Чи можна обрати індивідуальну начинку?", "acceptedAnswer": { "@type": "Answer", "text": "Так, ми погоджуємо склад до виробництва. Пропонуємо 7+ авторських начинок та складаємо індивідуальні комбінації." } },
                    { "@type": "Question", "name": "Скільки коштує доставка торта по Києву?", "acceptedAnswer": { "@type": "Answer", "text": "Доставка розраховується за тарифами таксі (Uklon/Bolt) від нашої кондитерської до вашої адреси. Самовивіз — безкоштовно." } },
                    { "@type": "Question", "name": "Чи є варіанти без глютену або для алергіків?", "acceptedAnswer": { "@type": "Answer", "text": "Розглядаємо такі запити індивідуально. Звертайтесь — обговоримо склад і можливості для вашого випадку." } },
                    { "@type": "Question", "name": "Чи працюєте ви з корпоративними замовленнями?", "acceptedAnswer": { "@type": "Answer", "text": "Так, виготовляємо торти з брендуванням, логотипом або корпоративними кольорами для будь-якого масштабу заходу." } }
                ]
            }
        ]);
    }
    return null;
}

// ─── SEO HTML Content for key routes (injected into <div id="root">) ───
// createRoot() replaces this content when React loads — this is intentional.
// The static HTML exists solely for Googlebot's initial crawl (view-source).
function getSeoHtmlContent(routePath) {
    const contentMap = {
        '/': getHomepageSeoHtml(),
        '/torty-na-zamovlennya/vesilni': getVesilniSeoHtml(),
        '/torty-na-zamovlennya/na-den-narodzhennya': getNaDenNarodzhenyaSeoHtml(),
        '/torty-na-zamovlennya/dytyachi': getDytyachiSeoHtml(),
    };
    return contentMap[routePath] || null;
}

function getHomepageSeoHtml() {
    // JSON-LD schema is injected into <head> by getSeoJsonLd()
    // This function only returns semantic HTML content for <div id="root">
    return `
<main>
<article>
<h1>Торти на замовлення в Києві — авторська кондитерська Antreme</h1>
<p>Antreme — це авторська кондитерська в Києві з понад 20-річним досвідом роботи. Ми спеціалізуємося на виготовленні <strong>тортів на замовлення в Києві</strong> для приватних подій, весіль, корпоративів та сімейних свят.</p>
<h2>20 років досвіду та понад 6000 виконаних замовлень у Києві</h2>
<p>За роки роботи ми виконали понад 6000 індивідуальних замовлень у Києві. Більше 9000 підписників в Instagram, тисячі реальних фото робіт та живі відгуки.</p>
<h2>Торти на замовлення Київ — індивідуальний підхід</h2>
<p>Кожен <strong>торт на замовлення в Києві</strong> проходить погодження дизайну, ваги, начинки та термінів виготовлення. Середній термін виготовлення — від 3 робочих днів.</p>
<h2>Чому варто замовити торт у Antreme</h2>
<h3>Натуральні інгредієнти</h3>
<p>Вершкове масло, бельгійський шоколад, натуральні вершки, сезонні ягоди та фрукти.</p>
<h3>Індивідуальний дизайн</h3>
<p>Розробляємо концепцію під стиль заходу: мінімалізм, класика, сучасна геометрія або тематичний декор.</p>
<h3>Доставка по Києву</h3>
<p>Доставляємо торти по всіх районах столиці. <a href="/delivery/">Детальніше про доставку →</a></p>
<h2>Доставка тортів у всі райони Києва</h2>
<p>Печерськ, Шевченківський, Голосіївський, Солом'янка, Оболонь, Поділ, Дарниця, Позняки, Осокорки, Троєщина, Святошин та інші.</p>
<h2>Популярні категорії тортів</h2>
<ul>
<li><a href="/torty-na-zamovlennya/vesilni/">Весільні торти</a> — багатоярусні конструкції</li>
<li><a href="/torty-na-zamovlennya/na-den-narodzhennya/">Торти на день народження</a> — індивідуальні написи</li>
<li><a href="/torty-na-zamovlennya/dytyachi/">Дитячі торти</a> — контроль складу, безпечні барвники</li>
<li><a href="/bento-torty/">Бенто-торти</a> — компактний формат</li>
</ul>
<h2>Начинки</h2>
<p>Шоколадний трюфель, полуниця з вершками, карамель-банан, лісова ягода, фісташка-малина, лимонний чізкейк, кокос-манго. <a href="/nachynky/">Усі начинки →</a></p>
<h2>Як замовити торт у Києві</h2>
<ol>
<li>Надішліть запит через сайт або месенджер</li>
<li>Узгодьте деталі замовлення</li>
<li>Внесіть передоплату для фіксації дати</li>
<li>Отримайте торт із доставкою або самовивозом</li>
</ol>
<h2>Реальні відгуки та портфоліо</h2>
<p>Понад 6000 замовлень та тисячі фото робіт. <a href="/reviews/">Переглянути відгуки →</a></p>
<p><a href="/about/">Детальніше про нашу кондитерську →</a></p>
</article>
<section>
<h2>Часті запитання</h2>
<div><h3>Чи можна замовити торт терміново?</h3><p>Так, у деяких випадках можливе виготовлення від 24–48 годин.</p></div>
<div><h3>Чи можливі безглютенові варіанти?</h3><p>Такі запити розглядаються індивідуально. Напишіть нам.</p></div>
<div><h3>Яка передоплата?</h3><p>Передоплата фіксує дату виробництва. Відсоток уточнюється при оформленні.</p></div>
<div><h3>Скільки зберігається торт?</h3><p>У холодильнику 2–5 днів залежно від начинки.</p></div>
<div><h3>Чи доставляєте по всіх районах Києва?</h3><p>Так — лівий і правий берег. Вартість за тарифами таксі. Самовивіз — безкоштовно.</p></div>
<div><h3>Чи працюєте з корпоративними замовленнями?</h3><p>Так, виготовляємо торти з брендуванням для будь-якого масштабу заходу.</p></div>
</section>
</main>`;
}

function getVesilniSeoHtml() {
    return `
<main>
<h1>Весільні торти на замовлення в Києві — Antreme</h1>
<p>Авторські <strong>весільні торти на замовлення в Києві</strong> від кондитерської Antreme. Багатоярусні конструкції, елегантний декор, натуральні інгредієнти. Кожен весільний торт створюється індивідуально під стиль вашого свята.</p>
<h2>Чому обирають весільні торти Antreme</h2>
<ul>
<li>Індивідуальний дизайн під стиль весілля</li>
<li>Розрахунок ваги відповідно до кількості гостей</li>
<li>Натуральні інгредієнти: бельгійський шоколад, вершки, ягоди</li>
<li><a href="/delivery/">Безпечна доставка по Києву</a></li>
</ul>
<h2>Як замовити весільний торт</h2>
<p>Рекомендуємо звертатися за 2–4 тижні до весілля. <a href="/nachynky/">Оберіть начинку →</a></p>
<p><a href="/torty-na-zamovlennya/">← Усі категорії тортів</a> | <a href="/reviews/">Відгуки клієнтів →</a></p>
</main>`;
}

function getNaDenNarodzhenyaSeoHtml() {
    return `
<main>
<h1>Торти на день народження на замовлення Київ — Antreme</h1>
<p>Яскраві та смачні <strong>торти на день народження</strong> від кондитерської Antreme у Києві. Індивідуальний дизайн, тематичні написи, будь-яка кількість ярусів. Створюємо святковий настрій від першого погляду.</p>
<h2>Торти на день народження для будь-якого віку</h2>
<ul>
<li>Тематичний декор під стиль свята</li>
<li>Індивідуальні написи та прикраси</li>
<li>7+ начинок на вибір</li>
<li><a href="/delivery/">Доставка по всьому Києву</a></li>
</ul>
<p><a href="/nachynky/">Оберіть начинку →</a> | <a href="/reviews/">Відгуки клієнтів →</a></p>
<p><a href="/torty-na-zamovlennya/">← Усі категорії тортів</a></p>
</main>`;
}

function getDytyachiSeoHtml() {
    return `
<main>
<h1>Дитячі торти на замовлення в Києві — Antreme</h1>
<p>Казкові <strong>дитячі торти на замовлення в Києві</strong> від кондитерської Antreme. Контроль складу, безпечні барвники, погодження алергенів. Кожен торт створюється з любов'ю до найменших деталей.</p>
<h2>Дитячі торти від Antreme</h2>
<ul>
<li>Контроль складу та погодження алергенів</li>
<li>Безпечні натуральні барвники</li>
<li>Казкові дизайни: мультгерої, тварини, принцеси</li>
<li><a href="/delivery/">Бережна доставка по Києву</a></li>
</ul>
<p><a href="/nachynky/">Оберіть начинку →</a> | <a href="/reviews/">Відгуки клієнтів →</a></p>
<p><a href="/torty-na-zamovlennya/">← Усі категорії тортів</a></p>
</main>`;
}

generatePages();

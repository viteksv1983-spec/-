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
        path: '/dostavka',
        title: 'Доставка та оплата | Antreme',
        description: 'Умови доставки та оплати тортів на замовлення в Києві. Швидка та безпечна доставка кур\'єром.'
    },
    {
        path: '/nachynky',
        title: 'Начинки для тортів на замовлення в Києві — смаки | Antreme',
        description: 'Оберіть начинку для торта на замовлення в Києві. Шоколадні, фруктові, мусові та класичні смаки. Натуральні інгредієнти. Авторська кондитерська Antreme.'
    },
    {
        path: '/pro-nas',
        title: 'Про нас | Кондитерська майстерня Antreme',
        description: 'Історія кондитерської Antreme. Ми створюємо ідеальні торти з натуральних інгредієнтів у Києві.'
    },
    {
        path: '/vidguky',
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
    const apiURL = 'https://cake-shop-backend.onrender.com/cakes/?limit=1000';
    console.log(`\n⏳ Запит до ${apiURL}...`);
    try {
        const response = await axios.get(apiURL, { timeout: 5000 });
        console.log(`✅ Успішно отримано ${response.data.length} товарів для SSG.`);
        return response.data;
    } catch (error) {
        console.log(`⚠️ УВАГА: Бекенд недоступний або "спить" (Render Free Tier) - ${error.message}.`);
        console.log(`⏭️ Пропуск генерації SSG для карток товарів. Категорії генеруються успішно...`);
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
    if (routePath === '/nachynky') {
        return JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Яка начинка найпопулярніша?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Найпопулярніші наші начинки — це 'Снікерс' та 'Фісташка-малина'. Вони мають збалансований смак та подобаються більшості гостей."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Чи можна поєднати дві начинки в одному торті?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Для стабільності одного ярусу ми використовуємо одну начинку. Проте у багатоярусних тортах ви можете обрати окремий смак для кожного ярусу."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Чи можна зробити торт менш солодким?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Так, ми працюємо з натуральними інгредієнтами та можемо адаптувати рівень солодкості за вашим бажанням."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Які начинки найкраще підходять для дітей?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Для дитячих свят ми рекомендуємо легкі та зрозумілі смаки: 'Полуниця-вершки', 'Молочна дівчинка' або 'Ванільний бісквіт'."
                    }
                }
            ]
        });
    }

    if (routePath === '/torty-na-zamovlennya') {
        return JSON.stringify([
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Торти на замовлення в Києві",
                "description": "Замовити торт у Києві від кондитерської Antreme. Весільні, дитячі, святкові та корпоративні торти з доставкою.",
                "url": "https://antreme.kyiv.ua/torty-na-zamovlennya/",
                "hasPart": {
                    "@type": "ItemList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Весільні торти" },
                        { "@type": "ListItem", "position": 2, "name": "Дитячі торти" },
                        { "@type": "ListItem", "position": 3, "name": "Торти на день народження" },
                        { "@type": "ListItem", "position": 4, "name": "Корпоративні торти" }
                    ]
                }
            }
        ]);
    }
    if (routePath === '/torty-na-zamovlennya/vesilni') {
        return JSON.stringify([
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    { "@type": "Question", "name": "За скільки часу потрібно замовити весільний торт?", "acceptedAnswer": { "@type": "Answer", "text": "Рекомендуємо оформити замовлення за 2–4 тижні до дати весілля, щоб ми встигли продумати кожну деталь." } },
                    { "@type": "Question", "name": "Чи можна замовити дегустацію?", "acceptedAnswer": { "@type": "Answer", "text": "Так, за попереднім записом доступна дегустація начинок. Зв'яжіться з нами для узгодження." } },
                    { "@type": "Question", "name": "Чи робите ви доставку до ресторану?", "acceptedAnswer": { "@type": "Answer", "text": "Так, ми доставляємо та встановлюємо багатоярусні торти безпосередньо на локації." } },
                    { "@type": "Question", "name": "Чи можна змінити дизайн після узгодження?", "acceptedAnswer": { "@type": "Answer", "text": "Так, корективи можливі до початку виробництва. Узгоджуємо зміни індивідуально." } },
                    { "@type": "Question", "name": "Яка передоплата?", "acceptedAnswer": { "@type": "Answer", "text": "Передоплата фіксує дату та складає 50% від вартості замовлення. Решту — при отриманні." } }
                ]
            },
            {
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Весільні торти на замовлення у Києві",
                "serviceType": "Wedding Cake Custom Design",
                "areaServed": "Kyiv",
                "provider": "Antreme"
            },
            {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": "Весільний торт на замовлення",
                "brand": "Antreme",
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "UAH",
                    "price": "650",
                    "availability": "InStock"
                }
            }
        ]);
    }
    if (routePath === '/torty-na-zamovlennya/na-den-narodzhennya') {
        return JSON.stringify([
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    { "@type": "Question", "name": "За скільки днів потрібно замовити торт?", "acceptedAnswer": { "@type": "Answer", "text": "Рекомендуємо оформлювати замовлення за 3-5 днів до дати свята, щоб ми встигли підготувати дизайн та необхідні інгредієнти." } },
                    { "@type": "Question", "name": "Чи можна зробити термінове замовлення?", "acceptedAnswer": { "@type": "Answer", "text": "Так, ми намагаємось йти назустріч і часто беремо термінові замовлення 'на завтра'. Зателефонуйте нам для уточнення можливості." } },
                    { "@type": "Question", "name": "Чи робите торти без цукру або глютену?", "acceptedAnswer": { "@type": "Answer", "text": "На жаль, наразі ми не виготовляємо безглютенові або безцукрові десерти, оскільки наша рецептура базується на класичних інгредієнтах вищої якості." } },
                    { "@type": "Question", "name": "Чи можливий фотодрук?", "acceptedAnswer": { "@type": "Answer", "text": "Звичайно! Ми можемо надрукувати будь-яке фото, логотип чи картинку на їстівному цукровому папері безпечними харчовими барвниками." } }
                ]
            }
        ]);
    }
    if (routePath === '/torty-na-zamovlennya/na-yuviley') {
        return JSON.stringify([
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    { "@type": "Question", "name": "За скільки днів потрібно замовляти?", "acceptedAnswer": { "@type": "Answer", "text": "Рекомендуємо оформити замовлення за 5-7 днів до ювілею, щоб ми змогли підготувати дизайн потрібної складності та потрібні інгредієнти." } },
                    { "@type": "Question", "name": "Чи можна змінити дизайн?", "acceptedAnswer": { "@type": "Answer", "text": "Так, кожен торт створюється за індивідуальним дизайном. Ви можете обрати будь-який декор або надіслати нам фото бажаного торта." } },
                    { "@type": "Question", "name": "Чи можна зробити торт з фото?", "acceptedAnswer": { "@type": "Answer", "text": "Звичайно! Ми робимо якісний їстівний фотодрук на цукровому папері для ювілярів." } },
                    { "@type": "Question", "name": "Чи доставляєте ви за місто?", "acceptedAnswer": { "@type": "Answer", "text": "Так, можлива доставка в передмістя Києва. Вартість розраховується індивідуально за тарифами таксі." } }
                ]
            }
        ]);
    }
    if (routePath === '/torty-na-zamovlennya/dlya-zhinok') {
        return JSON.stringify([
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    { "@type": "Question", "name": "Чи можна зробити індивідуальний напис?", "acceptedAnswer": { "@type": "Answer", "text": "Так, ми безкоштовно робимо будь-який напис на торті або шоколадній табличці за вашим бажанням." } },
                    { "@type": "Question", "name": "Чи використовуються живі квіти?", "acceptedAnswer": { "@type": "Answer", "text": "Так, за запитом ми декоруємо торти живими квітами (троянди, еустоми, півонії), які попередньо обробляються та ізолюються від десерту." } },
                    { "@type": "Question", "name": "За скільки днів потрібно замовляти?", "acceptedAnswer": { "@type": "Answer", "text": "Рекомендуємо оформити замовлення за 3-5 днів до свята, щоб ми встигли підготувати дизайн потрібної складності та свіжі квіти, якщо вони є в декорі." } }
                ]
            }
        ]);
    }
    if (routePath === '/torty-na-zamovlennya/dlya-hlopchykiv') {
        return JSON.stringify([
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    { "@type": "Question", "name": "Скільки коштує дитячий торт для хлопчика?", "acceptedAnswer": { "@type": "Answer", "text": "Ціна залежить від ваги та декору. Базова вартість — від 650 грн за кг. Мінімальне замовлення зазвичай від 1.5 кг. Складні фігурки супергероїв чи машин розраховуються додатково." } },
                    { "@type": "Question", "name": "Як замовити торт хлопчику в Києві?", "acceptedAnswer": { "@type": "Answer", "text": "Ви можете обрати дизайн у нашому каталозі або надіслати власне фото. Замовлення приймаємо через сайт, месенджери або телефоном. Бажано за 3-5 днів до свята." } },
                    { "@type": "Question", "name": "Чи робите ви доставку по Києву?", "acceptedAnswer": { "@type": "Answer", "text": "Так, ми здійснюємо адресну доставку по всьому Києву у спеціальних термобоксах, що гарантує збереження вигляду та свіжості торта." } },
                    { "@type": "Question", "name": "Які начинки ви порадите для дітей?", "acceptedAnswer": { "@type": "Answer", "text": "Для дитячих свят ми рекомендуємо натуральні та легкі начинки: 'Полунична ніжність', ванільний бісквіт з йогуртовим кремом або шоколадний 'Снікерс'." } },
                    { "@type": "Question", "name": "Чи можна зробити торт з улюбленим героєм?", "acceptedAnswer": { "@type": "Answer", "text": "Так! Ми створюємо торти з будь-якими героями мультфільмів, ігор чи коміксів за допомогою пряничних топперів, мастичних фігурок або фотодруку." } }
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
        '/torty-na-zamovlennya': getTortyNaZamovlennyaSeoHtml(),
        '/torty-na-zamovlennya/vesilni': getVesilniSeoHtml(),
        '/torty-na-zamovlennya/na-den-narodzhennya': getNaDenNarodzhenyaSeoHtml(),
        '/torty-na-zamovlennya/na-yuviley': getAnniversarySeoHtml(),
        '/torty-na-zamovlennya/dlya-zhinok': getForWomenSeoHtml(),
        '/torty-na-zamovlennya/dlya-cholovikiv': getForMenSeoHtml(),
        '/torty-na-zamovlennya/dytyachi': getDytyachiSeoHtml(),
        '/torty-na-zamovlennya/dlya-hlopchykiv': getBoySeoHtml(),
        '/bento-torty': getBentoSeoHtml(),
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
<p>Понад 6000 замовлень та тисячі фото робіт. <a href="/vidguky/">Переглянути відгуки →</a></p>
<p><a href="/pro-nas/">Детальніше про нашу кондитерську →</a></p>
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

function getForWomenSeoHtml() {
    return `<main>
<article>
<h1>Торти для жінок на замовлення в Києві</h1>
<p>Кондитерська Antreme створює торти для жінок на замовлення в Києві з урахуванням віку, стилю свята та побажань щодо декору. Ми виготовляємо святкові композиції для дня народження, ювілею, професійного свята або романтичної події.</p>
<p>Кожен торт розробляється індивідуально — від мінімалістичних сучасних дизайнів до ніжних квіткових композицій.</p>

<h2>Переваги замовлення торта для жінки в Antreme</h2>
<ul>
<li><strong>Індивідуальний дизайн під стиль жінки:</strong> Розробляємо оформлення під вік, інтереси та формат події.</li>
<li><strong>Авторські начинки:</strong> Ніжні муси, фруктові конфітюри та насичені бісквіти.</li>
<li><strong>Можливість декору живими квітами:</strong> Троянди, півонії, еустоми для вишуканого вигляду.</li>
<li><strong>Доставка по Києву:</strong> Обережна безпечна доставка.</li>
</ul>

<h2>Популярні варіанти тортів для жінок</h2>
<ul>
<li>Торт для мами</li>
<li>Торт для дружини</li>
<li>Торт для сестри</li>
<li>Торт для колеги</li>
<li>Торт на 30, 40, 50 років</li>
</ul>
<p>Дивіться також <a href="/torty-na-zamovlennya/na-den-narodzhennya/">торти на день народження</a> та спеціальні варіанти <a href="/torty-na-zamovlennya/na-yuviley/">на ювілей</a>.</p>

<h2>Скільки коштує торт для жінки у Києві?</h2>
<p>Вартість залежить від ваги та складності декору:</p>
<ul>
<li>Торти — від 650 грн/кг</li>
<li>Складні квіткові композиції — розрахунок індивідуально</li>
<li>Мінімальна вага — від 1 кг</li>
</ul>

<h2>Начинки для святкового торта</h2>
<p>Ми пропонуємо понад 15 авторських начинок, серед яких: Фісташка-малина, Полуниця-вершки, Шоколадний мус, Лимонний крем. Детальніше на сторінці <a href="/nachynky/">Начинки</a>.</p>

<h2>Доставка тортів для жінок по Києву</h2>
<p>Ми доставляємо замовлення у всі райони Києва: Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський та інші. Детальніше дивіться у розділі <a href="/delivery/">Доставка</a>.</p>

<h2>Поширені запитання (FAQ)</h2>
<div>
<h3>Чи можна зробити індивідуальний напис?</h3>
<p>Так, ми безкоштовно робимо будь-який напис на торті або шоколадній табличці за вашим бажанням.</p>
</div>
<div>
<h3>Чи використовуються живі квіти?</h3>
<p>Так, за запитом ми декоруємо торти живими квітами (троянди, еустоми, півонії), які попередньо обробляються та ізолюються від десерту.</p>
</div>
<div>
<h3>За скільки днів потрібно замовляти?</h3>
<p>Рекомендуємо оформити замовлення за 3-5 днів до свята, щоб ми встигли підготувати дизайн потрібної складності та свіжі квіти, якщо вони є в декорі.</p>
</div>
</article>
</main>`;
}

function getForMenSeoHtml() {
    return `<main>
<article>
<h1>Торти для чоловіків на замовлення в Києві</h1>
<p>Кондитерська Antreme створює торти для чоловіків на замовлення в Києві — для дня народження, ювілею або корпоративної події. Ми враховуємо характер, стиль та інтереси іменинника, створюючи сучасні, стримані або тематичні дизайни.</p>
<p>Кожен чоловічий торт виготовляється індивідуально — від мінімалістичних композицій до тематичних декорів з урахуванням хобі чи професії.</p>

<h2>Переваги замовлення торта для чоловіка в Antreme</h2>
<ul>
<li><strong>Сучасний стриманий дизайн:</strong> Використовуємо лаконічні кольори, бетонні текстури, мінімалізм.</li>
<li><strong>Індивідуальні написи та цифри:</strong> Безкоштовно додаємо ім'я, вік або побажання.</li>
<li><strong>Понад 15 начинок:</strong> Насичені шоколадні, горіхові та класичні смаки.</li>
<li><strong>Доставка по Києву:</strong> Надійна доставка у потрібний час.</li>
</ul>

<h2>Популярні варіанти тортів для чоловіків</h2>
<ul>
<li>Торт для чоловіка на день народження</li>
<li>Торт для тата</li>
<li>Торт для керівника</li>
<li>Торт на 30, 40, 50 років</li>
<li>Тематичні торти за хобі</li>
</ul>
<p>Також ми створюємо універсальні <a href="/torty-na-zamovlennya/na-den-narodzhennya/">торти на день народження</a> та розкішні варіанти <a href="/torty-na-zamovlennya/na-yuviley/">на ювілей</a>.</p>

<h2>Скільки коштує торт для чоловіка у Києві?</h2>
<p>Вартість залежить від ваги та складності декору:</p>
<ul>
<li>Торти — від 650 грн/кг</li>
<li>Тематичні композиції — розрахунок індивідуально</li>
<li>Мінімальна вага — від 1 кг</li>
</ul>

<h2>Начинки для святкового чоловічого торта</h2>
<p>Ми пропонуємо понад 15 авторських начинок: Шоколадний трюфель, Снікерс, Фісташка-малина, Карамель-горіх. Виберіть найкращий смак на сторінці <a href="/nachynky/">Начинки</a>.</p>

<h2>Доставка тортів для чоловіків по Києву</h2>
<p>Ми доставляємо замовлення у всі райони Києва: Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський, Солом’янський та інші. Умови читайте у розділі <a href="/delivery/">Доставка</a>.</p>

<h2>Поширені запитання (FAQ)</h2>
<div>
<h3>Чи можна зробити тематичний дизайн?</h3>
<p>Так, ми створюємо торти з улюбленими авто, на тему спорту, з міні-пляшечками алкоголю тощо.</p>
</div>
<div>
<h3>Чи можна додати цифру віку?</h3>
<p>Так, ми можемо додати шоколадні цифри або зробити топпер з віком та індивідуальним написом.</p>
</div>
<div>
<h3>За скільки днів потрібно замовляти?</h3>
<p>Бажано оформити замовлення за 3-5 днів. Проте ми також приймаємо термінові замовлення за 1-2 дні.</p>
</div>
</article>
</main>`;
}

function getAnniversarySeoHtml() {
    return `<main>
<article>
<h1>Ювілейні торти на замовлення в Києві</h1>
<p>Ювілей — особлива дата, яка потребує особливого десерту. Кондитерська Antreme створює <strong>ювілейні торти на замовлення в Києві</strong> для 18, 30, 40, 50 та інших річниць.</p>
<p>Ми враховуємо вік, стиль заходу, формат святкування та кількість гостей. Кожен торт виготовляється індивідуально — без шаблонів і масового виробництва. Понад 6000 виконаних замовлень та 20 років досвіду гарантують стабільну якість та безпечні інгредієнти.</p>

<h2>Переваги замовлення ювілейного торта у нас</h2>
<ul>
<li><strong>Індивідуальний дизайн:</strong> Створюємо оформлення під ваш вік і стиль (18, 30, 40, 50 років).</li>
<li><strong>Об'ємні цифри:</strong> Використовуємо декорацію у вигляді цифр, цифрові композиції та індивідуальні написи.</li>
<li><strong>Понад 15 начинок:</strong> Ніжні креми, бісквіти та соковиті фрукти, які задовольнять будь-який смак.</li>
<li><strong>Надійна доставка:</strong> Доставка по Києву точно в строк у всі райони, зокрема Печерськ, Оболонь, Осокорки, Позняки.</li>
</ul>

<h2>Скільки коштує ювілейний торт у Києві?</h2>
<p>Вартість ювілейного торту залежить від ваги, складності декору та обраного формату. Святкові торти з різноманітними начинками коштують <strong>від 650 грн за 1 кг</strong>. Мінімальна вага для створення індивідуального торта — <strong>від 1 кг</strong>. Декорації з об'ємними цифрами, золочення чи складні елементи оформлення розраховуються індивідуально.</p>

<h2>Популярні ювілейні дизайни</h2>
<ul>
<li>Торт на 18 років — молодіжні та оригінальні.</li>
<li>Торт на 30 років — стильні та елегантні.</li>
<li>Торт на 40 років — з гумором або класичні.</li>
<li>Торт на 50 років — розкішні, багатоярусні або з золотом.</li>
<li>Ювілейні композиції у вигляді цифр та літер.</li>
</ul>

<h2>Начинки для ювілейного торта</h2>
<p>Ми пропонуємо понад 15 класичних і авторських смакових комбінацій. Зробіть торт ніжним і легким або насичено шоколадним за вашим вибором. У нас є смаки на будь-який запит: Снікерс, Червоний оксамит, Манго-Маракуйя, Лісова ягода, Фісташка-Малина. Детальніше дивіться у розділі <a href="/nachynky/">Начинки</a>.</p>

<h2>Доставка ювілейних тортів по Києву</h2>
<p>Ми здійснюємо безпечну та вчасну доставку по всіх районах столиці. Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський, Солом’янський та інші райони Києва. Також доставляємо у передмістя (тарифи узгоджуються індивідуально). Детальніше на сторінці <a href="/delivery/">Доставка та оплата</a>.</p>

<h3>Як замовити торт на ювілей?</h3>
<ol>
<li>Оберіть начинку та визначтеся з вагою (відштовхуючись від кількості гостей).</li>
<li>Визначте стиль: колірна гама, побажання щодо декору, наявність цифр чи фотодруку.</li>
<li>Зв'яжіться з нами по телефону (097) 908-15-04 для остаточного підтвердження та оформлення замовлення.</li>
<li>Отримайте торт з доставкою по Києву або заберіть самостійно.</li>
</ol>

<h2>Поширені запитання (FAQ)</h2>
<div>
<h3>За скільки днів потрібно замовляти?</h3>
<p>Рекомендуємо оформити замовлення за 5-7 днів до ювілею, щоб ми змогли підготувати дизайн потрібної складності та потрібні інгредієнти.</p>
</div>
<div>
<h3>Чи можна змінити дизайн?</h3>
<p>Так, кожен торт створюється за індивідуальним дизайном. Ви можете обрати будь-який декор або надіслати нам фото бажаного торта.</p>
</div>
<div>
<h3>Чи можна зробити торт з фото?</h3>
<p>Звичайно! Ми робимо якісний їстівний фотодрук на цукровому папері для ювілярів.</p>
</div>
<div>
<h3>Чи доставляєте ви за місто?</h3>
<p>Так, можлива доставка в передмістя Києва. Вартість розраховується індивідуально за тарифами таксі.</p>
</div>
</article>
</main>`;
}

function getTortyNaZamovlennyaSeoHtml() {
    return `
    <div class="max-w-3xl mx-auto text-center mb-8 px-4">
        <p class="text-gray-700 text-sm md:text-base mb-6 leading-relaxed">
            Замовити торт у Києві — індивідуальний підхід до кожного свята. Створюємо авторські торти з натуральних інгредієнтів. Понад 6000 виконаних замовлень та доставка по всіх районах Києва.
        </p>
        
        <div class="flex flex-wrap justify-center gap-2 md:gap-3">
            <span class="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-[#1d263b] shadow-sm border border-[#E8C064]/30 flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-[#E8C064]"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                Індивідуальний дизайн та декор
            </span>
            <span class="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-[#1d263b] shadow-sm border border-[#E8C064]/30 flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-[#E8C064]"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                Понад 15 авторських начинок
            </span>
            <span class="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-[#1d263b] shadow-sm border border-[#E8C064]/30 flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-[#E8C064]"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                Прозора вартість без прихованих доплат
            </span>
            <span class="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-[#1d263b] shadow-sm border border-[#E8C064]/30 flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-[#E8C064]"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                Доставка у всі райони Києва
            </span>
        </div>
    </div>

    <!-- Navigation links for bots (replacing actual JS grid items) -->
    <section class="container mx-auto" style="display:none;">
        <a href="/torty-na-zamovlennya/vesilni/">Весільні торти на замовлення в Києві</a>
        <a href="/torty-na-zamovlennya/dytyachi/">Дитячі торти Київ</a>
        <a href="/torty-na-zamovlennya/dlya-zhinok/">Торт для жінки на замовлення Київ</a>
        <a href="/torty-na-zamovlennya/dlya-cholovikiv/">Торт для чоловіка Київ</a>
        <a href="/torty-na-zamovlennya/na-yuviley/">Ювілейний торт Київ</a>
    </section>

    <section class="seo-content-block container mx-auto max-w-4xl bg-white rounded-3xl p-8 md:p-14 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-16 mb-12">
        <h2 class="text-2xl md:text-3xl font-black text-[#1d263b] mb-6 tracking-tight text-center md:text-left" style="font-family: 'Oswald', sans-serif;">
            Торти на замовлення в Києві — ціна, терміни, умови
        </h2>
        <div class="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed md:leading-loose">
            <p>
                Якщо ви шукаєте, де замовити торт у Києві з гарантією якості та своєчасної доставки, Antreme пропонує професійний підхід до кожного замовлення. Ми працюємо виключно під індивідуальний запит — від мінімалістичних бенто-тортів до багатоярусних <a href="/torty-na-zamovlennya/vesilni/" class="text-[#a0153e] font-medium hover:underline">весільних композицій</a>.
            </p>

            <h3 class="text-lg md:text-xl font-bold text-[#1d263b] mt-8 mb-4">Скільки коштує торт на замовлення?</h3>
            <p>Вартість залежить від ваги, складності декору та обраної начинки:</p>
            <ul class="list-disc list-inside space-y-1 my-4">
                <li>Бенто-торти — від 300 грн</li>
                <li>Святкові та дитячі торти — від 650 грн за 1 кг</li>
                <li>Весільні торти — розрахунок індивідуально</li>
                <li>Корпоративні торти — за технічним завданням</li>
            </ul>
            <p>Мінімальна вага стандартного торта — від 1 кг.</p>

            <h3 class="text-lg md:text-xl font-bold text-[#1d263b] mt-8 mb-4">Доставка тортів по Києву</h3>
            <p>Ми доставляємо торти у всі райони Києва: Печерський, Шевченківський, Голосіївський, Солом’янський, Дарницький, Оболонський, Подільський, Деснянський та інші. Доставка здійснюється з дотриманням температурного режиму.</p>

            <h3 class="text-lg md:text-xl font-bold text-[#1d263b] mt-8 mb-4">Чому варто замовити торт саме у Antreme?</h3>
            <ul class="list-disc list-inside space-y-1 my-4">
                <li>Натуральні інгредієнти преміум-класу</li>
                <li>Власне виробництво без посередників</li>
                <li>Понад 6000 виконаних замовлень</li>
                <li><a href="/vidguky/" class="text-[#a0153e] font-medium hover:underline">Реальні відгуки клієнтів</a></li>
                <li>Контроль якості на кожному етапі</li>
            </ul>

            <h3 class="text-lg md:text-xl font-bold text-[#1d263b] mt-8 mb-4">Як оформити замовлення?</h3>
            <ol class="list-decimal list-inside space-y-1 my-4">
                <li>Обрати категорію та дизайн</li>
                <li>Узгодити начинку та вагу</li>
                <li>Погодити дату доставки</li>
                <li>Внести передоплату для фіксації замовлення</li>
            </ol>
            <p class="mt-6 font-medium">
                Замовити торт можна через форму на сайті або за телефоном у контактах.
            </p>
        </div>
    </section>

    <!-- FAQ БЛОК -->
    <section class="faq container mx-auto max-w-5xl lg:max-w-[1050px] mb-16">
        <h2 class="text-2xl md:text-3xl font-black text-[#1d263b] mb-6 text-center tracking-tight" style="font-family: 'Oswald', sans-serif;">
            Часті запитання
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <h3 class="font-bold text-gray-900 mb-2">За скільки днів потрібно замовляти торт?</h3>
                <p class="text-gray-600 text-sm leading-relaxed">Рекомендуємо оформити замовлення за 2–4 дні. Весільні торти — за 2–3 тижні.</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <h3 class="font-bold text-gray-900 mb-2">Чи можна замовити терміново?</h3>
                <p class="text-gray-600 text-sm leading-relaxed">У деяких випадках можливе виготовлення за 24–48 годин за наявності вільного виробничого часу.</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow md:col-span-2">
                <h3 class="font-bold text-gray-900 mb-2">Чи можна змінити дизайн?</h3>
                <p class="text-gray-600 text-sm leading-relaxed">Так, кожен проєкт розробляється індивідуально відповідно до ваших побажань.</p>
            </div>
        </div>
    </section>
</main>`;
}

function getVesilniSeoHtml() {
    return `
<main>
    <h1>Весільні торти на замовлення в Києві</h1>

    <!-- ── БЛОК 2: Про весільні торти (Основний блок) ── -->
    <section class="category-intro mt-8 mx-auto px-4">
        <h2>
            Весільний торт у Києві — авторський дизайн для вашого особливого дня
        </h2>
        
        <p class="intro-text">
            Весільний торт — це фінальний акцент святкового вечора та важлива частина атмосфери вашого весілля. У кондитерській Antreme ми створюємо весільні торти на замовлення в Києві з урахуванням стилю події, кількості гостей та ваших побажань до смаку й декору.
        </p>
        
        <p class="intro-text">
            Ми працюємо понад 20 років та виконали більше 6000 замовлень у Києві. Кожен весільний торт виготовляється індивідуально — без шаблонів і масового виробництва. Ви отримуєте унікальний десерт, який повністю відповідає концепції вашого весілля.
        </p>

        <p class="intro-text">
            Якщо ви шукаєте, де замовити весільний торт у Києві з доставкою та гарантією якості — Antreme працює саме в цьому сегменті.
        </p>
    </section>

    <!-- ── БЛОК 3: Переваги (карточки) ── -->
    <section class="bg-[#FDFBF7] py-12 md:py-16 border-t border-b border-gray-100">
        <div class="max-w-6xl mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div class="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">👑</div>
                    <h3 class="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style="font-family: 'Oswald', sans-serif;">20 років досвіду</h3>
                    <p class="text-gray-500 text-sm">Експертиза підтверджена часом</p>
                </div>
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div class="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">❤️</div>
                    <h3 class="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style="font-family: 'Oswald', sans-serif;">6000+ виконаних замовлень</h3>
                    <p class="text-gray-500 text-sm">Довіряють найважливіші події</p>
                </div>
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div class="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🎨</div>
                    <h3 class="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style="font-family: 'Oswald', sans-serif;">Індивідуальний дизайн</h3>
                    <p class="text-gray-500 text-sm">Будь-які ідеї та оформлення</p>
                </div>
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div class="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🚕</div>
                    <h3 class="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style="font-family: 'Oswald', sans-serif;">Доставка по Києву</h3>
                    <p class="text-gray-500 text-sm">Бережне перевезення до ресторану</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ── БЛОК 4: Скільки коштує весільний торт ── -->
    <section class="py-10 md:py-14">
        <div class="max-w-3xl mx-auto px-4 md:px-8">
            <div class="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-[0_4px_20px_rgba(232,192,100,0.15)] flex flex-col items-start md:items-center text-left md:text-center">
                <div class="flex items-center gap-3 mb-4 mx-auto justify-center w-full">
                    <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">💰</div>
                    <h2 class="text-xl md:text-2xl font-black text-gray-900 tracking-tight text-left md:text-center" style="font-family: 'Oswald', sans-serif;">
                        Скільки коштує весільний торт у Києві
                    </h2>
                </div>
                <p class="text-gray-600 mb-6 text-sm md:text-base text-center w-full max-w-lg mx-auto">
                    Вартість весільного торта залежить від ваги, кількості ярусів, складності декору та обраної начинки.
                </p>
                <ul class="space-y-3 mb-6 w-full max-w-sm mx-auto text-left">
                    <li class="flex items-start gap-3 text-gray-700 font-medium"><span class="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#B8860B]">✓</span>Мінімальна вага весільного торта — від 1 кг</li>
                    <li class="flex items-start gap-3 text-gray-700 font-medium"><span class="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#B8860B]">✓</span>Середня вага для весілля на 50 гостей — 5–6 кг</li>
                    <li class="flex items-start gap-3 text-gray-700 font-medium"><span class="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#B8860B]">✓</span>Вартість — від 650 грн за кг</li>
                    <li class="flex items-start gap-3 text-gray-700 font-medium"><span class="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#B8860B]">✓</span>Фінальна ціна розраховується після погодження дизайну</li>
                </ul>
                <p class="text-[#7A0019] font-bold italic mb-8 text-center text-sm w-full">
                    Ми одразу озвучуємо точну вартість без прихованих доплат.
                </p>
                <div class="w-full text-center">
                    <a href="tel:0979081504" class="inline-block px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-white shadow-[#E8C064]/30 shadow-lg mx-auto">
                        Розрахувати вартість
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- ── БЛОК 5: Популярні стилі ── -->
    <section class="bg-[#FAFAFA] py-10 md:py-14">
        <div class="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style="font-family: 'Oswald', sans-serif;">
                Популярні стилі весільних тортів
            </h2>
            <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
                Серед найпопулярніших варіантів у Києві:
            </p>
            <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
                <div class="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center"><div class="text-2xl md:text-3xl mb-3">🏛️</div><div class="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Класичні багатоярусні торти</div></div>
                <div class="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center"><div class="text-2xl md:text-3xl mb-3">🤍</div><div class="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Мінімалістичні білі торти</div></div>
                <div class="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center"><div class="text-2xl md:text-3xl mb-3">🌸</div><div class="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Весільні торти з живими квітами</div></div>
                <div class="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center"><div class="text-2xl md:text-3xl mb-3">🌾</div><div class="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Rustic та boho стиль</div></div>
                <div class="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center"><div class="text-2xl md:text-3xl mb-3">📐</div><div class="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Сучасні дизайнерські композиції</div></div>
            </div>
            <p class="text-gray-500 text-sm italic">
                Переглянути весільні торти фото можна в каталозі або в Instagram Antreme.
            </p>
        </div>
    </section>

    <!-- ── БЛОК 6: Начинки ── -->
    <section class="py-10 md:py-14 bg-white">
        <div class="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style="font-family: 'Oswald', sans-serif;">
                Начинки для весільного торта
            </h2>
            <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
                Ми пропонуємо понад 10 авторських смаків. Найпопулярніші начинки:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto mb-8 text-left">
                <div class="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm"><span class="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span><span class="font-bold text-gray-800">Фісташка-малина</span></div>
                <div class="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm"><span class="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span><span class="font-bold text-gray-800">Лісова ягода</span></div>
                <div class="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm"><span class="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span><span class="font-bold text-gray-800">Лимонний чизкейк</span></div>
                <div class="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm"><span class="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span><span class="font-bold text-gray-800">Карамель-банан</span></div>
                <div class="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm"><span class="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span><span class="font-bold text-gray-800">Шоколадний трюфель</span></div>
            </div>
            <p class="text-gray-500 font-medium italic mb-8">
                За потреби проводимо дегустацію.
            </p>
            <a href="/nachynky/" class="inline-block px-10 py-3.5 font-black text-xs uppercase tracking-widest rounded-full transition-all hover:scale-105 border-2 border-[#7A0019] text-[#7A0019] hover:bg-[#7A0019] hover:text-white">
                Усі начинки
            </a>
        </div>
    </section>

    <!-- ── БЛОК 7: Доставка ── -->
    <section class="bg-white py-12 md:py-16 border-t border-gray-100">
        <div class="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style="font-family: 'Oswald', sans-serif;">
                Доставка весільних тортів у Києві
            </h2>
            <p class="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto md:text-lg">
                Ми доставляємо весільні торти у всі райони Києва: Печерський, Шевченківський, Голосіївський, Солом'янський, Дарницький, Оболонський, Подільський та інші.
            </p>
            <p class="text-gray-500 font-medium italic mb-10 max-w-3xl mx-auto bg-[#FDFBF7] p-4 rounded-xl border border-[#E8C064]/20">
                Доставка здійснюється з контролем температури. За необхідності виконуємо монтаж багатоярусних конструкцій безпосередньо на локації.
            </p>
        </div>
    </section>

    <!-- ── БЛОК 8: Як замовити весільний торт ── -->
    <section class="py-10 md:py-14 bg-[#FAFAFA]">
        <div class="max-w-4xl mx-auto px-4 md:px-8">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8 text-center" style="font-family: 'Oswald', sans-serif;">
                Як замовити весільний торт
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                    <div class="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">1</div>
                    <div class="hidden lg:block absolute top-[2.3rem] -right-1/2 w-full h-[2px] bg-gradient-to-r from-[#E8C064] to-transparent z-0 opacity-30"></div>
                    <p class="font-bold text-gray-800 text-sm">Залиште заявку через сайт або зателефонуйте</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                    <div class="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">2</div>
                    <div class="hidden lg:block absolute top-[2.3rem] -right-1/2 w-full h-[2px] bg-gradient-to-r from-[#E8C064] to-transparent z-0 opacity-30"></div>
                    <p class="font-bold text-gray-800 text-sm">Узгодимо дизайн, вагу та начинку</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                    <div class="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">3</div>
                    <div class="hidden lg:block absolute top-[2.3rem] -right-1/2 w-full h-[2px] bg-gradient-to-r from-[#E8C064] to-transparent z-0 opacity-30"></div>
                    <p class="font-bold text-gray-800 text-sm">Зафіксуємо дату передоплатою</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                    <div class="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">4</div>
                    <p class="font-bold text-gray-800 text-sm">Доставимо торт у зручний для вас час</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ── Call to Action Banner (Before FAQ) ── -->
    <div class="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
        <div class="container mx-auto px-6 text-center relative z-10">
            <h3 class="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style="font-family: 'Oswald', sans-serif;">
                Обговоріть деталі замовлення зараз
            </h3>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:0979081504" class="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                    📞 Зателефонувати
                </a>
                <a href="/torty-na-zamovlennya/vesilni/" class="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                    Подивитися каталог
                </a>
            </div>
        </div>
    </div>

    <!-- ── FAQ Section (5 questions) ── -->
    <section class="py-10 md:py-14">
        <div class="max-w-3xl mx-auto px-4 md:px-8">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center" style="font-family: 'Oswald', sans-serif;">Поширені запитання</h2>
            <div class="space-y-3">
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden p-4 md:p-5"><h3 class="text-sm md:text-base font-bold text-gray-900 mb-2">За скільки часу потрібно замовити весільний торт?</h3><p class="text-gray-600 text-sm leading-relaxed">Рекомендуємо оформити замовлення за 2–4 тижні до дати весілля, щоб ми встигли продумати кожну деталь.</p></div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden p-4 md:p-5"><h3 class="text-sm md:text-base font-bold text-gray-900 mb-2">Чи можна замовити дегустацію?</h3><p class="text-gray-600 text-sm leading-relaxed">Так, за попереднім записом доступна дегустація начинок. Зв'яжіться з нами для узгодження.</p></div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden p-4 md:p-5"><h3 class="text-sm md:text-base font-bold text-gray-900 mb-2">Чи робите ви доставку до ресторану?</h3><p class="text-gray-600 text-sm leading-relaxed">Так, ми доставляємо та встановлюємо багатоярусні торти безпосередньо на локації.</p></div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden p-4 md:p-5"><h3 class="text-sm md:text-base font-bold text-gray-900 mb-2">Чи можна змінити дизайн після узгодження?</h3><p class="text-gray-600 text-sm leading-relaxed">Так, корективи можливі до початку виробництва. Узгоджуємо зміни індивідуально.</p></div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden p-4 md:p-5"><h3 class="text-sm md:text-base font-bold text-gray-900 mb-2">Яка передоплата?</h3><p class="text-gray-600 text-sm leading-relaxed">Передоплата фіксує дату та складає 50% від вартості замовлення. Решту — при отриманні.</p></div>
            </div>
        </div>
    </section>

    <!-- ── Category Linking Cards ── -->
    <section class="bg-[#FAFAFA] py-10 md:py-14">
        <div class="max-w-5xl mx-auto px-4 md:px-8">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center" style="font-family: 'Oswald', sans-serif;">Інші категорії тортів</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a href="/torty-na-zamovlennya/dytyachi/" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all text-center"><div class="text-4xl mb-3">👶</div><h3 class="font-black text-gray-900 uppercase text-sm tracking-wide mb-1" style="font-family: 'Oswald', sans-serif;">Дитячі торти</h3><p class="text-xs text-gray-400">Казкові дизайни для свята</p></a>
                <a href="/bento-torty/" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all text-center"><div class="text-4xl mb-3">🍱</div><h3 class="font-black text-gray-900 uppercase text-sm tracking-wide mb-1" style="font-family: 'Oswald', sans-serif;">Бенто торти</h3><p class="text-xs text-gray-400">Мініатюрні торти для подарунку</p></a>
                <a href="/musovi-torty/" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all text-center"><div class="text-4xl mb-3">🍫</div><h3 class="font-black text-gray-900 uppercase text-sm tracking-wide mb-1" style="font-family: 'Oswald', sans-serif;">Мусові торти</h3><p class="text-xs text-gray-400">Французька витонченість</p></a>
            </div>
        </div>
    </section>

    <!-- ── Bottom Internal Links ── -->
    <nav class="max-w-4xl mx-auto px-4 md:px-8 pb-12" aria-label="Корисні посилання">
        <div class="border-t border-gray-100 pt-8">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Дивіться також</h3>
            <div class="flex flex-wrap gap-2">
                <a href="/" class="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 transition-all">Головна</a>
                <a href="/nachynky/" class="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 transition-all">Начинки</a>
                <a href="/delivery/" class="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 transition-all">Доставка та оплата</a>
                <a href="/reviews/" class="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 transition-all">Відгуки</a>
                <a href="/torty-na-zamovlennya/" class="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 transition-all">Усі категорії</a>
            </div>
        </div>
    </nav>
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
    <h1>Дитячі торти на замовлення в Києві</h1>
    
    <!-- ── БЛОК 2: SEO Інтро ── -->
    <section class="category-intro mt-12 mb-8">
        <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style="font-family: 'Oswald', sans-serif;">
            Дитячі торти на день народження в Києві
        </h2>
        <p class="intro-text">
            Шукаєте ідеальний <a href="/torty-na-zamovlennya/na-den-narodzhennya/" class="text-[#7A0019] hover:underline font-bold">дитячий торт на день народження у Києві</a>? Вибір десерту для малечі — це завжди відповідальна задача для батьків. В кондитерській <strong>Antreme</strong> ви можете <strong>замовити дитячий торт з доставкою</strong>, який не лише викличе щирий захват своїм зовнішнім виглядом, але й буде абсолютно безпечним.
        </p>
        <p class="intro-text">
            Незалежно від того, потрібен вам <a href="/torty-na-zamovlennya/dlya-hlopchykiv/" class="text-[#7A0019] hover:underline font-bold">торт для хлопчика</a> з супергероями чи ніжний <a href="/torty-na-zamovlennya/dlya-divchat/" class="text-[#7A0019] hover:underline font-bold">торт для дівчинки</a> з принцесами — ми знаємо, як втілити солодку мрію в реальність. Від першого рочку до підліткового віку — у нас є безліч ідей для кожного етапу!
        </p>
    </section>

    <!-- ── БЛОК 3: Переваги (карточки) ── -->
    <section class="bg-[#FDFBF7] py-12 md:py-16 border-t border-b border-gray-100">
        <div class="max-w-6xl mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div class="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🌿</div>
                    <h3 class="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style="font-family: 'Oswald', sans-serif;">100% натурально</h3>
                    <p class="text-gray-500 text-sm">Тільки вершкове масло та вершки</p>
                </div>
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div class="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🎨</div>
                    <h3 class="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style="font-family: 'Oswald', sans-serif;">Безпечні фарби</h3>
                    <p class="text-gray-500 text-sm">Сертифіковані харчові барвники</p>
                </div>
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div class="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">✨</div>
                    <h3 class="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style="font-family: 'Oswald', sans-serif;">Казкові дизайни</h3>
                    <p class="text-gray-500 text-sm">Будь-які герої та оформлення</p>
                </div>
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div class="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🚕</div>
                    <h3 class="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style="font-family: 'Oswald', sans-serif;">Бережна доставка</h3>
                    <p class="text-gray-500 text-sm">Безпечне перевезення по Києву</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ── БЛОК 4: Скільки коштує ── -->
    <section class="py-10 md:py-14">
        <div class="max-w-3xl mx-auto px-4 md:px-8">
            <div class="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-[0_4px_20px_rgba(232,192,100,0.15)] flex flex-col items-start md:items-center text-left md:text-center">
                <div class="flex items-center gap-3 mb-4 mx-auto justify-center w-full">
                    <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">💰</div>
                    <h2 class="text-xl md:text-2xl font-black text-gray-900 tracking-tight text-left md:text-center" style="font-family: 'Oswald', sans-serif;">
                        Скільки коштує дитячий торт у Києві
                    </h2>
                </div>
                <p class="text-gray-600 mb-6 text-sm md:text-base text-center w-full max-w-lg mx-auto">
                    Вартість дитячого торта залежить від обраної начинки, ваги та складності оформлення.
                </p>
                <ul class="space-y-3 mb-6 w-full max-w-sm mx-auto text-left">
                    <li class="flex items-start gap-3 text-gray-700 font-medium">
                        <span class="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#B8860B]">✓</span>
                        Мінімальна вага дитячого торта — від 1.5 кг
                    </li>
                    <li class="flex items-start gap-3 text-gray-700 font-medium">
                        <span class="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#B8860B]">✓</span>
                        Вартість — від 650 грн за кг
                    </li>
                    <li class="flex items-start gap-3 text-gray-700 font-medium">
                        <span class="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#B8860B]">✓</span>
                        Декор (фігурки, пряники, фотодрук) розраховується індивідуально
                    </li>
                    <li class="flex items-start gap-3 text-gray-700 font-medium">
                        <span class="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#B8860B]">✓</span>
                        Можливість сховати "сюрприз" всередині торта
                    </li>
                </ul>
                <p class="text-[#7A0019] font-bold italic mb-8 text-center text-sm w-full">
                    Ми одразу озвучуємо точну вартість без прихованих доплат.
                </p>
                <div class="w-full text-center">
                    <a href="tel:0979081504" class="inline-block px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-[#E8C064]/30 shadow-lg mx-auto">
                        Розрахувати вартість
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- ── БЛОК 5: Популярні стилі ── -->
    <section class="bg-[#FAFAFA] py-10 md:py-14">
        <div class="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style="font-family: 'Oswald', sans-serif;">
                Популярні дизайни дитячих тортів
            </h2>
            <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
                Ми втілюємо будь-які фантазії малечі у солодкій реальності:
            </p>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                <div class="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                    <div class="text-2xl md:text-3xl mb-3">🧸</div>
                    <div class="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Для найменших (на 1 рочок)</div>
                </div>
                <div class="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                    <div class="text-2xl md:text-3xl mb-3">🦸‍♂️</div>
                    <div class="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Герої Marvel та машинки</div>
                </div>
                <div class="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                    <div class="text-2xl md:text-3xl mb-3">👸</div>
            <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
                Для малечі ми рекомендуємо легкі та абсолютно безпечні смаки:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto mb-8 text-left">
                <div class="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span>
                    <span class="font-bold text-gray-800">Ванільна ніжність з полуницею</span>
                </div>
                <div class="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span>
                    <span class="font-bold text-gray-800">Легкий йогуртовий мус</span>
                </div>
                <div class="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span>
                    <span class="font-bold text-gray-800">Карамель-банан (без штучних добавок)</span>
                </div>
                <div class="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span>
                    <span class="font-bold text-gray-800">Домашній шоколадний "Снікерс"</span>
                </div>
            </div>
            <p class="text-gray-500 font-medium italic mb-8">
                За потреби обговорюємо список алергенів.
            </p>
            <a href="/nachynky/" class="inline-block px-10 py-3.5 font-black text-xs uppercase tracking-widest rounded-full transition-all hover:scale-105 border-2 border-[#7A0019] text-[#7A0019] hover:bg-[#7A0019] hover:text-white">
                Усі начинки
            </a>
        </div>
    </section>

    <!-- ── БЛОК 7: Доставка ── -->
    <section class="bg-white py-12 md:py-16 border-t border-gray-100">
        <div class="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style="font-family: 'Oswald', sans-serif;">
                Доставка дитячих тортів у Києві
            </h2>
            <p class="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto md:text-lg">
                Ми здійснюємо доставку на <strong>лівий та правий берег</strong> Києва: Оболонь, Троєщина, Печерськ, Позняки, Голосіїво та інші райони. Можлива точна <strong>доставка у день свята</strong> прямо до дверей чи в ресторан.
            </p>
            <p class="text-gray-500 font-medium italic mb-10 max-w-3xl mx-auto bg-[#FDFBF7] p-4 rounded-xl border border-[#E8C064]/20">
                Для 100% збереження якості ми використовуємо <strong>термобокс</strong>. Гарантуємо <strong>обережне транспортування фігурок</strong> та тендітного декору!
            </p>
        </div>
    </section>

    <!-- ── БЛОК 8: Як замовити ── -->
    <section class="py-10 md:py-14 bg-[#FAFAFA]">
        <div class="max-w-4xl mx-auto px-4 md:px-8">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8 text-center" style="font-family: 'Oswald', sans-serif;">
                Як замовити дитячий торт
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                    <div class="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">1</div>
                    <div class="hidden lg:block absolute top-[2.3rem] -right-1/2 w-full h-[2px] bg-gradient-to-r from-[#E8C064] to-transparent z-0 opacity-30"></div>
                    <p class="font-bold text-gray-800 text-sm">Оберіть дизайн та бажану начинку</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                    <div class="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">2</div>
                    <div class="hidden lg:block absolute top-[2.3rem] -right-1/2 w-full h-[2px] bg-gradient-to-r from-[#E8C064] to-transparent z-0 opacity-30"></div>
                    <p class="font-bold text-gray-800 text-sm">Залиште заявку (бажано за 3-5 днів)</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                    <div class="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">3</div>
                    <div class="hidden lg:block absolute top-[2.3rem] -right-1/2 w-full h-[2px] bg-gradient-to-r from-[#E8C064] to-transparent z-0 opacity-30"></div>
                    <p class="font-bold text-gray-800 text-sm">Зафіксуйте дату передоплатою</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                    <div class="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">4</div>
                    <p class="font-bold text-gray-800 text-sm">Отримайте торт із доставкою на свято</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ── Call to Action Banner (Before FAQ) ── -->
    <div class="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
        <div class="container mx-auto px-6 text-center relative z-10">
            <h3 class="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style="font-family: 'Oswald', sans-serif;">
                Обговоріть деталі свята з кондитером
            </h3>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:0979081504" class="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                    📞 Зателефонувати
                </a>
                <a href="/nachynky/" class="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                    Подивитися начинки
                </a>
            </div>
        </div>
        <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
    </div>

    <!-- ── FAQ Section (Kids) ── -->
    <section class="py-10 md:py-14 bg-[#FAFAFA]">
        <div class="max-w-3xl mx-auto px-4 md:px-8">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center" style="font-family: 'Oswald', sans-serif;">
                Поширені запитання (FAQ)
            </h2>
            <div class="space-y-3">
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div class="w-full flex items-center justify-between p-4 md:p-5 text-left">
                        <h3 class="text-sm md:text-base font-bold text-gray-900 pr-4">Скільки коштує дитячий торт?</h3>
                    </div>
                    <div class="px-4 md:px-5 pb-4 md:pb-5">
                        <p class="text-gray-600 text-sm leading-relaxed">Вартість дитячого торта залежить від обраної начинки, ваги та складності оформлення. Базова ціна починається від 650 грн за кілограм. Декор (мастичні фігурки, пряники, фотодрук) розраховується індивідуально.</p>
                    </div>
                </div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div class="w-full flex items-center justify-between p-4 md:p-5 text-left">
                        <h3 class="text-sm md:text-base font-bold text-gray-900 pr-4">Як замовити дитячий торт у Києві?</h3>
                    </div>
                    <div class="px-4 md:px-5 pb-4 md:pb-5">
                        <p class="text-gray-600 text-sm leading-relaxed">Ви можете оформити замовлення прямо на нашому сайті через онлайн-форму, написати нам у месенджери (Viber/Telegram) або просто зателефонувати. Рекомендуємо робити замовлення за 3-5 днів до свята.</p>
                    </div>
                </div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div class="w-full flex items-center justify-between p-4 md:p-5 text-left">
                        <h3 class="text-sm md:text-base font-bold text-gray-900 pr-4">Чи робите ви доставку?</h3>
                    </div>
                    <div class="px-4 md:px-5 pb-4 md:pb-5">
                        <p class="text-gray-600 text-sm leading-relaxed">Так, ми здійснюємо безпечну адресну доставку дитячих тортів по всіх районах Києва (Оболонь, Позняки, Троєщина, Печерськ тощо). Торти доставляються в спеціальних холодильних боксах.</p>
                    </div>
                </div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div class="w-full flex items-center justify-between p-4 md:p-5 text-left">
                        <h3 class="text-sm md:text-base font-bold text-gray-900 pr-4">Які начинки безпечні для дітей?</h3>
                    </div>
                    <div class="px-4 md:px-5 pb-4 md:pb-5">
                        <p class="text-gray-600 text-sm leading-relaxed">Для малечі ми рекомендуємо легкі та натуральні смаки: ванільний бісквіт зі свіжими фруктами, йогуртовий мус або класичну "Полуничну ніжність". Всі наші десерти виготовляються без додавання штучних консервантів.</p>
                    </div>
                </div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div class="w-full flex items-center justify-between p-4 md:p-5 text-left">
                        <h3 class="text-sm md:text-base font-bold text-gray-900 pr-4">Чи можна зробити торт без мастики?</h3>
                    </div>
                    <div class="px-4 md:px-5 pb-4 md:pb-5">
                        <p class="text-gray-600 text-sm leading-relaxed">Так, абсолютно! Ми спеціалізуємось на ніжних кремових покриттях. Мастику використовуємо виключно для деяких складних фігурок чи дрібного декору за вашим бажанням.</p>
                    </div>
                </div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div class="w-full flex items-center justify-between p-4 md:p-5 text-left">
                        <h3 class="text-sm md:text-base font-bold text-gray-900 pr-4">Чи можна змінити дизайн з фото?</h3>
                    </div>
                    <div class="px-4 md:px-5 pb-4 md:pb-5">
                        <p class="text-gray-600 text-sm leading-relaxed">Звичайно! Ви можете надіслати нам будь-яке фото з Pinterest чи Instagram, і ми адаптуємо дизайн під ваші побажання, змінимо кольори або додамо улюблених героїв вашої дитини.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ── Category Linking Cards ── -->
    <section class="bg-[#FAFAFA] py-10 md:py-14">
        <div class="max-w-5xl mx-auto px-4 md:px-8">
            <h2 class="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center" style="font-family: 'Oswald', sans-serif;">Корисні посилання</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a href="/nachynky/" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all text-center"><div class="text-4xl mb-3">🍰</div><h3 class="font-black text-gray-900 uppercase text-sm tracking-wide mb-1" style="font-family: 'Oswald', sans-serif;">Начинки</h3><p class="text-xs text-gray-400">Перелік доступних смаків</p></a>
                <a href="/delivery/" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all text-center"><div class="text-4xl mb-3">🚚</div><h3 class="font-black text-gray-900 uppercase text-sm tracking-wide mb-1" style="font-family: 'Oswald', sans-serif;">Доставка</h3><p class="text-xs text-gray-400">Умови доставки та оплати</p></a>
                <a href="/reviews/" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all text-center"><div class="text-4xl mb-3">💬</div><h3 class="font-black text-gray-900 uppercase text-sm tracking-wide mb-1" style="font-family: 'Oswald', sans-serif;">Відгуки</h3><p class="text-xs text-gray-400">Що про нас кажуть</p></a>
            </div>
        </div>
    </section>

    <script type="application/ld+json" data-rh="true">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Скільки коштує дитячий торт?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Вартість дитячого торта залежить від обраної начинки, ваги та складності оформлення. Базова ціна починається від 650 грн за кілограм. Декор (мастичні фігурки, пряники, фотодрук) розраховується індивідуально."
          }
        },
        {
          "@type": "Question",
          "name": "Як замовити дитячий торт у Києві?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ви можете оформити замовлення прямо на нашому сайті через онлайн-форму, написати нам у месенджери (Viber/Telegram) або просто зателефонувати. Рекомендуємо робити замовлення за 3-5 днів до свята."
          }
        },
        {
          "@type": "Question",
          "name": "Чи робите ви доставку?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Так, ми здійснюємо безпечну адресну доставку дитячих тортів по всіх районах Києва (Оболонь, Позняки, Троєщина, Печерськ тощо). Торти доставляються в спеціальних холодильних боксах."
          }
        },
        {
          "@type": "Question",
          "name": "Які начинки безпечні для дітей?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Для малечі ми рекомендуємо легкі та натуральні смаки: ванільний бісквіт зі свіжими фруктами, йогуртовий мус або класичну \\"Полуничну ніжність\\". Всі наші десерти виготовляються без додавання штучних консервантів."
          }
        },
        {
          "@type": "Question",
          "name": "Чи можна зробити торт без мастики?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Так, абсолютно! Ми спеціалізуємось на ніжних кремових покриттях. Мастику використовуємо виключно для деяких складних фігурок чи дрібного декору за вашим бажанням."
          }
        },
        {
          "@type": "Question",
          "name": "Чи можна змінити дизайн з фото?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Звичайно! Ви можете надіслати нам будь-яке фото з Pinterest чи Instagram, і ми адаптуємо дизайн під ваші побажання, змінимо кольори або додамо улюблених героїв вашої дитини."
          }
        }
      ]
    }
    </script>
</main>`;
}

function getBoySeoHtml() {
    return `
<main>
    <h1>Торти для хлопчиків на замовлення в Києві</h1>
    
    <section>
        <h2>Замовити торт для хлопчика у Києві — авторський дизайн та натуральні інгредієнти</h2>
        <p>Плануєте незабутній день народження для сина? У кондитерській Antreme ми знаємо, як створити ідеальний торт для хлопчика, який стане головним героєм свята. Від улюблених персонажів мультфільмів до крутих автомобілів — ми втілимо будь-яку мрію вашого маленького захисника.</p>
        <p>Ми працюємо тільки з натуральними інгредієнтами і створюємо декор вручну. Такий десерт не лише вражить дизайном, а й порадує чистотою складу, що особливо важливо для дитячого харчування.</p>
    </section>

    <section>
        <h2>Популярні теми для хлоп'ячого свята</h2>
        <ul>
            <li><strong>Машинки та Hot Wheels:</strong> Для любителів швидкості.</li>
            <li><strong>Супергерої Marvel:</strong> Людина-павук, Бетмен та Месники.</li>
            <li><strong>Brawl Stars & Roblox:</strong> Хіти для юних геймерів.</li>
            <li><strong>Космос та планети:</strong> Для майбутніх дослідників Всесвіту.</li>
            <li><strong>Динозаври:</strong> Вічна класика для малечі.</li>
        </ul>
    </section>

    <section>
        <h2>Начинки, які обожнюють діти</h2>
        <p>Ми рекомендуємо обирати перевірені часом смаки: шоколадний "Снікерс", ніжну полуницю або легкі йогуртові муси. Усі десерти виготовляються без штучних консервантів.</p>
    </section>

    <section>
        <h2>Доставка тортів для хлопчиків по Києву</h2>
        <p>Ми здійснюємо безпечну адресну доставку по всьому Києву у спеціальних термобоксах. Ви можете бути впевнені, що декор доїде в ідеальному стані.</p>
    </section>

    <section>
        <h2>FAQ — Часті запитання</h2>
        <div>
            <h3>Скільки коштує торт для хлопчика?</h3>
            <p>Базова вартість — від 650 грн за кг. Декор розраховується індивідуально.</p>
        </div>
        <div>
            <h3>Як замовити?</h3>
            <p>Залиште заявку на сайті або напишіть нам у месенджери. Бажано за 3-5 днів до свята.</p>
        </div>
    </section>
</main>`;
}

function getBentoSeoHtml() {
    return `<main>
<article>
<h1>Бенто торти на замовлення в Києві</h1>
<p>Бенто торт — це популярний тренд у світі кондитерських виробів. Це маленький святковий десерт вагою 400–500 грамів, розрахований на 1–2 особи. Кондитерська Antreme пропонує <strong>бенто торти на замовлення в Києві</strong> з індивідуальними написами, малюнками та авторськими смаками.</p>

<h2>Чому варто замовити бенто торт у Antreme?</h2>
<ul>
<li><strong>Індивідуальність:</strong> Кожен торт — це чисте полотно для ваших побажань. Ми зробимо будь-який напис або міні-малюнок.</li>
<li><strong>Швидкість:</strong> Можливість виготовлення бенто торта за 24 години (за наявності місць у графіку).</li>
<li><strong>Тільки натуральне:</strong> Ми використовуємо справжнє вершкове масло, бельгійський шоколад та свіжі ягоди.</li>
<li><strong>Доступна ціна:</strong> Вартість бенто торта у Києві починається від 300 грн.</li>
</ul>

<h2>Популярні варіанти дизайнів бенто тортів</h2>
<p>Наші клієнти найчастіше замовляють бенто торти для таких подій:</p>
<ul>
<li><a href="/torty-na-zamovlennya/na-den-narodzhennya/">На день народження</a> — з побажаннями або віком.</li>
<li>Для коханих — з романтичними зізнаннями.</li>
<li>Для друзів — зі смішними фразами та мемними малюнками.</li>
<li><a href="/torty-na-zamovlennya/dlya-zhinok/">Для жінок</a> — ніжні дизайни з квітами або сердечками.</li>
<li><a href="/torty-na-zamovlennya/dlya-cholovikiv/">Для чоловіків</a> — лаконічні та стильні варіанти.</li>
</ul>

<h2>Начинки для вашого бенто торта</h2>
<p>Незважаючи на компактний розмір, ви можете обрати одну з наших топових начинок: Снікерс, Червоний оксамит, Ваніль-полуниця або Шоколад-вишня. Перегляньте всі варіанти на сторінці <a href="/nachynky/">Начинки</a>.</p>

<h2>Доставка бенто тортів по Києву</h2>
<p>Ми доставляємо замовлення у всі райони Києва: Печерськ, Оболонь, Осокорки, Позняки, Троєщина, центр та інші. Також доступний самовивіз. <a href="/delivery/">Деталі доставки →</a></p>

<h2>Поширені запитання (FAQ)</h2>
<div>
<h3>Скільки важить бенто торт?</h3>
<p>Стандартна вага становить 400-500 грамів. Цього достатньо для 1-3 осіб.</p>
</div>
<div>
<h3>Чи можна додати будь-який напис?</h3>
<p>Так, ми виконуємо індивідуальні написи кремом за вашим бажанням.</p>
</div>
<div>
<h3>За скільки часу потрібно замовити?</h3>
<p>Рекомендуємо за 1-3 дні, але часто беремо термінові замовлення в день звернення.</p>
</div>
</article>
</main>`;
}

generatePages();

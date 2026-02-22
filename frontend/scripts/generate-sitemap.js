import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://cake-shop-backend.onrender.com/cakes/?limit=1000';
const BASE_URL = 'https://antreme.kyiv.ua';

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
        return null; // Skip unmapped completely, no legacy fallbacks
    }
    if (info.group === 'A') return `/torty-na-zamovlennya/${info.slug}/${cake.slug}/`;
    return `/${info.slug}/${cake.slug}/`;
}

async function fetchCakes() {
    try {
        const response = await axios.get(API_URL, { timeout: 60000 });
        return response.data;
    } catch (error) {
        console.error("Error fetching cakes:", error.message);
        return [];
    }
}

function urlEntry(loc, priority, changefreq, lastmod) {
    return [
        `  <url>`,
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        `  </url>`
    ].join('\n');
}

async function generateSitemap() {
    try {
        console.log('Fetching cakes for sitemap...');
        const cakes = await fetchCakes();
        const today = new Date().toISOString().split('T')[0];
        const urls = new Set();
        const entries = [];

        const addUrl = (path, priority, changefreq, lastmod) => {
            const full = `${BASE_URL}${path}`;
            if (urls.has(full)) return;
            urls.add(full);
            entries.push({ path, priority, changefreq, lastmod: lastmod || today, full });
        };

        // === Tier 1: Home (1.0) ===
        addUrl('/', '1.0', 'daily');

        // === Tier 2: Main pages (0.9) ===
        // Removed /cakes/ entirely. All structural routes end in /
        ['/holiday/', '/delivery/', '/about/', '/reviews/', '/fillings/', '/torty-na-zamovlennya/'].forEach(p => {
            addUrl(p, '0.9', 'daily');
        });

        // === Tier 3: Category pages (0.8) ===
        // Group A categories
        for (const slug of Object.keys(GROUP_A)) {
            addUrl(`/torty-na-zamovlennya/${slug}/`, '0.8', 'weekly');
        }
        // Group B categories
        for (const slug of Object.keys(GROUP_B)) {
            addUrl(`/${slug}/`, '0.8', 'weekly');
        }

        // === Tier 4: Product pages (0.7) ===
        cakes.forEach(cake => {
            if (!cake.slug) return; // Skip products without slugs
            const url = getProductUrl(cake);
            if (!url) return; // Skip mismatched 
            const lastmod = cake.updated_at
                ? new Date(cake.updated_at).toISOString().split('T')[0]
                : today;
            addUrl(url, '0.7', 'weekly', lastmod);
        });

        // Build XML
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Sort by priority desc, then alphabetically
        entries.sort((a, b) => {
            const pDiff = parseFloat(b.priority) - parseFloat(a.priority);
            if (pDiff !== 0) return pDiff;
            return a.path.localeCompare(b.path);
        });

        entries.forEach(e => {
            sitemap += urlEntry(e.full, e.priority, e.changefreq, e.lastmod) + '\n';
        });

        sitemap += `</urlset>`;

        const publicDir = path.join(__dirname, '..', 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        const sitemapPath = path.join(publicDir, 'sitemap.xml');
        fs.writeFileSync(sitemapPath, sitemap, 'utf8');
        console.log(`✅ Sitemap generated: ${sitemapPath} (${entries.length} URLs)`);
        console.log(`   Breakdown: Home=1, Main=${6}, Categories=${Object.keys(GROUP_A).length + Object.keys(GROUP_B).length}, Products=${cakes.filter(c => c.slug).length}`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();

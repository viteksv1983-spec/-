import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const TARGET_ACCOUNT = 'antreme.kyiv';
const POSTS_TO_CHECK = 30;
const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'reviews');
const DATA_FILE = path.join(__dirname, 'src', 'data', 'reviewsData.js');

// Keywords to identify reviews
const MARKER_WORDS = ['відгук', 'дякую', 'смачно', 'неймовірно', 'замовлення', 'супер'];

// Helper to ask user for input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Helper to download image
async function downloadImage(url, filepath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ Помилка завантаження зображення: ${error.message}`);
        return false;
    }
}

// Categorization logic
function determineCategory(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('бенто')) return 'bento';
    if (lowerText.includes('весіл')) return 'vesilni';
    return 'general';
}

async function scrapeInstagram() {
    console.log('🚀 Запуск Puppeteer...');

    const browser = await puppeteer.launch({
        headless: false, // Must be false for manual login
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();

    // Step 1: Login
    console.log('Перехід на сторінку логіну...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

    console.log('\n=============================================');
    console.log('⚠️ ДІЯ ПОТРІБНА: Будь ласка, залогіньтесь в Instagram у вікні браузера.');
    await askQuestion('⚠️ Натисніть ENTER в ТЕРМІНАЛІ після успішного входу в акаунт... ');
    console.log('=============================================\n');

    // Step 2: Navigate to target profile
    console.log(`Перехід на профіль @${TARGET_ACCOUNT}...`);
    await page.goto(`https://www.instagram.com/${TARGET_ACCOUNT}/`, { waitUntil: 'networkidle2' });

    // Wait for posts to load
    await page.waitForSelector('article', { timeout: 10000 }).catch(() => console.log('Не вдалося знайти пости.'));

    console.log('\nЗбираю посилання на пости...');
    let postLinks = new Set();

    // Scroll and gather links
    while (postLinks.size < POSTS_TO_CHECK) {
        const links = await page.$$eval('article a[href^="/p/"]', anchors => anchors.map(a => a.href));
        links.forEach(link => postLinks.add(link));

        if (postLinks.size >= POSTS_TO_CHECK) break;

        // Scroll down
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for lazy load

        // Break if no more new links (reached bottom)
        const newSize = postLinks.size;
        if (newSize === links.size && newSize > 0 && newSize < POSTS_TO_CHECK) {
            console.log('Досягнуто кінець ленти.');
            break;
        }
    }

    const linksArray = Array.from(postLinks).slice(0, POSTS_TO_CHECK);
    console.log(`✅ Знайдено ${linksArray.length} постів для перевірки.\n`);

    const reviewsArr = [];
    let reviewCount = 1;

    // Step 3: Process each post
    for (const [index, link] of linksArray.entries()) {
        console.log(`[${index + 1}/${linksArray.length}] Перевірка: ${link}`);
        await page.goto(link, { waitUntil: 'networkidle2' });

        try {
            // Get text from the post description
            // The structure is usually an h1 or span inside the first comment (which is the caption)
            const textContent = await page.evaluate(() => {
                const element = document.querySelector('h1[dir="auto"]') || document.querySelector('span[dir="auto"]');
                return element ? element.innerText : '';
            });

            if (!textContent) continue;

            const lowerText = textContent.toLowerCase();
            const isReview = MARKER_WORDS.some(word => lowerText.includes(word));

            if (isReview) {
                console.log('  🌟 Знайдено відгук!');

                // Get image URL
                const imgUrl = await page.evaluate(() => {
                    // Look for the main image in the post
                    const img = document.querySelector('article img[style*="object-fit: cover"]') || document.querySelector('article img');
                    return img ? img.src : null;
                });

                if (imgUrl) {
                    const filename = `review_insta_${reviewCount}.jpg`;
                    const filepath = path.join(OUTPUT_DIR, filename);
                    const publicUrl = `/images/reviews/${filename}`;

                    console.log(`  📸 Завантаження картинки...`);
                    await downloadImage(imgUrl, filepath);

                    const category = determineCategory(textContent);

                    reviewsArr.push({
                        id: reviewCount,
                        clientName: 'Клієнт Instagram',
                        text: textContent.trim(),
                        image: publicUrl,
                        category: category,
                        rating: 5
                    });

                    reviewCount++;
                } else {
                    console.log('  ❌ Не знайдено картинку поста.');
                }
            }
        } catch (err) {
            console.error(`  Помилка обробки поста: ${err.message}`);
        }

        // Random delay to avoid quick rate limits
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    }

    // Step 4: Save data
    if (reviewsArr.length > 0) {
        console.log(`\n💾 Збереження ${reviewsArr.length} відгуків у файл...`);
        const fileContent = `// Автоматично згенеровано скриптом scrape-reviews.js\n\nexport const reviewsData = ${JSON.stringify(reviewsArr, null, 4)};\n`;
        fs.writeFileSync(DATA_FILE, fileContent, 'utf-8');
        console.log(`✅ Дані успішно збережені у ${DATA_FILE}`);
    } else {
        console.log('\n😔 Відгуків не знайдено за заданими словами-маркерами.');
    }

    console.log('\nРоботу завершено. Закриття браузера...');
    await browser.close();
    rl.close();
}

scrapeInstagram().catch(err => {
    console.error('Критична помилка експлуатації:', err);
    rl.close();
    process.exit(1);
});

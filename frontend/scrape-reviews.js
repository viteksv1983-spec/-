import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import axios from 'axios';

puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Настройки поиска ---
const TARGET_ACCOUNT = 'liudmilaprikhodko';
const POSTS_TO_CHECK = 100;

const KEYWORDS = [
    'відгук', 'дякую', 'замовлення', 'смачно', 'торт', 'тортик',
    'спасибо', 'отзыв', 'заказ', 'вкусно', 'неймовірно', 'рекомендую',
    'шедевр', 'восторг', 'невероятно', 'наслаждение', 'начинка',
    'разрез', 'розріз', 'декор', 'эстетика', 'вкус', 'смак'
];

const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'reviews');
const DATA_FILE = path.join(__dirname, 'src', 'data', 'reviewsData.js');
const SESSION_FILE = path.join(__dirname, 'session_cookies.json');

// --- Инициализация консоли ---
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

// --- Создание директорий ---
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

// --- Вспомогательные функции ---
const randomDelay = (min = 2000, max = 5000) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function downloadImage(url, filepath) {
    try {
        const response = await axios({
            url, method: 'GET', responseType: 'stream', timeout: 15000
        });
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            writer.on('finish', () => resolve(true));
            writer.on('error', reject);
        });
    } catch (error) {
        return false;
    }
}

function determineCategory(text) {
    const lower = text.toLowerCase();
    if (lower.includes('бенто')) return 'bento';
    if (lower.includes('весіл') || lower.includes('свадеб')) return 'vesilni';
    return 'general';
}

function saveReviews(reviewsArr) {
    const fileContent = `// Автоматически сгенерировано скриптом scrape-reviews.js (Production Edition)\n\nexport const reviewsData = ${JSON.stringify(reviewsArr, null, 4)};\n`;
    fs.writeFileSync(DATA_FILE, fileContent, 'utf-8');
}

// Извлечение всех строковых значений ключа 'text' из глубокого JSON (GraphQL/XHR)
function extractAllTextsFromJSON(obj) {
    let texts = [];
    let stack = [obj];
    while (stack.length > 0) {
        let current = stack.pop();
        if (typeof current === 'object' && current !== null) {
            for (let k in current) {
                if (k === 'text' && typeof current[k] === 'string') {
                    texts.push(current[k]);
                } else if (typeof current[k] === 'object') {
                    stack.push(current[k]);
                }
            }
        }
    }
    return texts;
}

// Глобальные переменные
let globalReviewCount = 0;
const reviewsArr = [];
let isCheckpoint = false; // Флаг блокировки/редиректа

// --- Основной скрипт ---
async function scrapeInstagram() {
    console.log(`🚀 Запуск Production Edition Scraper (Single Thread, Stealth, Anti-ban)...`);

    const browser = await puppeteer.launch({
        headless: false, // Обязательно false для Instagram (headless true чаще блокируют)
        defaultViewport: { width: 1366, height: 768 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--start-maximized'
        ]
    });

    const page = await browser.newPage();

    // User-Agent Spoofing
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Перехват ответов: анализ 429 и редиректов на checkpoint
    page.on('response', async (response) => {
        const status = response.status();
        const url = response.url();

        if (status === 429) {
            console.log(`\n⚠️ ВНИМАНИЕ: Получен HTTP 429 Too Many Requests. Instagram ограничивает запросы.`);
        }
        if (url.includes('/challenge/') || url.includes('/suspended/')) {
            console.log('\n🛑 АЛЕРТ: Обнаружен Checkpoint / Подтверждение номера телефона!');
            isCheckpoint = true;
        }
    });

    // Загрузка сохранённой сессии
    if (fs.existsSync(SESSION_FILE)) {
        console.log('🍪 Загрузка сохраненных cookies...');
        const cookies = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
        await page.setCookie(...cookies);
    }

    console.log('🔗 Переход на базовый домен Instagram...');
    await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });

    await randomDelay(3000, 5000);

    if (isCheckpoint) {
        console.log('🛑 Работа прервана из-за обнаруженной блокировки (Checkpoint).');
        await browser.close();
        process.exit(1);
    }

    // Проверка авторизации
    const isLoggedIn = await page.evaluate(() => {
        return !!document.querySelector('svg[aria-label="Home"]') || !!document.querySelector('svg[aria-label="Главная"]');
    });

    if (!isLoggedIn) {
        console.log('\n=============================================');
        console.log('⚠️ ДЕЙСТВИЕ: Требуется авторизация.');
        await askQuestion('⚠️ Пожалуйста, залогиньтесь в Instagram в браузере и нажмите ENTER в терминале... ');

        // Сохраняем куки после входа
        const currentCookies = await page.cookies();
        fs.writeFileSync(SESSION_FILE, JSON.stringify(currentCookies));
        console.log('✅ Cookies сохранены. Следующий запуск пройдет без логина.');
        console.log('=============================================\n');
    } else {
        console.log('✅ Вы успешно авторизованы по старой сессии (Cookies Valid).');
    }

    // Сбор ссылок на посты
    console.log(`🔍 Переход на профиль @${TARGET_ACCOUNT}...`);
    await page.goto(`https://www.instagram.com/${TARGET_ACCOUNT}/`, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log(`\n⏳ Сбор ссылок на ${POSTS_TO_CHECK} постов (без агрессивного скролла)...`);
    let postLinks = new Set();
    let scrollAttempts = 0;

    while (postLinks.size < POSTS_TO_CHECK) {
        if (isCheckpoint) break;

        const links = await page.$$eval('a[href*="/p/"]', anchors => anchors.map(a => a.href));
        const prevSize = postLinks.size;
        links.forEach(link => postLinks.add(link));

        process.stdout.write(`\r🔗 Собрано уникальных ссылок: ${postLinks.size} / ${POSTS_TO_CHECK}`);

        if (postLinks.size >= POSTS_TO_CHECK) break;

        // Деликатный скролл частями
        await page.evaluate(() => window.scrollBy(0, 1000));
        await randomDelay(2000, 5000); // 2-5 секунд задержки

        if (postLinks.size === prevSize) {
            scrollAttempts++;
            if (scrollAttempts > 3) {
                console.log('\n🛑 Новые посты не загружаются. Конец ленты.');
                break;
            }
        } else {
            scrollAttempts = 0;
        }
    }

    const linksArray = Array.from(postLinks).slice(0, POSTS_TO_CHECK);
    console.log(`\n✅ Сбор ссылок завершен. Постов для анализа: ${linksArray.length}\n`);

    // Переменная для перехвата данных текущего поста
    let currentPostTexts = new Set();

    // Настраиваем перехват Network GraphQL / XHR (собираем текст "на лету")
    page.on('response', async (response) => {
        const url = response.url();
        const req = response.request();

        if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') {
            if (url.includes('graphql/query') || url.includes('/api/v1/media/') || url.includes('/comments/')) {
                try {
                    const json = await response.json();
                    const texts = extractAllTextsFromJSON(json);
                    texts.forEach(t => {
                        if (t.length > 5 && !t.match(/^[0-9]+$/)) currentPostTexts.add(t);
                    });
                } catch (e) {
                    // Игнорируем ошибки парсинга не JSON-ответов
                }
            }
        }
    });

    // Обработка каждого поста (Single Thread)
    for (let i = 0; i < linksArray.length; i++) {
        if (isCheckpoint) {
            console.log('\n🛑 БЛОКИРОВКА АКТИВИРОВАНА. Корректное завершение...');
            break;
        }

        const link = linksArray[i];
        currentPostTexts.clear(); // Сброс собранных текстов для нового поста

        let successLoad = false;
        let retries = 0;
        let baseWaitTime = 30000; // Базовая задержка для Exponential Backoff (30 сек)

        console.log(`\n➡️ Переход к посту #${i + 1}...`);

        // Retry logic + Exponential Backoff
        while (retries < 3 && !successLoad) {
            try {
                const response = await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 45000 });
                const status = response ? response.status() : 200;

                if (status === 429) {
                    throw new Error('HTTP 429 Too Many Requests');
                }

                successLoad = true;
            } catch (err) {
                retries++;
                console.log(`⚠️ Ошибка загрузки поста #${i + 1} (Попытка ${retries}/3) - ${err.message}`);

                if (retries >= 3) {
                    console.log(`⏩ Пропуск поста #${i + 1}.`);
                    break;
                }

                console.log(`⏳ Отдых ${baseWaitTime / 1000} сек. перед повторной попыткой...`);
                await randomDelay(baseWaitTime, baseWaitTime);
                baseWaitTime *= 2; // Exponential Backoff: 30s -> 60s -> 120s
            }
        }

        if (!successLoad) continue;

        // Умная задержка 2-5 сек после загрузки
        await randomDelay(2000, 5000);

        // Fallback: Также собираем текст прямо со страницы, так как первый батч комментов может быть зашит в HTML
        const domTexts = await page.evaluate(() => {
            const spans = document.querySelectorAll('article span, article div[role="listitem"] span');
            return Array.from(spans).map(s => s.innerText ? s.innerText.trim() : '').filter(t => t.length > 5 && !t.match(/^[0-9]+[dhwsмч]$/i));
        });

        domTexts.forEach(t => currentPostTexts.add(t));

        // Анализ собранных текстов
        let foundKeyword = null;
        let targetText = '';

        for (const text of currentPostTexts) {
            const lowerTxt = text.toLowerCase();
            const matchedKw = KEYWORDS.find(kw => lowerTxt.includes(kw));

            if (matchedKw) {
                foundKeyword = matchedKw;
                targetText = text;
                break;
            }
        }

        if (foundKeyword) {
            console.log(`✅ Найдено совпадение! Ключевое слово: [${foundKeyword}]`);

            const imgUrl = await page.evaluate(() => {
                const img = document.querySelector('article img[style*="object-fit: cover"]') || document.querySelector('article img[class*="x5yr21d"]');
                return img ? img.src : null;
            });

            if (imgUrl) {
                globalReviewCount++;
                const filename = `review-${i + 1}-${globalReviewCount}.jpg`;
                const filepath = path.join(OUTPUT_DIR, filename);

                const downloaded = await downloadImage(imgUrl, filepath);
                if (downloaded) {
                    reviewsArr.push({
                        id: globalReviewCount,
                        clientName: 'Instagram Відгук',
                        text: targetText.substring(0, 1000).trim(), // Ограничиваем текст до 1000 символов
                        image: `/images/reviews/${filename}`,
                        category: determineCategory(targetText),
                        rating: 5,
                        sourceUrl: link
                    });

                    saveReviews(reviewsArr);
                    console.log(`💾 Отзыв сохранен. Всего собрано: ${globalReviewCount}`);
                }
            }
        } else {
            console.log(`❌ Совпадений не найдено. (Проверено символов: ${Array.from(currentPostTexts).join(' ').length})`);
        }

        // Random smart delay перед следующим постом
        const nextDelay = Math.floor(Math.random() * 3000) + 2000;
        console.log(`⏳ Отдых ${nextDelay} мс...`);
        await delay(nextDelay);
    }

    // 4. Финал
    console.log(`\n\n🎉 Парсинг полностью завершен!`);
    if (globalReviewCount > 0) {
        console.log(`✅ Найдено и сохранено отзывов: ${globalReviewCount} в ${DATA_FILE}`);
    } else {
        console.log('😔 Совпадений по ключевым словам не найдено.');
    }

    console.log('Закрытие браузера...');
    await browser.close();
    rl.close();
}

scrapeInstagram().catch(err => {
    console.error('\n💥 Критическая ошибка скрипта:', err);
    rl.close();
    process.exit(1);
});

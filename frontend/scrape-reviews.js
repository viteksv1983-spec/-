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

// Конфигурация анти-детекта
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

const VIEWPORTS = [
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1536, height: 864 }
];

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
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const randomDelay = (min = 2000, max = 5000) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Функция для добавления небольшого Jitter (дрожания) к задержке
const applyJitter = (baseMs, factor = 0.2) => {
    const jitterStr = baseMs * factor;
    return baseMs + Math.floor(Math.random() * (jitterStr * 2) - jitterStr);
};

// Структурированный логгер
const log = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    post: (idx, msg) => console.log(`[POST #${idx}] ${msg}`),
    warn: (msg) => console.log(`[WARN] ⚠️ ${msg}`),
    error: (msg) => console.error(`[ERROR] ❌ ${msg}`),
    succ: (msg) => console.log(`[SUCCESS] ✅ ${msg}`),
    debug: (msg) => { } // Временно отключен, чтобы не спамить
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
        log.error(`Ошибка загрузки изображения: ${error.message}`);
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
    const fileContent = `// Автоматически сгенерировано скриптом scrape-reviews.js (Hardened Production Edition)\n\nexport const reviewsData = ${JSON.stringify(reviewsArr, null, 4)};\n`;
    fs.writeFileSync(DATA_FILE, fileContent, 'utf-8');
}

// Strict Extract Texts - только из реальных комментариев
function extractStrictCommentsFromJSON(obj) {
    let texts = [];
    let stack = [obj];
    while (stack.length > 0) {
        let current = stack.pop();
        if (typeof current === 'object' && current !== null) {

            // Если мы дошли до ноды комментария
            if (current.hasOwnProperty('text') && typeof current.text === 'string') {
                // Проверяем, что это не caption (в caption обычно нет этих ключей рядом)
                // Или просто берем текст, если мы внутри edge_threaded_comments / edge_media_to_comment
                texts.push(current.text);
            }

            for (let k in current) {
                // Идем дальше только если ключ похож на контейнер комментов
                if (k === 'edge_threaded_comments' || k === 'edge_media_to_comment' || k === 'comments' || k === 'edges' || k === 'node') {
                    stack.push(current[k]);
                } else if (Array.isArray(current[k])) {
                    // Разворачиваем массивы
                    stack.push(...current[k]);
                }
            }
        }
    }
    return texts;
}

// Профессиональная загрузка комментариев (Production Stable)
async function fullyLoadComments(page) {
    let clicksCount = 0;
    const maxIterations = 25; // Увеличено до 25
    let iterations = 0;
    let previousHeight = 0;
    let sameHeightCount = 0;
    let previousCommentsCount = 0;
    const maxRuntimeMs = 20000; // 20 секунд макс
    const startTime = Date.now();

    while (iterations < maxIterations) {
        iterations++;

        // 1. Ищем ЛЮБОЙ scrollable контейнер
        const scrollResult = await page.evaluate(() => {
            const getScrollable = () => {
                const roots = document.querySelectorAll('article, div[role="dialog"], div[role="presentation"]');
                let bestScrollable = null;
                let maxScrollHeight = 0;

                for (const root of roots) {
                    const elements = root.querySelectorAll('div');
                    for (const el of elements) {
                        if (el.scrollHeight > el.clientHeight && el.clientHeight > 150) {
                            const style = window.getComputedStyle(el);
                            if (style.overflowY !== 'visible') {
                                if (el.scrollHeight > maxScrollHeight) {
                                    maxScrollHeight = el.scrollHeight;
                                    bestScrollable = el;
                                }
                            }
                        }
                    }
                }
                return bestScrollable;
            };

            const container = getScrollable();
            if (container) {
                container.scrollTo({ top: container.scrollHeight, behavior: 'instant' });
                return container.scrollHeight;
            } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
                return document.body.scrollHeight;
            }
        });

        const waitTimeScroll = Math.floor(Math.random() * (1300 - 900 + 1)) + 900; // 900-1300ms
        await new Promise(r => setTimeout(r, waitTimeScroll));

        // 2. Ищем и кликаем кнопки
        const clicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));
            const targetWords = ['view', 'repl', 'ответ', 'все', 'more'];

            for (let btn of buttons) {
                const text = (btn.innerText || btn.getAttribute('aria-label') || '').toLowerCase();

                // Проверка видимости
                if (btn.offsetWidth === 0 || btn.offsetHeight === 0) continue;
                const style = window.getComputedStyle(btn);
                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

                if (targetWords.some(w => text.includes(w)) && text.length > 0 && text.length < 80) {
                    let clickable = btn;
                    while (clickable && clickable.tagName !== 'BUTTON' && clickable.getAttribute('role') !== 'button' && clickable.tagName !== 'DIV') {
                        if (!clickable.parentElement) break;
                        clickable = clickable.parentElement;
                    }
                    if (clickable && typeof clickable.click === 'function') {
                        clickable.click();
                        return true;
                    }
                }
            }
            return false;
        });

        if (clicked) {
            clicksCount++;
            await new Promise(r => setTimeout(r, 1500 + Math.random() * 500)); // 1.5-2s
        }

        // Проверка количества комментариев в DOM
        const currentCommentsCount = await page.evaluate(() => {
            return document.querySelectorAll('article ul li span, div[role="dialog"] ul li span').length;
        });

        // 3. Условие выхода (нет роста scrollHeight И нет роста комментов)
        if (scrollResult === previousHeight && currentCommentsCount === previousCommentsCount) {
            sameHeightCount++;
            if (sameHeightCount >= 2 && !clicked) {
                break;
            }
        } else {
            sameHeightCount = 0;
        }

        previousHeight = scrollResult;
        previousCommentsCount = currentCommentsCount;

        // Лимит по времени
        if (Date.now() - startTime > maxRuntimeMs) {
            log.warn('Достигнут лимит времени fullyLoadComments (20s)');
            break;
        }
    }

    // 4. Ожидание завершения запросов XHR/Fetch
    await page.waitForNetworkIdle({ idleTime: 2000, timeout: 8000 }).catch(() => { });

    // 5. Fallback DOM extraction
    const domTexts = await page.evaluate(() => {
        const comments = document.querySelectorAll('article ul li span');
        return Array.from(comments)
            .map(n => n.innerText?.trim())
            .filter(t => t && t.length > 5);
    });

    return {
        clicksCount,
        totalScrolls: iterations,
        finalHeight: previousHeight,
        texts: domTexts
    };
}

// Извлечение шорткода поста из URL
function getShortcodeFromUrl(url) {
    const match = url.match(/\/p\/([^\/?#&]+)/);
    return match ? match[1] : null;
}

// Глобальные переменные
let globalReviewCount = 0;
const reviewsArr = [];
let isCheckpoint = false;
let globalRateLimitHits = 0;

// --- Основной скрипт ---
async function scrapeInstagram() {
    log.info(`🚀 Запуск Продакшн Версии (Production-Hardened, Anti-Bot).`);

    const selUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const selViewport = VIEWPORTS[Math.floor(Math.random() * VIEWPORTS.length)];

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: selViewport,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--start-maximized'
        ]
    });

    const page = await browser.newPage();

    // Hardening Fingerprint
    await page.setUserAgent(selUA);
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        Object.defineProperty(navigator, 'languages', { get: () => ['ru-RU', 'ru', 'en-US', 'en'] });
    });

    // Обработчик проверки на Checkpoint/Rate limit
    const globalResponseHandler = async (response) => {
        const status = response.status();
        const url = response.url();

        if (status === 429) {
            globalRateLimitHits++;
            log.warn(`HTTP 429 Too Many Requests detected. (Global Hit: ${globalRateLimitHits})`);
        }
        if (url.includes('/challenge/') || url.includes('/suspended/') || url.includes('/login/?next=')) {
            // Игнорируем логин редирект для static assets
            if (response.request().resourceType() === 'document' && !url.includes('graphql')) {
                log.error('Checkpoint / Login redirect Detected!');
                isCheckpoint = true;
            }
        }
    };
    page.on('response', globalResponseHandler);

    // Загрузка сессии
    if (fs.existsSync(SESSION_FILE)) {
        log.info('Загрузка сохраненных cookies...');
        const cookies = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
        await page.setCookie(...cookies);
    }

    log.info('Переход на Instagram...');
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
    await randomDelay(3000, 6000);

    if (isCheckpoint) {
        log.error('Работа прервана из-за обнаруженной блокировки (Checkpoint).');
        await browser.close();
        process.exit(1);
    }

    const isLoggedIn = await page.evaluate(() => {
        return !!document.querySelector('svg[aria-label="Home"]') || !!document.querySelector('svg[aria-label="Главная"]');
    });

    if (!isLoggedIn) {
        console.log('\n=============================================');
        log.warn('Требуется авторизация.');
        await askQuestion('⚠️ Пожалуйста, залогиньтесь в Instagram в браузере и нажмите ENTER в терминале... ');

        const currentCookies = await page.cookies();
        fs.writeFileSync(SESSION_FILE, JSON.stringify(currentCookies));
        log.succ('Cookies сохранены.');
        console.log('=============================================\n');
    }

    // Сбор ссылок
    log.info(`Переход на профиль @${TARGET_ACCOUNT}...`);
    await page.goto(`https://www.instagram.com/${TARGET_ACCOUNT}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });

    log.info(`Сбор ссылок на ${POSTS_TO_CHECK} постов...`);
    let postLinks = new Set();
    let scrollAttempts = 0;

    while (postLinks.size < POSTS_TO_CHECK) {
        if (isCheckpoint) break;

        const links = await page.$$eval('a[href*="/p/"]', anchors => anchors.map(a => a.href));
        const prevSize = postLinks.size;
        links.forEach(link => postLinks.add(link));

        process.stdout.write(`\r🔗 Собрано ссылок: ${postLinks.size} / ${POSTS_TO_CHECK}`);

        if (postLinks.size >= POSTS_TO_CHECK) break;

        await page.evaluate(() => window.scrollBy(0, 800 + Math.random() * 400));
        await randomDelay(2000, 4500);

        if (postLinks.size === prevSize) {
            scrollAttempts++;
            if (scrollAttempts > 4) {
                log.info('\nНовые посты не загружаются. Конец ленты.');
                break;
            }
        } else {
            scrollAttempts = 0;
        }
    }

    const linksArray = Array.from(postLinks).slice(0, POSTS_TO_CHECK);
    log.succ(`\nСбор ссылок завершен. Постов для анализа: ${linksArray.length}\n`);

    // Анализ каждого поста
    for (let i = 0; i < linksArray.length; i++) {
        if (isCheckpoint) {
            log.error('БЛОКИРОВКА АКТИВИРОВАНА. Останавливаем анализ текущих постов.');
            break;
        }

        const link = linksArray[i];
        const shortcode = getShortcodeFromUrl(link);
        let currentPostTexts = new Set();
        let successLoad = false;
        let retries = 0;
        let baseWaitTime = 60000; // 60 секунд базовая задержка при 429
        let is429 = false;

        // --- 1. Listener Isolation & GraphQL Capture ---
        // Строгое отслеживание запросов ТОЛЬКО текущего поста
        const postGraphQLHandler = async (response) => {
            const url = response.url();
            const req = response.request();
            if (response.status() === 429) is429 = true;

            if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') {
                if (url.includes('graphql') || url.includes('/comments/')) {
                    try {
                        if (!response.headers()['content-type']?.includes('application/json')) return;

                        const json = await response.json();

                        // Strict filter (только если в ответе есть комменты)
                        const jsonStr = JSON.stringify(json);
                        if (!jsonStr.includes('edge_threaded_comments') && !jsonStr.includes('edge_media_to_comment') && !jsonStr.includes('"comments"')) {
                            return;
                        }

                        const texts = extractStrictCommentsFromJSON(json);
                        texts.forEach(t => {
                            if (t.length > 5 && !t.match(/^[0-9]+$/)) currentPostTexts.add(t);
                        });
                        if (texts.length > 0) log.debug(`[GRAPHQL CAPTURED] Извлечено текстов: ${texts.length}`);
                    } catch (e) {
                        // Игнорируем ошибки парсинга
                    }
                }
            }
        };

        // Подписываемся ТОЛЬКО на время загрузки этого поста
        page.on('response', postGraphQLHandler);

        log.post(i + 1, `Анализ: ${link}`);

        try {
            // --- 2. Retry Логика и 429 RateLimit Handler ---
            while (retries < 3 && !successLoad) {
                try {
                    is429 = false;
                    await randomDelay(1000, 2000); // Random pause before action

                    const gotoResponse = await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 45000 });
                    const status = gotoResponse ? gotoResponse.status() : 200;

                    if (status === 429 || is429) {
                        throw new Error('HTTP 429');
                    }

                    // Post load stabilization
                    await page.waitForSelector('article', { timeout: 10000 }).catch(() => { });
                    await randomDelay(3000, 5000); // Ожидаем GraphQL ответы и стабилизацию DOM
                    successLoad = true;

                } catch (err) {
                    retries++;
                    const isRateLimit = err.message.includes('429');
                    log.warn(`[RETRY ${retries}/3] Ошибка загрузки поста: ${isRateLimit ? 'Rate Limit (429)' : err.message}`);

                    if (isCheckpoint) break; // Сразу выходим при чекпоинте

                    if (retries >= 3) {
                        log.warn(`Пропуск поста.`);
                        break;
                    }

                    let curWait = isRateLimit ? baseWaitTime : 15000;
                    curWait = applyJitter(curWait, 0.3); // Добавляем до 30% джиттера

                    log.info(`Ожидание ${Math.round(curWait / 1000)} сек. перед повтором...`);
                    await delay(curWait);

                    if (isRateLimit) baseWaitTime = Math.min(baseWaitTime * 2, 240000); // Max 4 минуты
                }
            }
            let graphQlTextsCount = currentPostTexts.size; // Запоминаем сколько пришло из GraphQL

            if (!successLoad || isCheckpoint) {
                continue;
            }

            // --- Профессиональная загрузка комментариев ---
            await randomDelay(3000, 5000);

            const { clicksCount, totalScrolls, finalHeight, texts } = await fullyLoadComments(page);
            if (clicksCount > 0 || totalScrolls > 0) {
                log.info(`[POST #${i + 1}] Expanded: ${clicksCount} clicks, ${totalScrolls} scrolls (H: ${finalHeight}px)`);
            }

            // 6. Anti-Race Condition Sequence
            await page.waitForNetworkIdle({ idleTime: 2000, timeout: 8000 }).catch(() => { });
            page.off('response', postGraphQLHandler);
            graphQlTextsCount = currentPostTexts.size; // Финальный размер GraphQL данных

            let domTextsCount = 0;
            // Добавляем DOM Fallback тексты
            if (texts && texts.length > 0) {
                texts.forEach(t => {
                    const before = currentPostTexts.size;
                    currentPostTexts.add(t);
                    if (currentPostTexts.size > before) domTextsCount++;
                });
            }

            // 4. Debug Counters
            log.info(`[POST #${i + 1}] GraphQL texts: ${graphQlTextsCount} | DOM texts added: ${domTextsCount} | Unique total: ${currentPostTexts.size}`);

            await randomDelay(2000, 3000);

            // Текст процессируется синхронно
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
                log.succ(`Найдено совпадение! Ключ: [${foundKeyword}]`);

                try {
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
                                text: targetText.substring(0, 1000).trim(),
                                image: `/images/reviews/${filename}`,
                                category: determineCategory(targetText),
                                rating: 5,
                                sourceUrl: link
                            });

                            saveReviews(reviewsArr);
                            log.info(`Отзыв сохранен. Всего собрано: ${globalReviewCount}`);
                        }
                    }
                } catch (e) {
                    log.error(`Не удалось сохранить картинку для поста: ${e.message}`);
                }
            } else {
                log.info(`Нет совпадений. (Текстов: ${currentPostTexts.size})`);
            }

            // Очистка Set и переменных
            currentPostTexts.clear();

        } finally {
            // --- 3. Memory Safety & Cleanup ---
            // Гарантируем отвязку, даже в случае ошибок выше
            try { page.off('response', postGraphQLHandler); } catch (e) { }
        }

        // Пауза перед следующим постом
        const nextDelay = applyJitter(3000, 0.5); // 1.5 - 4.5 сек
        log.info(`Пауза: ${Math.round(nextDelay)}мс.`);
        await delay(nextDelay);
    }

    // --- Финал ---
    console.log(`\n\n🎉 Парсинг завершен!`);
    if (globalReviewCount > 0) {
        log.succ(`Всего отзывов: ${globalReviewCount} -> ${DATA_FILE}`);
    } else {
        log.warn('Совпадений по ключевым словам не найдено.');
    }

    log.info('Отключаю браузер...');
    await browser.close();
    rl.close();
}

scrapeInstagram().catch(err => {
    log.error(`Критическая ошибка: ${err.message}`);
    rl.close();
    process.exit(1);
});

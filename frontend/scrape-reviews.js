import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Настройки поиска ---
const TARGET_ACCOUNT = 'liudmilaprikhodko';
const POSTS_TO_CHECK = 1000;
const CONCURRENT_PAGES = 3; // Количество одновременных вкладок (Параллельная обработка)

const KEYWORDS = [
    'відгук', 'дякую', 'замовлення', 'смачно', 'торт', 'тортик',
    'спасибо', 'отзыв', 'заказ', 'вкусно', 'неймовірно', 'рекомендую',
    'шедевр', 'восторг', 'невероятно', 'наслаждение', 'начинка',
    'разрез', 'розріз', 'декор', 'эстетика', 'вкус', 'смак'
];

const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'reviews');
const DATA_FILE = path.join(__dirname, 'src', 'data', 'reviewsData.js');

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
    const fileContent = `// Автоматически сгенерировано скриптом scrape-reviews.js (High Performance/Concurrent Edition)\n\nexport const reviewsData = ${JSON.stringify(reviewsArr, null, 4)};\n`;
    fs.writeFileSync(DATA_FILE, fileContent, 'utf-8');
}

// Глобальные переменные для результатов
let globalReviewCount = 0;
const reviewsArr = [];

// --- Функция обработки одного поста ---
async function processPost(browser, link, postIndex) {
    const page = await browser.newPage();

    // Блокируем лишние ресурсы для ускорения (картинки интерфейса, шрифты и тд, но оставляем основные img)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['font', 'stylesheet'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    try {
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Стартовая задержка для прогрузки интерфейса
        await delay(3000 + Math.floor(Math.random() * 1000));

        let expandClickCount = 0;
        let lastElementCount = 0;

        // Фикс "бесконечного клика": Умное ожидание и счетчик элементов
        while (true) {
            // Считаем объем видимого текста до клика
            const currentElementCount = await page.evaluate(() => document.querySelectorAll('span, div[role="listitem"]').length);

            // Пытаемся развернуть ветки
            const clicked = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('div[role="button"], button, svg circle'));
                const targetWords = ['view', 'all', 'comments', 'посмотре', 'все', 'комментари', 'більше', 'load', 'more', 'ответ', 'replies', 'ответов'];

                for (let btn of buttons) {
                    const txt = (btn.innerText || btn.getAttribute('aria-label') || '').toLowerCase();
                    // Проверяем, что это именно кнопка разворачивания
                    const isExpandBtn = targetWords.some(w => txt.includes(w)) || txt.includes('+');
                    if (isExpandBtn && txt.length > 0 && txt.length < 40) {
                        let clickable = btn;
                        while (clickable && clickable.tagName !== 'BUTTON' && clickable.getAttribute('role') !== 'button' && clickable.tagName !== 'DIV') {
                            if (!clickable.parentElement) break;
                            clickable = clickable.parentElement;
                        }
                        if (clickable && typeof clickable.click === 'function') {
                            clickable.click();
                            return true; // Кликнули
                        }
                    }
                }
                return false;
            });

            if (!clicked) {
                break; // Кнопок больше нет
            }

            expandClickCount++;

            // Smart Wait: Ожидание 2 секунды после клика, чтобы данные пришли с сервера
            await delay(2000);

            // Проверяем, изменилось ли количество элементов (защита от зацикливания)
            const newElementCount = await page.evaluate(() => document.querySelectorAll('span, div[role="listitem"]').length);

            if (newElementCount <= currentElementCount) {
                // Сервер не отдал новые данные (или завис) -> выходим
                break;
            }
        }

        console.log(`\n📌 Пост #${postIndex}: развернуто ${expandClickCount} веток комментариев`);

        // Логика сбора текста (DOM Extraction)
        // Точный селектор: берем текст из комментов и обходим мусор
        const extractedTexts = await page.evaluate(() => {
            const texts = [];
            // Ищем внутри ul > div > li, а также общие span на случай другой верстки
            const commentNodes = document.querySelectorAll('article ul span, article div[role="listitem"] span[dir="auto"], h1[dir="auto"]');

            commentNodes.forEach(node => {
                const txt = node.innerText ? node.innerText.trim() : '';
                // Фильтруем имена, даты и кнопки
                if (txt.length >= 10 && !txt.match(/^[0-9]+[dhwsмч]$/i) && txt !== 'Ответить' && txt !== 'Reply') {
                    texts.push(txt);
                }
            });
            // Возвращаем уникальные тексты, чтобы не было дублей
            return Array.from(new Set(texts));
        });

        const totalAnalyzedChars = extractedTexts.join(' ').length;
        console.log(`� Прочитано символов: ${totalAnalyzedChars} (Пост #${postIndex})`);

        let foundKeyword = null;
        let targetText = '';

        // Фильтрация по KEYWORDS
        for (const txt of extractedTexts) {
            const lowerTxt = txt.toLowerCase();
            const matchedKw = KEYWORDS.find(kw => lowerTxt.includes(kw));

            if (matchedKw) {
                foundKeyword = matchedKw;
                targetText = txt;
                break;
            }
        }

        if (foundKeyword) {
            console.log(`✨ Статус: Ключевое слово '${foundKeyword}' найдено! Сохраняю... (Пост #${postIndex})`);

            const imgUrl = await page.evaluate(() => {
                const img = document.querySelector('article img[style*="object-fit: cover"]') || document.querySelector('article img[class*="x5yr21d"]');
                return img ? img.src : null;
            });

            if (imgUrl) {
                globalReviewCount++;
                const filename = `review-${postIndex}-${globalReviewCount}.jpg`;
                const filepath = path.join(OUTPUT_DIR, filename);

                const success = await downloadImage(imgUrl, filepath);
                if (success) {
                    reviewsArr.push({
                        id: globalReviewCount,
                        clientName: 'Людмила Приходько (Instagram)',
                        text: targetText,
                        image: `/images/reviews/${filename}`,
                        category: determineCategory(targetText),
                        rating: 5,
                        sourceUrl: link
                    });

                    // Сохранение прямо по факту нахождения
                    saveReviews(reviewsArr);
                }
            }
        }
    } catch (err) {
        console.error(`❌ Ошибка в посте #${postIndex}: ${err.message}`);
    } finally {
        await page.close();
    }
}

// --- Основной скрипт ---
async function scrapeInstagram() {
    console.log(`🚀 Запуск Senior Level Scraper (Concurrent Threads: ${CONCURRENT_PAGES})...`);

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();

    // 1. Ручная авторизация
    console.log('🔗 Переход на страницу логина...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

    console.log('\n=============================================');
    console.log('⚠️ ДЕЙСТВИЕ: Пожалуйста, залогиньтесь в Instagram в браузере.');
    await askQuestion('⚠️ Нажмите ENTER в ТЕРМИНАЛЕ после успешного входа... ');
    console.log('=============================================\n');

    // 2. Сбор ссылок на посты
    console.log(`🔍 Переход на профиль @${TARGET_ACCOUNT}...`);
    await page.goto(`https://www.instagram.com/${TARGET_ACCOUNT}/`, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log(`\n⏳ Сбор ссылок на ${POSTS_TO_CHECK} постов...`);
    let postLinks = new Set();
    let scrollAttempts = 0;

    while (postLinks.size < POSTS_TO_CHECK) {
        const links = await page.$$eval('a[href*="/p/"]', anchors => anchors.map(a => a.href));
        const prevSize = postLinks.size;
        links.forEach(link => postLinks.add(link));

        process.stdout.write(`\r🔗 Собрано уникальных ссылок: ${postLinks.size} / ${POSTS_TO_CHECK}`);

        if (postLinks.size >= POSTS_TO_CHECK) break;

        await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
        await delay(3000 + Math.random() * 1000); // Smart Wait при скролле ленты

        if (postLinks.size === prevSize) {
            scrollAttempts++;
            if (scrollAttempts > 5) {
                console.log('\n🛑 Достигнут конец ленты.');
                break;
            }
        } else {
            scrollAttempts = 0;
        }
    }

    const linksArray = Array.from(postLinks).slice(0, POSTS_TO_CHECK);
    console.log(`\n✅ Сбор ссылок завершен. Постов для анализа: ${linksArray.length}\n`);

    // Закрываем основную вкладку перед пулом
    await page.close();

    // 3. Параллельная обработка (Concurrent Processing)
    for (let i = 0; i < linksArray.length; i += CONCURRENT_PAGES) {
        const chunk = linksArray.slice(i, i + CONCURRENT_PAGES);

        console.log(`\n⚙️  Запуск потоков для постов ${i + 1} - ${i + chunk.length}...`);

        // Создаем массив промисов
        const promises = chunk.map((link, idx) => processPost(browser, link, i + 1 + idx));

        // Дожидаемся завершения пачки
        await Promise.all(promises);
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

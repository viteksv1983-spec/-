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
const POSTS_TO_CHECK = 100; // Отладка на 100 постов
const CONCURRENT_PAGES = 3; // Кол-во параллельных вкладок

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
    const fileContent = `// Автоматически сгенерировано скриптом scrape-reviews.js (Senior Edition)\n\nexport const reviewsData = ${JSON.stringify(reviewsArr, null, 4)};\n`;
    fs.writeFileSync(DATA_FILE, fileContent, 'utf-8');
}

let globalReviewCount = 0;
const reviewsArr = [];

// --- Функция обработки одного поста ---
async function processPost(browser, link, postIndex) {
    const page = await browser.newPage();

    // Стабильность страницы: открываем в нормальном разрешении
    await page.setViewport({ width: 1280, height: 1000 });

    try {
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await delay(3000 + Math.floor(Math.random() * 1000));

        // Проверка на белый экран
        const bodyLength = await page.evaluate(() => document.body.innerHTML.length);
        if (bodyLength < 1000) {
            console.log(`⚠️ Пост #${postIndex}: Обнаружена некорректная загрузка (белый экран), перезагружаю страницу...`);
            await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
            await delay(4000);
        }

        let expandClickCount = 0;

        // Умный кликер комментариев
        while (expandClickCount < 5) {
            // Запоминаем текущий объем текста перед кликом
            const currentCharCount = await page.evaluate(() => {
                const article = document.querySelector('article');
                return article ? article.innerText.length : 0;
            });

            // Ищем и кликаем "Посмотреть все комментарии"
            const clicked = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('div[role="button"], button, svg circle'));
                const targetWords = ['view', 'all', 'comments', 'посмотре', 'все', 'комментари', 'більше', 'load', 'more', 'ответ', 'replies', 'ответов', '+'];

                for (let btn of buttons) {
                    const txt = (btn.innerText || btn.getAttribute('aria-label') || '').toLowerCase();
                    const isExpandBtn = targetWords.some(w => txt.includes(w)) || txt === '+';

                    if (isExpandBtn && txt.length > 0 && txt.length < 40) {
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

            if (!clicked) {
                break; // Нет больше кнопок
            }

            expandClickCount++;

            // Умное ожидание: Instagram динамичен
            await delay(2000);

            // Проверяем, увеличилось ли количество текста
            const newCharCount = await page.evaluate(() => {
                const article = document.querySelector('article');
                return article ? article.innerText.length : 0;
            });

            if (newCharCount <= currentCharCount) {
                // Если текст не прибавился, прекращаем кликать (предотвращает зависание)
                break;
            }
        }

        if (expandClickCount > 0) {
            console.log(`📌 Пост #${postIndex}: развернуто ${expandClickCount} веток комментариев`);
        }

        // Захват текста (DOM Extraction)
        // Собираем ВЕСЬ текстовый контент из блока комментариев article ul
        const extractedText = await page.evaluate(() => {
            const commentsContainer = document.querySelector('article ul') || document.querySelector('article');
            if (!commentsContainer) return '';

            // Получаем весь видимый текст, чистим от базового системного мусора
            let text = commentsContainer.innerText || '';
            text = text.replace(/Ответить|Reply|Hide replies|Посмотреть перевод|-/g, ' ');
            // Удаляем временные метки "3 дн", "5 ч" и тд
            text = text.replace(/(\d+)\s*(ч|д|н|дн|недель|h|d|w)\b/gi, ' ');
            return text;
        });

        const totalAnalyzedChars = extractedText.length;
        console.log(`📈 Проанализировано ${totalAnalyzedChars} символов в комментариях поста #${postIndex}`);

        let foundKeyword = null;

        // Фильтруем массив(текст) по KEYWORDS
        const lowerTxt = extractedText.toLowerCase();
        for (const kw of KEYWORDS) {
            if (lowerTxt.includes(kw)) {
                foundKeyword = kw;
                break;
            }
        }

        if (foundKeyword) {
            console.log(`✨ Успех! Найден ключ: [${foundKeyword}] (Пост #${postIndex})`);

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
                        // Сохраняем адекватный отрывок, чтобы карточка обзора помещала его
                        text: extractedText.substring(0, 1000).trim() + '...',
                        image: `/images/reviews/${filename}`,
                        category: determineCategory(extractedText),
                        rating: 5,
                        sourceUrl: link // ссылка на пост
                    });

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
    console.log(`🚀 Запуск Senior Edition Scraper (Concurrent Threads: ${CONCURRENT_PAGES})...`);

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1000 });

    console.log('🔗 Переход на страницу логина...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

    console.log('\n=============================================');
    console.log('⚠️ ДЕЙСТВИЕ: Пожалуйста, залогиньтесь в Instagram в браузере.');
    await askQuestion('⚠️ Нажмите ENTER в ТЕРМИНАЛЕ после успешного входа... ');
    console.log('=============================================\n');

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
        await delay(3000 + Math.random() * 1000);

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

    await page.close();

    // Параллельная загрузка
    for (let i = 0; i < linksArray.length; i += CONCURRENT_PAGES) {
        const chunk = linksArray.slice(i, i + CONCURRENT_PAGES);
        console.log(`\n⚙️  Запуск потоков для постов ${i + 1} - ${i + chunk.length}...`);

        const promises = chunk.map((link, idx) => processPost(browser, link, i + 1 + idx));
        await Promise.all(promises);
    }

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

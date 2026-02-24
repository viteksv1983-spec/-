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
const KEYWORDS = [
    'відгук', 'дякую', 'замовлення', 'смачно', 'торт', 'тортик',
    'спасибо', 'отзыв', 'заказ', 'вкусно', 'неймовірно', 'рекомендую',
    'шедевр', 'восторг', 'невероятно', 'наслаждение', 'начинка',
    'разрез', 'розріз', 'декор', 'эстетика', 'вкус', 'смак'
];

const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'reviews');
const DATA_FILE = path.join(__dirname, 'src', 'data', 'reviewsData.js');

// --- Инициализация интерфейса консоли ---
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

// --- Создание директорий ---
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// --- Вспомогательные функции ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadImage(url, filepath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            writer.on('finish', () => resolve(true));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`\n❌ Ошибка загрузки картинки: ${error.message}`);
        return false;
    }
}

function determineCategory(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('бенто')) return 'bento';
    if (lowerText.includes('весіл') || lowerText.includes('свадеб')) return 'vesilni';
    return 'general';
}

function saveReviews(reviewsArr) {
    const fileContent = `// Автоматически сгенерировано скриптом scrape-reviews.js (High Performance)\n\nexport const reviewsData = ${JSON.stringify(reviewsArr, null, 4)};\n`;
    fs.writeFileSync(DATA_FILE, fileContent, 'utf-8');
}

// --- Основной скрипт ---
async function scrapeInstagram() {
    console.log('🚀 Запуск Puppeteer (High Performance Mode)...');

    let browser = await puppeteer.launch({
        headless: false, // видимый режим для ручного логина
        defaultViewport: null,
        args: ['--start-maximized']
    });

    let page = await browser.newPage();

    // 1. Ручная авторизация
    console.log('🔗 Переход на страницу логина...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

    console.log('\n=============================================');
    console.log('⚠️ ДЕЙСТВИЕ: Пожалуйста, залогиньтесь в Instagram в открывшемся браузере.');
    await askQuestion('⚠️ Нажмите ENTER в ТЕРМИНАЛЕ после успешного входа в аккаунт... ');
    console.log('=============================================\n');

    // 2. Сбор ссылок на посты
    console.log(`🔍 Переход на профиль @${TARGET_ACCOUNT}...`);
    await page.goto(`https://www.instagram.com/${TARGET_ACCOUNT}/`, { waitUntil: 'networkidle2' });

    await page.waitForSelector('article', { timeout: 15000 }).catch(() => console.log('Не удалось найти посты (возможно, закрытый аккаунт или медленный интернет).'));

    console.log(`\n⏳ Сбор ссылок на ${POSTS_TO_CHECK} постов. Это займет время...`);
    let postLinks = new Set();
    let scrollAttempts = 0;

    while (postLinks.size < POSTS_TO_CHECK) {
        // Парсим обычные посты и рилсы
        const links = await page.$$eval('article a[href^="/p/"], article a[href^="/reel/"]', anchors => anchors.map(a => a.href));
        const prevSize = postLinks.size;
        links.forEach(link => postLinks.add(link));

        process.stdout.write(`\rСобрано ссылок: ${postLinks.size} / ${POSTS_TO_CHECK}`);

        if (postLinks.size >= POSTS_TO_CHECK) break;

        // Скроллим вниз
        await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
        await delay(1500 + Math.random() * 1000); // 1.5 - 2.5 секунды

        if (postLinks.size === prevSize) {
            scrollAttempts++;
            if (scrollAttempts > 5) {
                console.log('\n🛑 Больше постов не загружается. Достигнут конец ленты.');
                break;
            }
        } else {
            scrollAttempts = 0;
        }
    }

    const linksArray = Array.from(postLinks).slice(0, POSTS_TO_CHECK);
    console.log(`\n✅ Сбор завершен. Найдено ${linksArray.length} уникальных постов для глубокого анализа.\n`);

    let reviewsArr = [];
    let reviewCount = 0;

    // 3. Глубокий анализ каждого поста
    for (let i = 0; i < linksArray.length; i++) {
        const link = linksArray[i];

        // Оптимизация памяти (перезапуск сессии каждые 100 постов)
        if (i > 0 && i % 100 === 0) {
            console.log(`\n🔄 Оптимизация: Обновление сессии браузера (пройдено ${i} постов)...`);
            await page.close();
            page = await browser.newPage();
            // Возвращаемся в инсту, чтобы куки подцепились нормально
            await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });
        }

        try {
            await page.goto(link, { waitUntil: 'domcontentloaded' });

            // Имитация чтения человеком (задержка 3-4 сек)
            await delay(3000 + Math.floor(Math.random() * 1000));

            // Извлечение текста
            const textContent = await page.evaluate(() => {
                const element = document.querySelector('h1[dir="auto"]') || document.querySelector('span[dir="auto"]');
                return element ? element.innerText : '';
            });

            let foundReview = false;
            let previewText = '';

            if (textContent) {
                const lowerText = textContent.toLowerCase();
                // Поиск по ключевым словам (регистронезависимо)
                const isReview = KEYWORDS.some(word => lowerText.includes(word));

                if (isReview) {
                    foundReview = true;
                    // Извлечение URL картинки (ищем первый попавшийся img)
                    const imgUrl = await page.evaluate(() => {
                        const img = document.querySelector('article img[style*="object-fit: cover"]') || document.querySelector('article img[class*="x5yr21d"]');
                        return img ? img.src : null;
                    });

                    if (imgUrl) {
                        reviewCount++;
                        // Название файла: review-index-id.jpg
                        const filename = `review-${i + 1}-${reviewCount}.jpg`;
                        const filepath = path.join(OUTPUT_DIR, filename);
                        const publicUrl = `/images/reviews/${filename}`;

                        await downloadImage(imgUrl, filepath);

                        const category = determineCategory(textContent);

                        reviewsArr.push({
                            id: reviewCount,
                            clientName: 'Людмила Приходько (Instagram)',
                            text: textContent.trim(),
                            image: publicUrl,
                            category: category,
                            rating: 5,
                            sourceUrl: link // добавляем ссылку на оригинал (опционально)
                        });

                        // Сохраняем каждые 10 отзывов для надежности
                        if (reviewCount % 10 === 0) {
                            saveReviews(reviewsArr);
                            console.log(`\n💾 Автосохранение... (сохранено ${reviewCount} отзывов)`);
                        }

                        previewText = textContent.replace(/\ng/, ' ').substring(0, 50) + '...';
                    }
                }
            }

            // Информативный лог
            const msg = `Проверено ${i + 1} из ${linksArray.length}. Найдено отзывов: ${reviewCount}.`;
            if (foundReview) {
                console.log(`\n✨ ПОСТ #${i + 1}: ${msg}\n   Последний найденный текст: "${previewText}"`);
            } else {
                process.stdout.write(`\r${msg}`);
            }

        } catch (err) {
            console.error(`\n❌ Ошибка при обработке поста #${i + 1} (${link}): ${err.message}`);
        }
    }

    // 4. Финальное сохранение
    console.log(`\n\n🎉 Парсинг полностью завершен!`);
    if (reviewsArr.length > 0) {
        saveReviews(reviewsArr);
        console.log(`✅ Финальное сохранение: ${reviewsArr.length} отзывов успешно экспортировано в ${DATA_FILE}`);
    } else {
        console.log('😔 К сожалению, по заданным ключевым словам отзывы не найдены.');
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

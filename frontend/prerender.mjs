/**
 * prerender.mjs — Puppeteer-based prerender for Vite React SPA
 * 
 * Runs AFTER `vite build && node generate-seo-pages.js`
 * Visits key SEO routes with headless Chrome and saves rendered HTML to dist/
 * 
 * Usage: node prerender.mjs
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Routes to prerender ───────────────────────────────────────────
const PRERENDER_ROUTES = [
    '/',
    '/torty-na-zamovlennya/vesilni/',
    '/torty-na-zamovlennya/na-den-narodzhennya/',
    '/torty-na-zamovlennya/dytyachi/',
];

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// ─── Helpers ───────────────────────────────────────────────────────

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function routeToFilePath(route) {
    // '/' → 'dist/index.html'
    // '/torty-na-zamovlennya/vesilni/' → 'dist/torty-na-zamovlennya/vesilni/index.html'
    const cleaned = route === '/' ? '' : route.replace(/^\/|\/$/g, '');
    const dir = path.join(DIST_DIR, cleaned);
    return path.join(dir, 'index.html');
}

// ─── Main ──────────────────────────────────────────────────────────

async function prerender() {
    // Check dist exists
    if (!fs.existsSync(DIST_DIR)) {
        console.error('❌ dist/ directory not found. Run "vite build" first.');
        process.exit(1);
    }

    console.log('🚀 Starting prerender...');
    console.log(`   Routes: ${PRERENDER_ROUTES.length}`);
    console.log(`   Port: ${PORT}`);

    // 1. Start vite preview server
    console.log('\n📦 Starting vite preview server...');
    const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
    });

    let serverReady = false;
    server.stdout.on('data', (data) => {
        const msg = data.toString();
        if (msg.includes('http://') || msg.includes('Local:')) {
            serverReady = true;
        }
    });
    server.stderr.on('data', (data) => {
        // Vite sometimes outputs to stderr
        const msg = data.toString();
        if (msg.includes('http://') || msg.includes('Local:')) {
            serverReady = true;
        }
    });

    // Wait for server to be ready (max 15s)
    const startWait = Date.now();
    while (!serverReady && Date.now() - startWait < 15000) {
        await sleep(500);
    }
    // Extra safety wait
    await sleep(2000);
    console.log('   ✅ Server ready');

    // 2. Launch Puppeteer
    let browser;
    try {
        const puppeteer = await import('puppeteer-core');
        const chromium = await import('@sparticuz/chromium');

        browser = await puppeteer.default.launch({
            args: chromium.default.args,
            defaultViewport: chromium.default.defaultViewport,
            executablePath: await chromium.default.executablePath(),
            headless: chromium.default.headless,
            ignoreHTTPSErrors: true,
        });

        console.log('   ✅ Puppeteer browser launched\n');

        // 3. Render each route
        for (const route of PRERENDER_ROUTES) {
            const url = `${BASE_URL}${route}`;
            console.log(`🔄 Rendering: ${route}`);

            const page = await browser.newPage();

            // Block unnecessary resources for speed
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const type = req.resourceType();
                if (['image', 'media', 'font'].includes(type)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            try {
                await page.goto(url, {
                    waitUntil: 'networkidle2',
                    timeout: 30000,
                });

                // Wait for React to render content inside #root
                await page.waitForFunction(
                    () => {
                        const root = document.getElementById('root');
                        return root && root.children.length > 0;
                    },
                    { timeout: 15000 }
                );

                // Small extra wait for async content (API calls etc.)
                await sleep(2000);

                // Get full rendered HTML
                let html = await page.content();

                // Remove any scripts that might cause issues with rehydration
                // We keep them — React will hydrate normally via createRoot
                // Just clean up Puppeteer-specific artifacts
                html = html.replace(/data-n-head="[^"]*"/g, '');

                // Save to dist
                const filePath = routeToFilePath(route);
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(filePath, html, 'utf-8');

                const size = (Buffer.byteLength(html) / 1024).toFixed(1);
                console.log(`   ✅ Saved: ${filePath} (${size} KB)`);

            } catch (err) {
                console.error(`   ❌ Failed to render ${route}: ${err.message}`);
            } finally {
                await page.close();
            }
        }

    } catch (err) {
        console.error('❌ Puppeteer error:', err.message);
        process.exit(1);
    } finally {
        // 4. Cleanup
        if (browser) {
            await browser.close();
            console.log('\n🔒 Browser closed');
        }
        server.kill('SIGTERM');
        console.log('🔒 Preview server stopped');
    }

    // 5. Verify
    console.log('\n═══ Verification ═══');
    let allOk = true;
    for (const route of PRERENDER_ROUTES) {
        const filePath = routeToFilePath(route);
        if (!fs.existsSync(filePath)) {
            console.log(`❌ Missing: ${filePath}`);
            allOk = false;
            continue;
        }
        const html = fs.readFileSync(filePath, 'utf-8');
        const hasContent = !html.includes('<div id="root"></div>');
        const hasH1 = html.includes('<h1');
        console.log(`${hasContent && hasH1 ? '✅' : '⚠️'} ${route} — content:${hasContent}, h1:${hasH1}`);
        if (!hasContent || !hasH1) allOk = false;
    }

    console.log(allOk ? '\n🎉 Prerender complete! All pages verified.' : '\n⚠️ Some pages may need attention.');
}

prerender();

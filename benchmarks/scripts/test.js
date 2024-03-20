const puppeteer = require('puppeteer');

const opts = {
    PAGE_ADDRESS: 'http://localhost:5500/',
    TRACE_DURATION: 2000, // ms
    TEXTE_SCRAMBLE_ANIMATION_DURATION: 6000, // ms
    PARTICLES_NUMBER_TEST_BATCH: 100,
    MAX_NUMBER_OF_PARTICLES: 1500,
    MAX_NUMBER_OF_WEB_WORKERS: 8,
    MAX_TRACE_DURATION: 100000,
};

(async () => {
    // Launch puppeteer + chrome browser
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    // Load page
    await loadPage(page, opts.PAGE_ADDRESS);
})();

async function loadPage(page, pageAddress) {
    await page.goto(pageAddress, { waitUntil: 'networkidle0' });
    console.log('Page loaded. Waiting for TextScramble animation to terminate.');
    await new Promise(resolve => setTimeout(resolve, opts.TEXTE_SCRAMBLE_ANIMATION_DURATION));
    console.log('TextScramble animation over.');
}

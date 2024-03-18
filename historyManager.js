const puppeteer = require('puppeteer');

let browsers = [];

async function openBrowser(numberOfSessions) {
    for (let i = 0; i < numberOfSessions; i++) {
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: `./user-data-dir${i + 1}` // Создаем отдельную папку для каждой сессии
        });
        browsers.push(browser);
    }
}

async function openPage(sessionIndex, url) {
    if (!browsers[sessionIndex]) {
        console.error('Браузер для указанной сессии не найден.');
        return;
    }

    const page = await browsers[sessionIndex].newPage();
    await page.goto(url);

    return page;
}

module.exports = {
    openBrowser,
    openPage
};

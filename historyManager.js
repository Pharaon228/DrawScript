const puppeteer = require('puppeteer');
const fs = require('fs');

let browsers = [];

async function openBrowser(numberOfSessions) {
    for (let i = 0; i < numberOfSessions; i++) {
        let headless = false;


        const srcValueFileName = `./user-data-dir${i + 1}/srcValue.txt`;
        if (fs.existsSync(srcValueFileName)) {
            headless = true;
        }

        const browser = await puppeteer.launch({
            headless: headless,
            userDataDir: `./user-data-dir${i + 1}`
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

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });


    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/developerInfo.html');

    await page.evaluate(() => {
        const audio = document.querySelector('audio');
        if (audio) {
            audio.play();
        }
    });

    await new Promise(resolve => browser.once('disconnected', resolve));
})();

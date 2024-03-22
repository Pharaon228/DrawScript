const puppeteer = require("puppeteer");
const fs = require("fs");

let browsers = [];

async function openBrowser(numberOfSessions) {
    for (let i = 0; i < numberOfSessions; i++) {
        let headless = false;

        const srcValueFileName = `./user-data-dir${i + 1}/srcValue.txt`;
        if (fs.existsSync(srcValueFileName)) {
            headless = false;
        }

        const browser = await puppeteer.launch({
            headless: headless,
            userDataDir: `./user-data-dir${i + 1}`,
        });

        browsers.push(browser);
    }
}

async function closeBrowsers(numberOfSessions) {
    for (let i = 0; i < numberOfSessions; i++) {
        await browsers[i].close();
        console.log("Браузеры закрыты");
    }
}

async function closeBrowsers() {
    for (let i = 0; i < numberOfSessions; i++) {
        await browsers[sessionIndex].close();
    }
}

async function openPage(sessionIndex, url) {
<<<<<<< HEAD
    if (!browsers[sessionIndex]) {
        console.error('Браузер для указанной сессии не найден.');
        return;
    }
    const page = await browsers[sessionIndex].newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148');
    await page.goto(url);

    return page;
}

module.exports = {
    openBrowser,
    openPage,
    closeBrowsers
=======
  if (!browsers[sessionIndex]) {
    console.error("Браузер для указанной сессии не найден.");
    return;
  }
  const page = await browsers[sessionIndex].newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
  );
  await page.goto(url);

  return page;
}

module.exports = {
  openBrowser,
  openPage,
  closeBrowsers,
>>>>>>> 2de1fcd0a6b41d9bdb2dce5e26100c8287734f2f
};

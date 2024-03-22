async function checkAndPurchaseBooster(page, chosenBooster, clickCounter, id) {
    const hasActiveBooster = await checkActiveBooster(page);
    const balance = await getCurrentBalance(page);
    if ((hasActiveBooster) && (balance >= chosenBooster.cost) && (chosenBooster.level != 'без бустера')) {
        console.log('\x1b[32m%s\x1b[0m', 'Активный бустер отсутствует. Покупаем бустер...');

        await page.waitForSelector('a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]');
        await page.click('a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]');

        await page.waitForSelector(chosenBooster.link);
        await page.click(chosenBooster.link);

        await page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.gvlQbP');
        await page.click('.BlackButtonStyled-sc-155f8n4-0.gvlQbP');

        console.log(`Бустер ${chosenBooster.level} уровня успешно куплен.`);
        console.log('\x1b[33m%s\x1b[0m', `Для сессии ${id + 1} Текущий баланс: ${balance}.`);
        console.log(`Для сессии ${id + 1} за время работы бустера было совершено ${clickCounter} нажатий.`);

        await delay(1000);
        clickCounter = 0;
        return clickCounter;
    } else {

        if ((clickCounter % 20 === 0) || (clickCounter === 0)) {
            console.log('\x1b[33m%s\x1b[0m', `Для сессии ${id + 1} Текущий баланс: ${balance}.`);
            console.log(`Для сессии ${id + 1} было совершено ${clickCounter} нажатий.`);
        }

        //console.log('На данный момент активный бустер уже имеется. Повторная попытка покупки позже.');
        return clickCounter;
    }
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getCurrentBalance(page) {
    await page.waitForSelector('.AnimatedNumberStyled-sc-98h1so-0.kSpFWd');
    const balanceText = await page.$eval('.AnimatedNumberStyled-sc-98h1so-0.kSpFWd', span => span.textContent);
    return parseInt(balanceText.replace(/\D/g, ''), 10);
}

async function checkActiveBooster(page) {
    const hasActiveBooster = !(await page.$('.ActiveBoosterWrapper-sc-13defe5-0.bkpUKH'));
    return hasActiveBooster;
}

module.exports = {
    checkAndPurchaseBooster
};

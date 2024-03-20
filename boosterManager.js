async function checkAndPurchaseBooster(page, chosenBooster) {
    const hasActiveBooster = await checkActiveBooster(page);

    if (hasActiveBooster) {
        console.log('Активный бустер отсутствует. Покупаем бустер...');

        await page.waitForSelector('a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]');
        await page.click('a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]');

        await page.waitForSelector(chosenBooster.link);
        await page.click(chosenBooster.link);

        await page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.gvlQbP');
        await page.click('.BlackButtonStyled-sc-155f8n4-0.gvlQbP');

        console.log(`Бустер ${chosenBooster.level} уровня успешно куплен.`);

        return true; // Бустер успешно куплен
    } else {
        //console.log('На данный момент активный бустер уже имеется. Повторная попытка покупки позже.');
        return false; // Активный бустер уже имеется
    }
}

async function checkActiveBooster(page) {
    const hasActiveBooster = !(await page.$('.ActiveBoosterWrapper-sc-13defe5-0.bkpUKH'));
    return hasActiveBooster;
}

module.exports = {
    checkAndPurchaseBooster
};

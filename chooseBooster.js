async function chooseBooster(page) {
    // Получаем баланс
    await page.waitForSelector('.AnimatedNumberStyled-sc-98h1so-0.kSpFWd');
    const balanceText = await page.$eval('.AnimatedNumberStyled-sc-98h1so-0.kSpFWd', span => span.textContent);
    const balance = parseInt(balanceText.replace(/\D/g, ''), 10);

    const choices = [
        { level: 'первого', cost: 1000, link: 'a.ShopItemStyled-xpqzty-0.dJGOTi[href="/shop/0"]' },
        { level: 'второго', cost: 3000, link: 'a.ShopItemStyled-xpqzty-0.gxHYVM[href="/shop/1"]' },
        { level: 'третьего', cost: 10000, link: 'a.ShopItemStyled-xpqzty-0.iXVjKg[href="/shop/2"]' },
        { level: 'четвёртого', cost: 20000, link: 'a.ShopItemStyled-xpqzty-0.fhYEXS[href="/shop/3"]' }
    ];

    for (const choice of choices) {
        const purchases = Math.floor(balance / choice.cost);
        if (purchases > 0) {
            console.log(`Бустер ${choice.level} уровня доступен. Можно купить ${purchases} штук. Продолжительность работы: ${purchases * 3} минут.`);
        } else {
            console.log(`Бустер ${choice.level} уровня не доступен. Недостаточно средств.`);
        }
    }

    console.log("Выберете бустер (1, 2, 3, 4): ");
    const answer = await ask('> ');
    const chosenIndex = parseInt(answer) - 1;

    if (isNaN(chosenIndex) || chosenIndex < 0 || chosenIndex >= choices.length) {
        console.log('Некорректный выбор.');
        return;
    }

    const chosenBooster = choices[chosenIndex];

    const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

    while (true) {
        const activeBooster = await checkActiveBooster(page);

        if (activeBooster) {
            console.log('Активный бустер отсутствует. Покупаем бустер...');

            await page.waitForSelector('a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]');
            await page.click('a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]');

            await page.waitForSelector(chosenBooster.link);
            await page.click(chosenBooster.link);

            await page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.gvlQbP');
            await page.click('.BlackButtonStyled-sc-155f8n4-0.gvlQbP');

            console.log(`Бустер ${chosenBooster.level} уровня успешно куплен.`);


            await sleep(3 * 60 * 1000 + 10 * 1000);
        } else {
            console.log('На данный момент активный бустер уже имеется. Повторная проверка через 3 минуты и 10 секунд.');
            await sleep(3 * 60 * 1000 + 10 * 1000);
        }
    }
}

async function checkActiveBooster(page) {
    const hasActiveBooster = !(await page.$('.ActiveBoosterWrapper-sc-13defe5-0.bkpUKH'));
    return hasActiveBooster;
}


async function ask(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        readline.question(question, answer => {
            resolve(answer);
            readline.close();
        });
    });
}

module.exports = chooseBooster;

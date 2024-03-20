const readline = require('readline');


async function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
            rl.close();
        });
    });
}

async function chooseBooster(page, boosterSelections) {


    const { choice, asked } = boosterSelections || { choice, asked };
    if (!asked) {
        const { balance, choices } = await getBalanceAndChoices(page);

        console.log("Выберете бустер (1, 2, 3, 4): ");
        const answer = await ask('> ');
        const chosenIndex = parseInt(answer) - 1;

        if (isNaN(chosenIndex) || chosenIndex < 0 || chosenIndex >= choices.length) {
            console.log('Некорректный выбор.');
            return null;
        }

        const chosenBooster = chosenIndex;
        return { booster: choices[chosenIndex], asked: true };
    } else {

        return { booster: choice, asked: true };
    }
}
async function getBalanceAndChoices(page) {

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

    return { balance, choices };
}

module.exports = chooseBooster;

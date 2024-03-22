const { openBrowser, openPage } = require('./historyManager');
const { clickPlayButton } = require('./clickHandler');
const autoDraw = require('./autoDraw');
const chooseBooster = require('./chooseBooster');
const { checkAndPurchaseBooster } = require('./boosterManager');


async function runSessions(numberOfSessions, boosterSelections) {
    if (numberOfSessions === 0) {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Сколько сессий вы хотите создать? ', async (numberOfSessions) => {
            numberOfSessions = parseInt(numberOfSessions);
            if (isNaN(numberOfSessions) || numberOfSessions <= 0) {
                console.error('Введите корректное число сессий.');
                rl.close();
                return;
            }
            rl.close();
        });
    }
    await openBrowser(numberOfSessions);

    const pages = [];
    for (let i = 0; i < numberOfSessions; i++) {
        const page = await openPage(i, 'https://web.telegram.org');
        pages.push({ id: i, page }); // Используем индекс в качестве идентификатора страницы
    }

    // "Play"
    for (const { page, id } of pages) {
        await clickPlayButton(page, id + 1);
    }

    const waitForButtonPromises = pages.map(({ page }) => {
        return page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.bXMZJW', { visible: true, timeout: 30000 })
            .then(() => {
                console.log('\x1b[32m%s\x1b[0m', 'Кнопка "Закрасить" отобразилась на странице.');
            })
            .catch(error => {
                console.error('Произошла ошибка при ожидании кнопки "Закрасить":', error);
            });
    });

    // Ждем завершения всех промиссов для ожидания появления кнопки "Закрасить"
    await Promise.all(waitForButtonPromises);

    const selectedBooster = {};
    for (const { page, id } of pages) {
        boosterSelections[id] = { booster: null, asked: false };
        const boosterSelection = boosterSelections[id];

        if (!boosterSelection.asked) {
            const { booster, asked } = await chooseBooster(page, boosterSelection, id);
            boosterSelections[id] = { booster, asked };
            selectedBooster[id] = booster;
        }
    }

    const delayBetweenIterations = 8000;

    let clickCounters = new Array(numberOfSessions).fill(0);

    setInterval(async () => {
        for (const { page, id } of pages) {
            const boosterSelection = boosterSelections[id];
            clickCounter = clickCounters[id];
            if ((boosterSelection.asked)) {
                clickCounter = await checkAndPurchaseBooster(page, boosterSelection.booster, clickCounter, id);
                clickCounters[id] = clickCounter;
            }

            clickCounter = await autoDraw(page, clickCounter);
            clickCounters[id] = clickCounter;
        }
    }, delayBetweenIterations);



}
async function main() {
    try {
        await runSessions(numberOfSessions, boosterSelections);
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Произошла ошибка:', error);
        console.log('Закрытие браузеров...');
        puppeteer.close();
        console.log('Повторный запуск с сохраненными данными...');
        await runSessions(numberOfSessions, boosterSelections);
    }
}

main().catch(error => {
    console.error('\x1b[31m%s\x1b[0m', 'Произошла ошибка:', error);

});


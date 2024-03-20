const { openBrowser, openPage } = require('./historyManager');
const { clickPlayButton } = require('./clickHandler');
const openIframeLink = require('./openLink');
const autoDraw = require('./autoDraw');
const chooseBooster = require('./chooseBooster');
const { checkAndPurchaseBooster } = require('./boosterManager');

async function main() {
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

        await openBrowser(numberOfSessions);

        const pages = [];
        for (let i = 0; i < numberOfSessions; i++) {
            const page = await openPage(i, 'https://web.telegram.org');
            pages.push({ id: i, page }); // Используем индекс в качестве идентификатора страницы
        }

        // "Play"
        const clickPlayPromises = pages.map(({ page, id }) => clickPlayButton(page, id + 1));
        await Promise.all(clickPlayPromises);

        const waitForButtonPromises = pages.map(({ page }) => {
            return page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.bXMZJW', { visible: true, timeout: 30000 })
                .then(() => {
                    console.log('Кнопка "Закрасить" отобразилась на странице.');
                })
                .catch(error => {
                    console.error('Произошла ошибка при ожидании кнопки "Закрасить":', error);
                });
        });

        // Ждем завершения всех промиссов для ожидания появления кнопки "Закрасить"
        await Promise.all(waitForButtonPromises);

        const boosterSelections = {};

        for (const { id } of pages) {
            boosterSelections[id] = { booster: null, asked: false };
        }

        const delayBetweenIterations = 8000; // 8 секунд между итерациями
        let selectedBooster[];
        setInterval(async () => {
            for (const { page, id } of pages) {
                const boosterSelection = boosterSelections[id];

                if (!boosterSelection.asked) {
                    const { booster, asked } = await chooseBooster(page, boosterSelection);
                    boosterSelections[id] = { booster, asked };
                    selectedBooster[id] = booster;
                }
                if (boosterSelection.asked) {
                    await checkAndPurchaseBooster(page, selectedBooster[id]);
                }
                await autoDraw(page);
            }
        }, delayBetweenIterations);

        rl.close();
    });
}

main().catch(error => {
    console.error('Произошла ошибка:', error);
});

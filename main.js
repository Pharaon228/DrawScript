const { openBrowser, openPage } = require('./historyManager');
const { clickPlayButton } = require('./clickHandler');
const openIframeLink = require('./openLink');
const autoDraw = require('./autoDraw');
const chooseBooster = require('./chooseBooster');

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
            pages.push(page);
        }

        // "Play"
        const clickPlayPromises = pages.map((page, index) => clickPlayButton(page, index + 1));
        await Promise.all(clickPlayPromises);

        const waitForButtonPromises = pages.map(page => {
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

        for (const page of pages) {
            //await openIframeLink(page);
            await autoDraw(page);
            await chooseBooster(page);
        }

        rl.close();
    });
}

main().catch(error => {
    console.error('Произошла ошибка:', error);
});
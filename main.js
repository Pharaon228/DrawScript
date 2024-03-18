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
            const page = await openPage(i, 'https://web.telegram.org/a/#5499493097');
            pages.push(page);
        }

        // "Play"
        for (const page of pages) {
            await clickPlayButton(page);
        }

        // Открываем ссылку из iframe
        for (const page of pages) {
            await openIframeLink(page);
            //await autoDraw(page);
            await chooseBooster(page);
        }

        rl.close();
    });
}

main().catch(error => {
    console.error('Произошла ошибка:', error);
});

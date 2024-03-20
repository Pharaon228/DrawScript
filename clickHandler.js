const fs = require('fs');
const readline = require('readline');

async function clickPlayButton(page, sessionIndex) {
    try {
        const srcValueFileName = `./user-data-dir${sessionIndex}/srcValue.txt`;

        // Ищем есть ли активный iframe
        if (fs.existsSync(srcValueFileName)) {
            const srcValue = fs.readFileSync(srcValueFileName, 'utf8');
            console.log(`srcValue найден в файле для сессии ${sessionIndex}.`);

            const pages = await page.browser().pages();
            for (const p of pages) {
                if (p !== page) {
                    await p.close();
                }
            }


            await page.evaluate(() => {
                window.alert = () => { };
                window.confirm = () => true;
                window.prompt = () => { };
            });

            await page.goto(srcValue);
        } else {
            console.log('Прошу запустите игру.');

            // Ждем появления iframe
            await page.waitForSelector('.zA1w1IOq');
            const srcValue = await page.$eval('.zA1w1IOq', iframe => iframe.src);

            // Сохраняем значение iframe scr
            fs.writeFileSync(srcValueFileName, srcValue, 'utf8');
            console.log(`srcValue для сессии ${sessionIndex} сохранен в файле: ${srcValueFileName}`);

            const pages = await page.browser().pages();
            for (const p of pages) {
                if (p !== page) {
                    await p.close();
                }
            }

            const answer = await ask('Хотите запустить AutoDraw Script? (да/нет): ');
            if (answer.toLowerCase() === 'да') {

                await page.evaluate(() => {
                    window.alert = () => { };
                    window.confirm = () => true;
                    window.prompt = () => { };
                });

                await page.goto(srcValue);
            }
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

async function ask(question) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

module.exports = {
    clickPlayButton
};

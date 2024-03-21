const fs = require('fs');

async function clickPlayButton(page, sessionIndex, attempt = 1) {
    try {
        const maxAttempts = 5;
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

            const selector = '.zA1w1IOq';
            const timeout = 1200000;

            // Ждем появления iframe
            await page.waitForSelector(selector, { timeout })
                .then(async () => {
                    const srcValue = await page.$eval(selector, iframe => iframe.src);
                    // Сохраняем значение iframe src
                    fs.writeFileSync(srcValueFileName, srcValue, 'utf8');
                    console.log(`srcValue для сессии ${sessionIndex} сохранен в файле: ${srcValueFileName}`);

                    const pages = await page.browser().pages();
                    for (const p of pages) {
                        if (p !== page) {
                            await p.close();
                        }
                    }

                    const answer = 'да';
                    if (answer.toLowerCase() === 'да') {
                        await page.evaluate(() => {
                            window.alert = () => { };
                            window.confirm = () => true;
                            window.prompt = () => { };
                        });
                        await page.goto(srcValue);
                    }
                })
                .catch(async (error) => {
                    console.error('Произошла ошибка при ожидании iframe:');
                    if (attempt < maxAttempts) {
                        console.log(`Повторная попытка (${attempt + 1}/${maxAttempts})...`);
                        await clickPlayButton(page, sessionIndex, attempt + 1);
                    } else {
                        console.error('Время на запуск приложения превышает 2 минуты.');
                        console.error('Пожалуйста, перезапустите страницу и запустите игру.');
                    }
                });
        }

    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

module.exports = {
    clickPlayButton
};
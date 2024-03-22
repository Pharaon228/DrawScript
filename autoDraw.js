const fs = require('fs');

async function autoDraw(page, clickCounter, clickFailedCounter) {
    try {
        const button = await page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.bXMZJW', { visible: true, timeout: 3000 });

        if (button) {
            await button.click();
            //console.log('Кнопка "Закрасить" нажата.');

            clickCounter++;
            clickFailedCounter = 0;
            //console.log(`Счетчик нажатий: ${clickCounter}`);
            return { clickCounter, clickFailedCounter };
        } else {
            console.log('Кнопка "Закрасить" не найдена.');
            return { clickCounter, clickFailedCounter };
        }
    } catch (error) {
        const htmlContent = await page.content();
        clickFailedCounter++;

        if (clickFailedCounter % 5 === 0) {
            console.error(`Произошло ${clickFailedCounter}неудачных попыток нажатия кнопки "Закрасить"`);
        }

        fs.writeFileSync('page_after_click.html', htmlContent, 'utf8');
        // console.error('Кнопка "Закрасить"пока не найдена. Ожидание');
        return { clickCounter, clickFailedCounter };
    }
}

module.exports = autoDraw;

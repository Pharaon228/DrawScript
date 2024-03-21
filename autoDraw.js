const fs = require('fs');

async function autoDraw(page, clickCounter) {
    try {
        const button = await page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.bXMZJW', { visible: true, timeout: 3000 });

        if (button) {
            await button.click();
            //console.log('Кнопка "Закрасить" нажата.');

            clickCounter++;
            //console.log(`Счетчик нажатий: ${clickCounter}`);
            return clickCounter;
        } else {
            console.log('Кнопка "Закрасить" не найдена.');
            return clickCounter;
        }
    } catch (error) {
        const htmlContent = await page.content();

        fs.writeFileSync('page_after_click.html', htmlContent, 'utf8');
        // console.error('Кнопка "Закрасить"пока не найдена. Ожидание');
        return clickCounter;
    }
}

module.exports = autoDraw;

const fs = require('fs');
async function autoDraw(page) {
    try {
        const button = await page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.bXMZJW', { visible: true, timeout: 3000 });

        if (button) {
            await button.click();
            console.log('Кнопка "Закрасить" нажата.');
            return true;
        } else {
            console.log('Кнопка "Закрасить" не найдена.');
            return false;
        }
    } catch (error) {
        const htmlContent = await page.content();

        // Записываем HTML-код в файл
        fs.writeFileSync('page_after_click.html', htmlContent, 'utf8');
        // console.error('Кнопка "Закрасить"пока не найдена. Ожидание');
        return false;
    }
}

module.exports = autoDraw;

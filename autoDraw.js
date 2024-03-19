async function autoDraw(page) {
    try {
        const button = await page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.bXMZJW', { visible: true });
        if (button) {
            await button.click();
            console.log('Кнопка "Закрасить" нажата.');
        } else {
            console.log('Кнопка "Закрасить" не найдена.');
        }
    } catch (error) {
        console.error('Произошла ошибка при попытке нажать кнопку "Закрасить":', error);
    } finally {
        setTimeout(() => autoDraw(page), 5000);
    }
}

module.exports = autoDraw;

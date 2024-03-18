async function autoDraw(page) {
    setInterval(async () => {
        try {
            await page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.bXMZJW');
            const button = await page.$('.BlackButtonStyled-sc-155f8n4-0.bXMZJW');
            if (button) {
                await button.click();
                console.log('Кнопка "Закрасить" нажата.');
            } else {
                console.log('Кнопка "Закрасить" не найдена.');
            }
        } catch (error) {
            console.error('Произошла ошибка при попытке нажать кнопку "Закрасить":', error);
        }
    }, 8000); // Нажатие кнопки каждые 8 секунд. Можно уменьшить секунды.
}

module.exports = autoDraw;

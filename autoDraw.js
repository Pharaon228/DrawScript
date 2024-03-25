async function autoDraw(page, clickCounter, clickFailedCounter) {
    try {
        const button = await page.waitForSelector('.BlackButtonStyled-sc-155f8n4-0.bXMZJW', { timeout: 5000 });
        if (button) {
            await button.click();
        }

        clickCounter++;
        clickFailedCounter = 0;

        return { clickCounter, clickFailedCounter };
    } catch (error) {
        clickFailedCounter++;
        if (clickFailedCounter % 5 === 0) {
            console.error(`Произошло ${clickFailedCounter}неудачных попыток нажатия кнопки "Закрасить"`);
        }
        return { clickCounter, clickFailedCounter };
    }

}

module.exports = autoDraw;

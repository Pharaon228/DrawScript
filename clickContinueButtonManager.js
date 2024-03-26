async function checkAndClickContinueButton(page, id) {
    const buttonSelector = ".BlackButtonStyled-sc-155f8n4-0.gvlQbP:not([disabled])";
    try {
        const button = await page.waitForSelector(buttonSelector, { timeout: 5000 });

        if (button) {
            await button.click();
            console.log(`Для сессии ${id + 1} нажата кнопка "Claim Reward"`);
        } else {
            console.log(`Для сессии ${id + 1} кнопка "Claim Reward" отсутствует.`);
        }
    } catch (error) {
        console.error(`Для сессии ${id + 1} кнопка "Claim Reward" отсутствует.`);
    }
}

module.exports = {
    checkAndClickContinueButton,
};

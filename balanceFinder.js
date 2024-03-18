async function findBalance(page, sessionIndex) {
    try {
        await page.waitForSelector('.AnimatedNumberStyled-sc-98h1so-0.kSpFWd');
        const balanceText = await page.$eval('.AnimatedNumberStyled-sc-98h1so-0.kSpFWd', span => span.textContent);
        const balance = parseInt(balanceText.replace(/\D/g, ''), 10);
        const currency = balanceText.replace(/\d/g, '').trim();

        console.log(`Сессия ${sessionIndex}: Баланс: ${balance} ${currency}`);
    } catch (error) {
        console.error(`Произошла ошибка в сессии ${sessionIndex} при поиске баланса:`, error);
    }
}

module.exports = {
    findBalance
};

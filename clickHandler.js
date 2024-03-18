async function clickPlayButton(page) {
    try {

        await page.waitForSelector('.Button.tiny.primary.has-ripple');


        await page.click('.Button.tiny.primary.has-ripple');

        console.log('Кнопка "Play" нажата.');
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

module.exports = {
    clickPlayButton
};
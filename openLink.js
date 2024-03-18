async function openIframeLink(page) {
    try {
        await page.waitForSelector('.zA1w1IOq');
        const srcValue = await page.$eval('.zA1w1IOq', iframe => iframe.src);

        await page.goto(srcValue);
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}


module.exports = openIframeLink;

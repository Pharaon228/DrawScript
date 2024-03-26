async function waitForButton(pages) {
    let failedLoad = 0;
    const waitForButtonPromises = pages.map(({ page }) => {
        return page
            .waitForSelector(".BlackButtonStyled-sc-155f8n4-0.bXMZJW", {
                visible: true,
                timeout: 40000,
            })
            .then(() => {
                console.log(
                    "\x1b[32m%s\x1b[0m",
                    'Кнопка "Закрасить" отобразилась на странице.'
                );
            })
            .catch((error) => {
                console.error('Произошла ошибка при ожидании кнопки "Закрасить":', error);
                failedLoad++;
            });
    });

    await Promise.all(waitForButtonPromises);

    return failedLoad;
}

module.exports = {
    waitForButton,
};

async function checkAndPurchaseBooster(
  page,
  chosenBooster,
  clickCounter,
  id,
  boosterCheck
) {
  //const hasActiveBooster = await checkActiveBooster(page);
  //console.log(boosterCheck);
  const balance = await getCurrentBalance(page);
  if (balance >= chosenBooster.cost && chosenBooster.level != "без бустера") {
    if (boosterCheck > 24 || boosterCheck === 0) {
      try {
        console.log(
          "\x1b[32m%s\x1b[0m",
          "Активный бустер отсутствует. Покупаем бустер..."
        );

        const shopButton = await page.waitForSelector(
          'a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]',
          { timeout: 5000 }
        );
        if (shopButton) {
          await page.click('a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]');
          await delay(1000);
        }
        const boosterLinkButton = await page.waitForSelector(
          chosenBooster.link,
          { timeout: 5000 }
        );
        if (boosterLinkButton) {
          await page.click(chosenBooster.link);
        }

        const confirmButton = await page.waitForSelector(
          ".BlackButtonStyled-sc-155f8n4-0.gvlQbP",
          { timeout: 5000 }
        );
        if (confirmButton) {
          await page.click(".BlackButtonStyled-sc-155f8n4-0.gvlQbP");
        }
        console.log(`Бустер ${chosenBooster.level} уровня успешно куплен.`);
        console.log(
          "\x1b[33m%s\x1b[0m",
          `Для сессии ${id + 1} Текущий баланс: ${balance}.`
        );
        console.log(
          `Для сессии ${
            id + 1
          } за время работы было совершено ${clickCounter} нажатий.`
        );
        return { boosterCheck: 1 };
      } catch (error) {
        console.error("Ошибка при покупке бустера:", error);
        return { boosterCheck };
      }
    }
  } else {
    if (clickCounter % 20 === 0 || boosterCheck === 0) {
      console.log(
        "\x1b[33m%s\x1b[0m",
        `Для сессии ${id + 1} Текущий баланс: ${balance}.`
      );
      console.log(
        `Для сессии ${id + 1} было совершено ${clickCounter} нажатий.`
      );
    }
    boosterCheck++;
    return { boosterCheck };
  }
  boosterCheck++;
  return { boosterCheck };
}

async function getCurrentBalance(page) {
  try {
    await page.waitForSelector(".AnimatedNumberStyled-sc-98h1so-0.kSpFWd", {
      timeout: 5000,
    });
    const balanceText = await page.$eval(
      ".AnimatedNumberStyled-sc-98h1so-0.kSpFWd",
      (span) => span.textContent
    );
    return parseInt(balanceText.replace(/\D/g, ""), 10);
  } catch {
    console.log(`Невозможно получить данные о текущем балансе`);
    return 0;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  checkAndPurchaseBooster,
};

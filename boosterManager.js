async function checkAndPurchaseBooster(
  page,
  chosenBooster,
  clickCounter,
  id,
  boosterCheck
) {
  const hasActiveBooster = await checkActiveBooster(page);

  const balance = await getCurrentBalance(page);
  //console.log(`Для сессии ${id+1} checkActiveBooster : ${hasActiveBooster}`);
  //console.log(`Для сессии ${id+1} balance : ${balance}`);

  if (
    balance >= chosenBooster.cost &&
    chosenBooster.level != "без бустера" &&
    hasActiveBooster
  ) {
    if (boosterCheck > 10 || boosterCheck === 0) {
      try {
        let boosterLinkButton = false;
        let confirmButton = false;
        let drawLink = false;
        let backButton = false;
        console.log(
          "\x1b[32m%s\x1b[0m",
          "Активный бустер отсутствует. Покупаем бустер..."
        );

        const shopButton = await waitForSelectorWithTimeout(
          page,
          'a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]',
          5000
        );
        if (shopButton) {
          await page.click('a.MenuItem-yi1zwm-1.AgRZi[href="/shop"]');
          await delay(1000);
        }
        if (shopButton) {
          boosterLinkButton = await waitForSelectorWithTimeout(
            page,
            chosenBooster.link,
            5000
          );
          if (boosterLinkButton) {
            await page.click(chosenBooster.link);
          } else {
            drawLink = await waitForSelectorWithTimeout(
              page,
              'a.MenuItem-yi1zwm-1.AgRZi[href="/squads/e4cdc738-17f5-498c-8900-d5c48d80b910/draw"]',
              5000
            );
            if (drawLink) {
              console.log(
                `Для сессии ${id + 1} не удалось открыть магазин. Возврат.`
              );
              await page.click(
                'a.MenuItem-yi1zwm-1.AgRZi[href="/squads/e4cdc738-17f5-498c-8900-d5c48d80b910/draw"]'
              );
            }
          }
        }
        if (boosterLinkButton && shopButton) {
          confirmButton = await waitForSelectorWithTimeout(
            page,
            ".BlackButtonStyled-sc-155f8n4-0.gvlQbP",
            5000
          );
          if (confirmButton) {
            await page.click(".BlackButtonStyled-sc-155f8n4-0.gvlQbP");
          } else {
            backButton = await waitForSelectorWithTimeout(
              page,
              ".BackButton-sc-14f29de-4.fzpFcm",
              5000
            );
            if (backButton) {
              await page.click(".BackButton-sc-14f29de-4.fzpFcm");
              console.log(
                `Для сессии ${id + 1} не удалось выбрать бустер. Возврат.`
              );
            }
          }
        }
        if (confirmButton && boosterLinkButton && shopButton) {
          console.log(`Бустер ${chosenBooster.level} уровня успешно куплен.`);
        }
        console.log(
          "\x1b[33m%s\x1b[0m",
          `Для сессии ${id + 1} Текущий баланс: ${balance}.`
        );
        console.log(
          `Для сессии ${
            id + 1
          } за время работы было совершено ${clickCounter} нажатий.`
        );
        if (confirmButton) {
          boosterCheck = 1;
        }
        return { boosterCheck };
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
    const balanceSelector = await waitForSelectorWithTimeout(
      page,
      ".AnimatedNumberStyled-sc-98h1so-0.kSpFWd",
      5000
    );
    if (balanceSelector) {
      const balanceText = await page.$eval(
        ".AnimatedNumberStyled-sc-98h1so-0.kSpFWd",
        (span) => span.textContent
      );
      return parseInt(balanceText.replace(/\D/g, ""), 10);
    } else {
      console.log(`Else Невозможно получить данные о текущем балансе`);
      return 0;
    }
  } catch {
    console.log(`Catch Невозможно получить данные о текущем балансе`);
    return 0;
  }
}

async function checkActiveBooster(page) {
  const hasActiveBooster = await waitForSelectorWithTimeout(
    page,
    ".ActiveBoosterWrapper-sc-13defe5-0.bkpUKH",
    2000
  );
  if (hasActiveBooster) {
    return false;
  } else {
    return true;
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForSelectorWithTimeout(page, selector, timeout = 5000) {
  const startTime = Date.now();
  try {
    const element = await page.waitForSelector(selector, { timeout });
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    console.log(`Элемент '${selector}' найден за ${elapsedTime} мс.`);
    return true;
  } catch (error) {
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    console.error(
      `Ошибка при поиске элемента '${selector}' за ${elapsedTime} мс:`
    );
    return false;
  }
}

module.exports = {
  checkAndPurchaseBooster,
};

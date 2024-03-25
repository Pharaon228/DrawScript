const { openBrowser, openPage, closeBrowsers } = require("./historyManager");
const { clickPlayButton } = require("./clickHandler");
const autoDraw = require("./autoDraw");
const chooseBooster = require("./chooseBooster");
const { checkAndPurchaseBooster } = require("./boosterManager");
const { error } = require("console");

async function runSessions(
  numberOfSessionsHost,
  boosterSelectionsHost,
  attemptsHost,
  firstBoosterSelections
) {
  numberOfSessions = numberOfSessionsHost;
  boosterSelections = boosterSelectionsHost;
  attempts = attemptsHost;
  try {
    //console.log(`Количество сессий: ${numberOfSessions}`);
    //логика получения количества сессий
    if (numberOfSessions === 0) {
      const readline = require("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      numberOfSessions = await new Promise((resolve, reject) => {
        rl.question(
          "Сколько сессий вы хотите создать? ",
          (numberOfSessions) => {
            numberOfSessions = parseInt(numberOfSessions);
            if (isNaN(numberOfSessions) || numberOfSessions <= 0) {
              console.error("Введите корректное число сессий.");
              rl.close();
              reject(new Error("Некорректное количество сессий"));
            } else {
              rl.close();
              resolve(numberOfSessions);
            }
          }
        );
      });
    }
    //логика открытия браузеров
    if (attempts === 0) {
      await openBrowser(numberOfSessions);
    }
    //логика открытия страниц
    const pages = [];

    for (let i = 0; i < numberOfSessions; i++) {
      const page = await openPage(i, "https://web.telegram.org");

      pages.push({ id: i, page });
    }
    // логика нажатия кнопки "Play"
    for (const { page, id } of pages) {
      await clickPlayButton(page, id + 1);
      page.on("dialog", async (dialog) => {
        console.log("Диалоговое окно обнаружено:", dialog.message());
        await dialog.accept();
      });
    }

    //логика ожидания появления кнопки "Закрасить"
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
          console.error('Произошла ошибка при ожидании кнопки "Закрасить":');
          failedLoad++;
        });
    });

    // Ждем завершения всех промиссов для ожидания появления кнопки "Закрасить"

    await Promise.all(waitForButtonPromises);

    if (failedLoad != 0) {
      console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка запуска:", error);
      console.log("Закрытие браузеров...");
      // await closeBrowsers(numberOfSessions);
      console.log("Повторный запуск с сохраненными данными...");

      await runSessions(
        numberOfSessions,
        boosterSelections,
        attempts + 1,
        firstBoosterSelections
      );
    }

    async function checkAndClickContinueButton(page, id) {
      const buttonSelector =
        ".BlackButtonStyled-sc-155f8n4-0.gvlQbP:not([disabled]";
      try {
        const button = await page.waitForSelector(buttonSelector, {
          timeout: 5000,
        });

        if (button) {
          await button.click();
          console.log(`для сессии ${id + 1} нажата кнопка "Clain Reward"`);
        } else {
          console.log("...");
        }
      } catch (error) {
        console.error(`для сессии ${id + 1} отсутствует кнопка "Clain Reward"`);
      }
    }
    for (const { page, id } of pages) {
      await checkAndClickContinueButton(page, id);
    }
    //логика выбора бустеров
    let askedFlag = true;
    if (boosterSelections === firstBoosterSelections) {
      askedFlag = false;
    }

    for (const { page, id } of pages) {
      if (attempts === 0 || !askedFlag) {
        boosterSelections[id] = { booster: null, asked: false };
      }
      const boosterSelection = boosterSelections[id];

      if (!boosterSelection.asked) {
        const { booster, asked } = await chooseBooster(
          page,
          boosterSelection,
          id
        );
        boosterSelections[id] = { booster, asked };
      }
    }
    let errorFlag = false;
    //логика автокликера
    function timeout(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, ms);
      });
    }
    const delayBetweenIterations = 5000;

    let clickCounters = new Array(numberOfSessions).fill(0);
    let clickFailedCounters = new Array(numberOfSessions).fill(0);
    let boosterChecks = new Array(numberOfSessions).fill(0);
    let countOfBoosters = new Array(numberOfSessions).fill(0);

    async function runIterations() {
      const promises = [];
      for (const { page, id } of pages) {
        //console.log(`Starting new itteration for session: ${id + 1}`);
        const promise1 = checkAndPurchaseBooster(
          page,
          boosterSelections[id].booster,
          clickCounters[id],
          id,
          boosterChecks[id],
          countOfBoosters[id]
        );
        promises.push(promise1);

        //console.log("Done checkAndPurchaseBooster for session:", id + 1);

        const promise2 = autoDraw(
          page,
          clickCounters[id],
          clickFailedCounters[id]
        );
        promises.push(promise2);
        //console.log("Done autoDraw for session:", id + 1);
      }

      try {
        const results = await Promise.race([
          Promise.all(promises),
          timeout(30000),
        ]);
        //console.log(results);
        if (results != true) {
          let index = 0;
          for (const { page, id } of pages) {
            if (boosterSelections[id].asked) {
              const { clickCounter, boosterCheck, countOfBooster } =
                results[index];
              clickCounters[id] = clickCounter;
              boosterChecks[id] = boosterCheck;
              index++;
            }

            const { clickCounter, clickFailedCounter } = results[index];
            index++;
            clickCounters[id] = clickCounter;
            clickFailedCounters[id] = clickFailedCounter;
            if (clickFailedCounters[id] > 6) {
              errorFlag = true;
            }
          }
          //console.log(`Промисы были разрешены`);
        } else {
          console.log(`Таймаут промисов`);
          if (errorFlag || results == true) {
            console.error(
              "\x1b[31m%s\x1b[0m",
              "Произошла ошибка нажатий:",
              error
            );
            console.log("Закрытие браузеров...");
            errorFlag = true;
            await runSessions(
              numberOfSessions,
              boosterSelections,
              attempts + 1
            );
          }
        }
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
      if (!errorFlag) {
        setTimeout(runIterations, delayBetweenIterations);
      }
    }

    runIterations();
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка:", error);
    console.log("Закрытие браузеров...");

    console.log("Повторный запуск с сохраненными данными...");
    await runSessions(
      numberOfSessions,
      boosterSelections,
      attempts + 1,
      firstBoosterSelections
    );
  }
}
async function main() {
  let numberOfSessionsHost = 0;
  let boosterSelectionsHost = {};
  let firstBoosterSelections = boosterSelectionsHost;
  let attemptsHost = 0;
  try {
    const { numberOfSessions, boosterSelections, attempts } = await runSessions(
      numberOfSessionsHost,
      boosterSelectionsHost,
      attemptsHost,
      firstBoosterSelections
    );
    numberOfSessionsHost = numberOfSessions;
    boosterSelectionsHost = boosterSelections;
    attemptsHost = attempts;
  } catch (error) {
    // console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка:", error);
  }
}

main().catch((error) => {
  console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка:", error);
});

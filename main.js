const { openBrowser, openPage, closeBrowsers } = require("./historyManager");
const { clickPlayButton } = require("./clickHandler");
const autoDraw = require("./autoDraw");
const chooseBooster = require("./chooseBooster");
const { checkAndPurchaseBooster } = require("./boosterManager");
const { error } = require("console");

async function runSessions(numberOfSessionsHost, boosterSelectionsHost, attemptsHost) {
  numberOfSessions = numberOfSessionsHost;
  boosterSelections = boosterSelectionsHost;
  attempts = attemptsHost;
  try {
    console.log(`Количество сессий: ${numberOfSessions}`);
    //логика получения количества сессий
    if (numberOfSessions === 0) {
      const readline = require("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      numberOfSessions = await new Promise((resolve, reject) => {
        rl.question("Сколько сессий вы хотите создать? ", (numberOfSessions) => {
          numberOfSessions = parseInt(numberOfSessions);
          if (isNaN(numberOfSessions) || numberOfSessions <= 0) {
            console.error("Введите корректное число сессий.");
            rl.close();
            reject(new Error("Некорректное количество сессий"));
          } else {
            rl.close();
            resolve(numberOfSessions);
          }
        });
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
      page.on('dialog', async dialog => {
        console.log('Диалоговое окно обнаружено:', dialog.message());
        await dialog.accept();
        const url = 'https://the-pixels.pages.dev/squads/e4cdc738-17f5-498c-8900-d5c48d80b910/draw'
        await page.goto(url);
        await delay(500);
      });
    }

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    //логика ожидания появления кнопки "Закрасить"
    let failedLoad = 0;
    const waitForButtonPromises = pages.map(({ page }) => {
      return page
        .waitForSelector(".BlackButtonStyled-sc-155f8n4-0.bXMZJW", {
          visible: true,
          timeout: 30000,
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

    if (failedLoad != -1) {
      console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка запуска:", error);
      console.log("Закрытие браузеров...");
      // await closeBrowsers(numberOfSessions);
      console.log("Повторный запуск с сохраненными данными...");

      await runSessions(numberOfSessions, boosterSelections, attempts + 1);
    }
    //логика выбора бустеров
    const selectedBooster = {};
    for (const { page, id } of pages) {
      boosterSelections[id] = { booster: null, asked: false };
      const boosterSelection = boosterSelections[id];

      if (!boosterSelection.asked) {
        const { booster, asked } = await chooseBooster(
          page,
          boosterSelection,
          id
        );
        boosterSelections[id] = { booster, asked };
        selectedBooster[id] = booster;
      }
    }
    //логика автокликера
    const delayBetweenIterations = 8000;

    let clickCounters = new Array(numberOfSessions).fill(0);
    let clickFailedCounters = new Array(numberOfSessions).fill(0);
    setInterval(async () => {
      for (const { page, id } of pages) {
        const boosterSelection = boosterSelections[id];

        if (boosterSelection.asked) {
          const clickCounter = await checkAndPurchaseBooster(
            page,
            boosterSelection.booster,
            clickCounters[id],
            id
          );
          clickCounters[id] = clickCounter;
        }

        const { clickCounter, clickFailedCounter } = await autoDraw(
          page,
          clickCounters[id],
          clickFailedCounters[id]
        );
        clickCounters[id] = clickCounter;
        clickFailedCounters[id] = clickFailedCounter;
        if (clickFailedCounters[id] > 6) {
          console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка нажатий:", error);
          console.log("Закрытие браузеров...");

          await runSessions(numberOfSessions, boosterSelections, attempts + 1);
        }
      }
    }, delayBetweenIterations);
  }
  catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка:", error);
    console.log("Закрытие браузеров...");

    console.log("Повторный запуск с сохраненными данными...");
    await runSessions(numberOfSessions, boosterSelections, attempts + 1);
  }
}
async function main() {
  let numberOfSessionsHost = 0;
  let boosterSelectionsHost = {};
  let attemptsHost = 0;
  try {
    const { numberOfSessions, boosterSelections, attempts } = await runSessions(numberOfSessionsHost, boosterSelectionsHost, attemptsHost);
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

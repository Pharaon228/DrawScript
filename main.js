const { openBrowser, openPage, closeBrowsers } = require("./historyManager");
const { clickPlayButton } = require("./clickHandler");
const autoDraw = require("./autoDraw");
const chooseBooster = require("./chooseBooster");
const { checkAndPurchaseBooster } = require("./boosterManager");
const { error } = require("console");
const { getNumberOfSessions } = require("./userInputManager");
const { waitForButton } = require("./waitForButtonManager");
const { checkAndClickContinueButton } = require("./clickContinueButtonManager");
const { manageBoosterSelections } = require("./boosterSelectionManager");

async function runSessions(
  numberOfSessionsHost,
  boosterSelectionsHost,
  attemptsHost,
  firstBoosterSelections
) {
  let numberOfSessions = numberOfSessionsHost;
  let boosterSelections = boosterSelectionsHost;
  let attempts = attemptsHost;
  try {

    //логика получения количества сессий
    if (numberOfSessions === 0) {
      try {
        numberOfSessions = await getNumberOfSessions();
      } catch (error) {
        console.error("Произошла ошибка:", error);
        return;
      }
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

    // Логика ожидания появления кнопки "Закрасить"
    let failedLoad = 0;
    try {
      failedLoad = await waitForButton(pages);
    } catch (error) {
      console.error("Произошла ошибка при ожидании кнопки:", error);
      return;
    }


    if (failedLoad != 0) {
      console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка запуска:", error);
      console.log("Закрытие браузеров...");
      console.log("Повторный запуск с сохраненными данными...");
      await runSessions(
        numberOfSessions,
        boosterSelections,
        attempts + 1,
        firstBoosterSelections
      );
    }

    //логика Claiming Reward
    for (const { page, id } of pages) {
      await checkAndClickContinueButton(page, id);
    }
    //логика выбора бустеров
    let askedFlag = true;
    if (boosterSelections === firstBoosterSelections) {
      askedFlag = false;
    }

    boosterSelections = await manageBoosterSelections(
      pages,
      boosterSelectionsHost,
      attemptsHost,
      firstBoosterSelections
    );


    //логика автокликера
    let errorFlag = 0;
    let attemptItterations = 0;
    const delayBetweenIterations = 5000;
    let clickCounters = new Array(numberOfSessions).fill(0);
    let clickFailedCounters = new Array(numberOfSessions).fill(0);
    let boosterChecks = new Array(numberOfSessions).fill(0);
    let countOfBoosters = new Array(numberOfSessions).fill(0);
    let promises = [];

    async function runIterations() {
      promises = [];
      for (const { page, id } of pages) {
        const promise1 = checkAndPurchaseBooster(page, boosterSelections[id].booster, clickCounters[id], id, boosterChecks[id], countOfBoosters[id]);
        promises.push(promise1);

        const promise2 = autoDraw(page, clickCounters[id], clickFailedCounters[id]);
        promises.push(promise2);
      }

      try {
        const results = await Promise.all(promises)
        console.log(results);
        if (results != true && errorFlag === 0) {
          let index = 0;
          for (const { page, id } of pages) {
            if (boosterSelections[id].asked) {
              const { clickCounter, boosterCheck, countOfBooster } = results[index];
              index++;
              clickCounters[id] = clickCounter;
              boosterChecks[id] = boosterCheck;
            }
            const { clickCounter, clickFailedCounter } = results[index];
            index++;
            clickCounters[id] = clickCounter;
            clickFailedCounters[id] = clickFailedCounter;
            if (clickFailedCounters[id] > 6) {
              errorFlag++;
            }
          }
          console.log(`Error flag: ${errorFlag}`);
        }
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
      if (errorFlag > 0) {
        attemptItterations++;
      }
      if (attemptItterations > 0) {
        console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка нажатий:", error);
        console.log("Закрытие браузеров...");
        errorFlag++;
        await runSessions(numberOfSessions, boosterSelections, attempts + 1);
      }
      else { setTimeout(runIterations, delayBetweenIterations); }
    }

    runIterations();
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка:", error);
    console.log("Закрытие браузеров...");
    console.log("Повторный запуск с сохраненными данными...");
    await runSessions(numberOfSessions, boosterSelections, attempts + 1, firstBoosterSelections);
  }
}
async function main() {
  let numberOfSessionsHost = 0;
  let boosterSelectionsHost = {};
  let firstBoosterSelections = boosterSelectionsHost;
  let attemptsHost = 0;
  try {
    const { numberOfSessions, boosterSelections, attempts } = await runSessions(numberOfSessionsHost, boosterSelectionsHost, attemptsHost, firstBoosterSelections);
    numberOfSessionsHost = numberOfSessions;
    boosterSelectionsHost = boostesrSelections;
    attemptsHost = attempts;
  } catch (error) {
    // console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка:", error);
  }
}

main().catch((error) => {
  console.error("\x1b[31m%s\x1b[0m", "Произошла ошибка:", error);
});

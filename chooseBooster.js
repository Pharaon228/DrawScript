const readline = require("readline");

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

async function chooseBooster(page, boosterSelections, id) {
  const { choice, asked } = boosterSelections || { choice, asked };
  if (!asked) {
    const { balance, choices } = await getBalanceAndChoices(page, id);

    console.log(
      "Выберете бустер (0-без бустера, 1-первого уровная, 2-второго уровня, 3-третьего уровня, 4-четвёртого уровня): "
    );
    const answer = await ask("> ");
    const chosenIndex = parseInt(answer);

    if (
      isNaN(chosenIndex) ||
      chosenIndex < 0 ||
      chosenIndex >= choices.length
    ) {
      console.log("Некорректный выбор.");
      return null;
    }

    return { booster: choices[chosenIndex], asked: true };
  } else {
    return { booster: choice, asked: true };
  }
}
async function getBalanceAndChoices(page, id) {
  await page.waitForSelector(".AnimatedNumberStyled-sc-98h1so-0.kSpFWd");
  const balanceText = await page.$eval(
    ".AnimatedNumberStyled-sc-98h1so-0.kSpFWd",
    (span) => span.textContent
  );
  const balance = parseInt(balanceText.replace(/\D/g, ""), 10);

  const choices = [
    { level: "без бустера", cost: 0, link: "" },
    {
      level: "первого",
      cost: 1000,
      link: 'a.ShopItemStyled-xpqzty-0.dJGOTi[href="/shop/0"]',
    },
    {
      level: "второго",
      cost: 3000,
      link: 'a.ShopItemStyled-xpqzty-0.gxHYVM[href="/shop/1"]',
    },
    {
      level: "третьего",
      cost: 10000,
      link: 'a.ShopItemStyled-xpqzty-0.iXVjKg[href="/shop/2"]',
    },
    {
      level: "четвёртого",
      cost: 20000,
      link: 'a.ShopItemStyled-xpqzty-0.fhYEXS[href="/shop/3"]',
    },
  ];

  for (const choice of choices) {
    const purchases = Math.floor(balance / choice.cost);
    if (purchases > 0 && choice.level != "без бустера") {
      console.log(
        `Для ${id + 1} сессии Бустер ${
          choice.level
        } уровня доступен. Можно купить ${purchases} штук. Продолжительность работы: ${
          purchases * 3
        } минут.`
      );
    } else if (choice.level != "без бустера") {
      console.log(
        `Для ${id + 1} сессии Бустер ${
          choice.level
        }сессии уровня не доступен. Недостаточно средств.`
      );
    }
  }

  return { balance, choices };
}

module.exports = chooseBooster;

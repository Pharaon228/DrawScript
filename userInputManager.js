const readline = require("readline");

async function getUserInput(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve, reject) => {
        rl.question(question, (input) => {
            rl.close();
            resolve(input);
        });
    });
}

async function getNumberOfSessions() {
    let numberOfSessions = await getUserInput("Сколько сессий вы хотите создать? ");
    numberOfSessions = parseInt(numberOfSessions);

    if (isNaN(numberOfSessions) || numberOfSessions <= 0) {
        throw new Error("Некорректное количество сессий");
    }

    return numberOfSessions;
}

module.exports = {
    getNumberOfSessions,
};

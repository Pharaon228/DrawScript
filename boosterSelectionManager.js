const chooseBooster = require("./chooseBooster");

async function manageBoosterSelections(pages, boosterSelections, attempts, firstBoosterSelections) {
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

    return boosterSelections;
}

module.exports = {
    manageBoosterSelections,
};

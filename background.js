import {RandomPersonDataManager} from "./managers/randomDataManager.js";
import {fillDataAK} from "./scripts/dataFillerAK.js";

let randomPersonDataManager = new RandomPersonDataManager();

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "PASS_COUNT_AK") {
        console.log("BACKGROUND получил:", message.data);
        // Генерируем нужное кол-во данных на пассажиров
        let randomData = {}
        if (message.data['adtCount'] >= 1) {
            randomData["adt"] = await randomPersonDataManager.getRandomPersonADT(message.data['adtCount']);
        }
        if (message.data['chdCount'] >= 1) {
            randomData["chd"] = await randomPersonDataManager.getRandomPersonCHD(message.data['chdCount']);
        }
        if (message.data['infCount'] >= 1) {
            randomData["inf"] = await randomPersonDataManager.getRandomPersonINF(message.data['infCount']);
        }
        console.log([randomData]);

        // отправляем скрипт на страницу
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: fillDataAK,
            args: [randomData]
        });
    }
    return true;
});


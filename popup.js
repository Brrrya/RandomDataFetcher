import {RandomPersonDataManager} from "./managers/randomDataManager.js";
import {primaryDataFetcher} from "./scripts/primaryDataFetcher.js";

let randomPersonManager = new RandomPersonDataManager()

document.getElementById("input").onclick = async function () {await clickFillData()}

async function clickFillData(){
    // let personData = await randomPersonManager.getRandomPersonADT()
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // chrome.scripting.executeScript({
    //     target: { tabId: tab.id },
    //     func: fillData,
    //     args: [personData]
    // });
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: primaryDataFetcher
    });
    console.log("End")
}

function fillData(data){
    // Находим нужные элементы
    let lastNameInput = document.querySelectorAll('input[data-id="avia.booking.passenger_last-name-native_input"]')
    let firstNameInput = document.querySelectorAll('input[data-id="avia.booking.passenger_first-name-native_input"]')
    let middleNameInput = document.querySelectorAll('input[data-id="avia.booking.passenger_middle-name-native_input"]')
    let birthDayInput = document.querySelectorAll('input[data-id="avia.booking.passenger_birthday-native_input"]')
    let docNumberInput = document.querySelectorAll('input[data-id="avia.booking.passenger_document-number-native_input"]')
    // let genderSelect = document.querySelectorAll('input[data-id="avia.booking.passenger_gender-input-native_input"]')

    // Вводим в них данные
    lastNameInput.forEach((input, index) => {
        input.value = data[index].lastName;

        // триггерим события, чтобы сайт «увидел» изменения
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    })
    firstNameInput.forEach((input, index) => {
        input.value = data[index].firstName;

        // триггерим события, чтобы сайт «увидел» изменения
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    })
    middleNameInput.forEach((input, index) => {
        input.value = data[index].middleName;

        // триггерим события, чтобы сайт «увидел» изменения
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    })
    birthDayInput.forEach((input, index) => {
        input.value = data[index].birthDay;

        // триггерим события, чтобы сайт «увидел» изменения
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    })
    docNumberInput.forEach((input, index) => {
        input.value = data[index].passportNum;

        // триггерим события, чтобы сайт «увидел» изменения
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    })
    // genderSelect.forEach((select, index) => {
    //
    // });
    console.log("End")
}
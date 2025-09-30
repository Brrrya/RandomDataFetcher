export function fillDataAK(data){
    // Находим блоки
    const passengerBlocksExt = document.querySelectorAll('div[data-id="avia.booking.passenger"]');

    let passCounter = {
        "adt": 0,
        "chd": 0,
        "inf": 0
    }

    passengerBlocksExt.forEach((el,iteration) => {
        if (el.querySelector('span[data-id="avia.booking.passenger-preview_category"]').textContent === "Взрослый"){
            fillBlock(el, "adt", iteration);
            passCounter["adt"] ++;
        }
        else if (el.querySelector('span[data-id="avia.booking.passenger-preview_category"]').textContent === "Ребёнок"){
            fillBlock(el, "chd", iteration);
            passCounter["chd"] ++;
        }
        else if (el.querySelector('span[data-id="avia.booking.passenger-preview_category"]').textContent === "Младенец"){
            fillBlock(el, "inf", iteration);
            passCounter["inf"] ++;
        }
    });


    function fillBlock(element, passCategory, iteration){
        //find all elements
        let lastNameInput = element.querySelector('input[data-id="avia.booking.passenger_last-name-native_input"]');
        let firstNameInput = element.querySelector('input[data-id="avia.booking.passenger_first-name-native_input"]');
        let middleNameInput = element.querySelector('input[data-id="avia.booking.passenger_middle-name-native_input"]');
        let birthDayInput = element.querySelector('input[data-id="avia.booking.passenger_birthday-native_input"]');
        let docNumberInput = element.querySelector('input[data-id="avia.booking.passenger_document-number-native_input"]');
        setGenderByText(data[passCategory][passCounter[passCategory]].genderCodeText, iteration, element);

        lastNameInput.value = data[passCategory][passCounter[passCategory]].lastName;
        lastNameInput.dispatchEvent(new Event("input", { bubbles: true }));

        firstNameInput.value = data[passCategory][passCounter[passCategory]].firstName;
        firstNameInput.dispatchEvent(new Event("input", { bubbles: true }));

        middleNameInput.value = data[passCategory][passCounter[passCategory]].middleName;
        middleNameInput.dispatchEvent(new Event("input", { bubbles: true }));

        birthDayInput.value = data[passCategory][passCounter[passCategory]].birthDay;
        birthDayInput.dispatchEvent(new Event("input", { bubbles: true }));

        docNumberInput.value = data[passCategory][passCounter[passCategory]].documentNumber;
        docNumberInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    console.log("Executed data by Random Data Fetcher")
    console.log(data)


    const options = document.querySelectorAll(
        '[data-id="avia.booking.passenger_gender.option"]'
    );
    for (const opt of options) {
        if (opt.textContent.trim() === "Мужской") {
            opt.click(); // выбираем нужный
            return;
        }
    }

    // Дрочь с гендером спасибо чат гпт --------------------
    function simulateClick(el) {
        ["mousedown", "mouseup", "click"].forEach(type => {
            el.dispatchEvent(
                new MouseEvent(type, { view: window, bubbles: true, cancelable: true })
            );
        });
    }

    function waitForElement(selector, index, root = document.body) {
        return new Promise(resolve => {
            const el = document.querySelectorAll(selector)[index];

            if (el) return resolve(el);

            const observer = new MutationObserver(() => {
                const el = document.querySelectorAll(selector)[index];
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(root, { childList: true, subtree: true });
        });
    }

    async function setGenderByText(text, index, element) {
        // 1. открываем меню
        const input = element.querySelector(
            'input[data-id="avia.booking.passenger_gender-input-native_input"]'
        );
        simulateClick(input);

        // 2. ждём пока появятся опции
        await waitForElement('[data-id="avia.booking.passenger_gender.option"]', ((index+1)*3)-1);

        // 3. выбираем нужный вариант
        const allOptions = [...document.querySelectorAll(
            '[data-id="avia.booking.passenger_gender.option"]'
        )];
        const options = allOptions.slice(index*3, index*3 + 3); // от index*3 до index*3+2 включительно

        for (const opt of options) {
            if (opt.textContent.trim() === text) {
                simulateClick(opt);
                break;
            }
        }
        // 4. закрываем меню (если нужно)
        simulateClick(input);
    }
    // Конец дрочи с гендером -----------------------------------------------

}
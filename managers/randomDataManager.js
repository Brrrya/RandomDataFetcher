export class RandomPersonDataManager {
    #max_years_interval;
    #min_years_interval;

    constructor(
        max_years_interval = 31,
        min_years_interval = 2
    ) {
        this.url = "https://api.randomdatatools.ru/?typeName=classic ";
        this.#max_years_interval = max_years_interval;
        this.#min_years_interval = min_years_interval;
    }

    async #getRandomPerson(personCount = 1) {
        if (personCount < 1) {
            console.error("No person count found.");
            return;
        }

        try {
            let response = await fetch(this.url + "&count=" + personCount);

            if (!response.ok) {
                console.error("Could not get random data:", response.status);
                return;
            }

            let randomData = await response.json();

            // если 1 человек, упакуем в массив
            if (personCount === 1) {
                randomData = [randomData];
            }

            return randomData;

        } catch (err) {
            console.error("Ошибка при запросе:", err);
        }
    }

    async getRandomPersonADT(personCount = 1, minYearsOld = 18, maxYearsOld = 61) {
        const randomPerson = await this.#getRandomPerson(personCount)

        let personArray = []

        randomPerson.forEach((person, iteration) => {

            // Вычесления для паспорта
            const year = String(new Date().getFullYear());
            const randomDifferenceYear = String(year - this.#getRandomInt(this.#min_years_interval, this.#max_years_interval)).slice(2);

            // Вычесления для гендера
            let genderData = this.#getGenderCode(person.GenderCode)

            // Вычесления для ДР
            const birthDay = this.#generateRandomBirthDay(maxYearsOld, minYearsOld);
            // Спасибо чат гпт за строку ниже
            const birthDayRes = `${birthDay.getDate().toString().padStart(2, '0')}.${(birthDay.getMonth()+1).toString().padStart(2,'0')}.${birthDay.getFullYear()}`;

            personArray.push(
                {
                    id: iteration,
                    firstName: person.FirstName,
                    lastName: person.LastName,
                    middleName: person.FatherName,
                    documentNumber: person.PasportSerial.slice(0, 2) + randomDifferenceYear + person.PasportNumber,
                    // Тут идет генерация серии паспорта как 2 числа из рандомайзера + 2 числа текущий год - рандомное
                    // число от this.#min_years_interval тире this.#max_years_interval
                    // + номер паспорта из рандомайзера
                    birthDay: birthDayRes,
                    genderCode: genderData["genderCode"],
                    genderCodeText: genderData["genderCodeText"]
                }
            );
        })
        return personArray; // Возвращаем массив объектов с данными
    }

    async getRandomPersonCHD(personCount = 1, minYearsOld = 3, maxYearsOld = 11){
        let personsCHD = await this.getRandomPersonADT(personCount, minYearsOld, maxYearsOld);

        personsCHD.forEach((person) => {
            let docNumberCHD = ""

            let firstLetters = "IVX".split("");
            firstLetters = firstLetters.sort(() => 0.5 - Math.random());
            docNumberCHD += firstLetters[0] + firstLetters[1];

            let secondLetters = "АБВГДЕЗИКЛМНОПРСТУФХЧШЭЮЯ".split("");
            secondLetters = secondLetters.sort(() => 0.5 - Math.random());
            docNumberCHD += secondLetters[0] + secondLetters[1];

            docNumberCHD += String(this.#getRandomInt(111111, 1000000));

            person.documentNumber = docNumberCHD;
        })
        return personsCHD;
    }

    async getRandomPersonINF(personCount = 1, minYearsOld = 1, maxYearsOld = 2){
        return await this.getRandomPersonCHD(personCount, minYearsOld, maxYearsOld);
    }

    #getGenderCode(generatedCode){
        let genderCode;
        let genderCodeText;
        if (generatedCode === "man"){
            genderCode = "M";
            genderCodeText = "Мужской";
        }
        else {
            genderCode = "F";
            genderCodeText = "Женский";
        }
        return {"genderCode": genderCode, "genderCodeText": genderCodeText};
    }

    #generateRandomBirthDay(maxYearsOld = 61, minYearsOld = 18) {
        // Генерим текущую дату минус minYearsOld и 1 месяц
        // Она нужна чтобы далее сделать случайную дату от неё до maxYearsOld
        let minDate = new Date();
        minDate.setMonth(minDate.getMonth() - 1); // чтобы наверочку не в притык
        minDate.setFullYear(minDate.getFullYear() - minYearsOld);
        let maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() - 1); // чтобы наверочку не в притык
        maxDate.setFullYear(maxDate.getFullYear() - maxYearsOld);

        // время в миллисекундах
        const minTime = minDate.getTime();
        const maxTime = maxDate.getTime();

        const randomTime = minTime + Math.random() * (maxTime - minTime);

        return new Date(randomTime);
    }

    #getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // Максимум не включается, минимум включается
    }

}
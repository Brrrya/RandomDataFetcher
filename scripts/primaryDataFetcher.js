export async function primaryDataFetcher() {
    const passengerBlocksExt = document.querySelectorAll('div[data-id="avia.booking.passenger"]')


    let responseDataExt = {
        "adtCount": 0,
        "chdCount": 0,
        "infCount": 0,
    }

    passengerBlocksExt.forEach(block => {
        const passCategory = block.querySelector('span[data-id="avia.booking.passenger-preview_category"]').textContent;
        switch (passCategory){
            case 'Взрослый':
                responseDataExt["adtCount"]++;
                break;
            case 'Ребёнок':
                responseDataExt["chdCount"]++;
                break;
            case 'Младенец':
                responseDataExt["infCount"]++;
        }
    })
    chrome.runtime.sendMessage({
        type: "PASS_COUNT_AK",
        data: responseDataExt
    })
}
(`https://exchangerate.host/#/#docs`)

let ist = 'RUB'
let target = 'USD'
let rate 
let rateRev

//красит каждую кнопки в другой цвет по клику, не переключается
let currancyBtns = document.querySelectorAll('button.currancy-name')
currancyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        btn.style.background = ('#833AE0')
        btn.style.color = ('#FFFFFF')
        if (btn.classList.contains('left')) {
            ist = btn.innerText
        } else {
            target = btn.innerText
        }
        reactToCurrencyPairChange()
    })
})



// let currancySelects = document.querySelectorAll('select.currancy-name')
// currancySelects.forEach((sel) => {
//     sel.addEventListener('click', () => {
//         sel.style.background = ('#833AE0')
//         sel.style.color = ('#FFFFFF')
//         if (sel.classList.contains('left')) {
//             ist = sel.innerText
//         } else {
//             target = sel.innerText
//         }
//         // reactToCurrencyPairChange()
//     })
// })

//подключает список валют к кнопке
const getAvailableCurrencies = async() => {
    const response = await fetch('https://api.exchangerate.host/symbols')
    const data = await response.json()
    return Object.keys(data.symbols)
}
getAvailableCurrencies()
.then((listOfcurrencues) => {
    const selectLeft = document.querySelector('#select-left')
    const selectRight = document.querySelector('#select-right')
    listOfcurrencues.forEach((currencies) => {
        const option = document.createElement('option')
        option.value = currencies
        option.innerText = currencies
        selectLeft.append(option)
        selectRight.append(option.cloneNode(true))
    })
})


const getRatesForBothDirections = async() => {
    const responseDirect =  await fetch(`https://api.exchangerate.host/latest?base=${ist}&symbols=${target}`)
    const dataDirect = await responseDirect.json()

    const responseRev =  await fetch(`https://api.exchangerate.host/latest?base=${target}&symbols=${ist}`)
    const dataRev = await responseRev.json()
   
    return [dataDirect.rates[target], dataRev.rates[ist]]
}

function reactToCurrencyPairChange() {
    console.log('Act with following pair: ', ist, target)
    getRatesForBothDirections()
    .then((rates) => {
        console.log(rates)
        rate = rates[0]
        rateRev = rates[1]
        let textPLeft = document.querySelector('.actual-value-left')
        textPLeft.innerText = `1 ${ist} = ${rate} ${target}`
        let textPRight = document.querySelector('.actual-value-right')
        textPRight.innerText = `1 ${target} = ${rateRev} ${ist}`                                                                     
        let leftInput = document.querySelector('input.left') 
        leftInput.innerText = ''
    })
}

reactToCurrencyPairChange()
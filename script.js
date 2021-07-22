(`https://exchangerate.host/#/#docs`)

//красит каждую кнопки в другой цвет по клику, не переключается
let currancyBtns = document.querySelectorAll('.currancy-name')
currancyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        btn.style.background = ('#833AE0')
        btn.style.color = ('#FFFFFF')
})
})

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






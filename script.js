let myFavCur = ['RUB','USD', 'EUR', 'GBP']

let source = 'RUB'
let target = 'USD'

let rate;
let rateRev;

let leftBtns = document.querySelectorAll('button.currancy-name.left');
let rightBtns = document.querySelectorAll('button.currancy-name.right');

let leftInput = document.querySelector('.digits-left');
let rightInput = document.querySelector('.digits-right');

const showLoading = () => {
    let shouldShowLoader = true
    let loadingDiv
    setTimeout(() => {
        if(!shouldShowLoader) {
            return;
        }
        loadingDiv = document.createElement('div');
        loadingDiv.classList.add('loading-div')
      
        let loadingP = document.createElement('p');
        loadingP.classList.add('loading-p');
        loadingP.innerText = `Loading...`;

        loadingDiv.append(loadingP)
        document.querySelector('body').append(loadingDiv)
    }, 500)

    const hideLoading = () => {
        shouldShowLoader = false
        if (loadingDiv) {
            loadingDiv.remove()
        }
    }

    return hideLoading
}

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
        if (myFavCur.indexOf(currencies) !== -1) {
            return
        }
        const option = document.createElement('option')
        option.value = currencies
        option.innerText = currencies
        selectLeft.append(option)
        selectRight.append(option.cloneNode(true))
    })
})

const getRatesForBothDirections = async() => {
    const responseDirect =  await fetch(`https://api.exchangerate.host/latest?base=${source}&symbols=${target}`)
    const dataDirect = await responseDirect.json()

    const responseRev =  await fetch(`https://api.exchangerate.host/latest?base=${target}&symbols=${source}`)
    const dataRev = await responseRev.json()
   
    return [dataDirect.rates[target], dataRev.rates[source]]
}

leftBtns.forEach((bt) => {
    bt.addEventListener('click', () => {
        source = bt.innerText
        reactToCurrencyPairChange()
    })
})

rightBtns.forEach((bt) => {
    bt.addEventListener('click', () => {
        target = bt.innerText
        reactToCurrencyPairChange()
    })
})

let selLeft = document.querySelector('#select-left')
let selRight = document.querySelector('#select-right')

selLeft.addEventListener('change', ()=> {
    source = Number(selLeft.value)
    reactToCurrencyPairChange()
})
selRight.addEventListener('change', ()=> {
    target = Number(selRight.value)
    reactToCurrencyPairChange()
})

function reactToCurrencyPairChange() {
    const leftActive = document.querySelector('.left.active')
    const rightActive = document.querySelector('.right.active')

    if (leftActive) {
        leftActive.classList.remove('active');
    }

    if (rightActive) {
        rightActive.classList.remove('active');
    }

    const newLeftActiveButton = document.querySelector(`#left-${source}`)
    const newRightActiveButton = document.querySelector(`#right-${target}`)

    if (newLeftActiveButton) {
        newLeftActiveButton.classList.add('active')
    } else {
        selLeft.classList.add('active')
    }

    if (newRightActiveButton) {
        newRightActiveButton.classList.add('active')
    } else {
        selRight.classList.add('active')
    }

    const hideLoading = showLoading()

    getRatesForBothDirections()
    .then((rates) => {
        rate = rates[0]
        rateRev = rates[1]
        let textPLeft = document.querySelector('.actual-value-left')
        textPLeft.innerText = `1 ${source} = ${rate} ${target}`
        let textPRight = document.querySelector('.actual-value-right')
        textPRight.innerText = `1 ${target} = ${rateRev} ${source}`                                                                     
        rightInput.value = (leftInput.value*rate).toFixed(6)

        hideLoading()
    })
}

reactToCurrencyPairChange() 

function inputChanges () {
    rightInput.value = (leftInput.value*rate).toFixed(6)
}

leftInput.addEventListener('input', () => {
    inputChanges()
})

function inputChangesRight () {
    leftInput.value = (rightInput.value*rateRev).toFixed(6)
}

rightInput.addEventListener('input', () => {
    inputChangesRight()
})

const changeBtn = document.querySelector('.change-button-functional')
changeBtn.addEventListener('click', () => {
    let swap = source;
    source = target;
    target = swap;
    reactToCurrencyPairChange()
})
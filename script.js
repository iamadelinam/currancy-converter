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
        // loadingDiv.style.position = 'fixed'
        // loadingDiv.style.top = '0';
        // loadingDiv.style.bottom = '0';
        // loadingDiv.style.left ='0';
        // loadingDiv.style.right = '0';
        // loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.44)';
        // loadingDiv.style.display = 'flex';
        // loadingDiv.style.alignItems = 'center';
        // loadingDiv.style.justifyContent = 'center';
        let loadingP = document.createElement('p');
        loadingP.classList.add('loading-p');
        loadingP.innerText = `Loading...`;
        // loadingP.style.backgroundColor = '#FFFFFF';
        // loadingP.style.display = 'flex';
        // loadingP.style.alignItems = 'center';
        // loadingP.style.justifyContent = 'center';
        // loadingP.style.borderRadius = "3px";
        // loadingP.style.width = '129px';
        // loadingP.style.height = '54px';
        // loadingP.style.top = '272px';
        // loadingP.style.left ='509px';
        // loadingP.style.fontSize = '24px';
        // loadingP.style.lineHeight = '28px';
        document.querySelector('body').append(loadingDiv)
        loadingDiv.append(loadingP)
    }, 500)

    const hideLoading = () => {
        shouldShowLoader = false
        if (loadingDiv) {
            loadingDiv.remove()
        }
    }

    return hideLoading
}

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
        bt.style.background = ('black')
        bt.style.color = ('green')
        source = bt.innerText
        reactToCurrencyPairChange()
    })
})

rightBtns.forEach((bt) => {
    bt.addEventListener('click', () => {
        bt.style.background = ('yellow')
        bt.style.color = ('red')
        target = bt.innerText
        reactToCurrencyPairChange()
    })
})

let selLeft = document.querySelectorAll('#select-left')
let selRight = document.querySelectorAll('#select-right')

selLeft.forEach((sel) => {
    sel.addEventListener('change', ()=> {
        sel.style.background = ('orange')
        sel.style.color = ('purple')
        source = sel.value
        reactToCurrencyPairChange()
    })
})
selRight.forEach((sel) => {
    sel.addEventListener('change', ()=> {
        sel.style.background = ('orange')
        sel.style.color = ('purple')
        target = sel.value
        reactToCurrencyPairChange()
    })
})



function reactToCurrencyPairChange() {
    const hideLoading = showLoading()

    getRatesForBothDirections()
    .then((rates) => {
        rate = rates[0]
        rateRev = rates[1]
        let textPLeft = document.querySelector('.actual-value-left')
        textPLeft.innerText = `1 ${source} = ${rate} ${target}`
        let textPRight = document.querySelector('.actual-value-right')
        textPRight.innerText = `1 ${target} = ${rateRev} ${source}`                                                                     
        rightInput.value = leftInput.value*rate
        // leftInput.value = rightInput.value*rates[1]

        hideLoading()
    })
    
}

reactToCurrencyPairChange()

function inputChanges () {
    rightInput.value = leftInput.value*rate
}

leftInput.addEventListener('input', () => {
    inputChanges()
})

function inputChangesRight () {
    leftInput.value = rightInput.value*rateRev
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

var invocation = new XMLHttpRequest();
var selectCurrency1 = document.getElementById("selectCurrency1");
var selectCurrency2 = document.getElementById("selectCurrency2");
var currencyValue = document.getElementById("currencyValue");
var convertResult = document.getElementById("convertResult");
var exactlyResult = document.getElementById("exactlyResult");
var currencyA;
var currencyB;
var transationValue;

doRequest();

function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = formatDate(date.getMonth() + 1);
    var day = formatDate(date.getDate());
    return (year + "-" + month + "-" + day);
}

//transaction calc
async function requestCurrencyData(base, rate, value) {
    var date = getCurrentDate();
    $.ajax({
        url: "https://api.exchangeratesapi.io/latest",
        data: {
            "rates": {},
            "base": base,
            "date": date
        },
        method: 'GET',
        dataType: "json"
    }).then(function (data) {
        var jsonPack = data;
        var result = parseFloat(value) * parseFloat(jsonPack.rates[rate]);
        Cresult = result.toFixed(2);
        convertResult.innerText = ("= " + Cresult);
        exactlyResult.innerText = ("Exactly = " + result);
    });
}

//Get firsts information of available currencies
async function doRequest() {
    $.ajax({
        url: "https://api.exchangeratesapi.io/latest",
        data: {
            "rates": {},
            "base": "USD",
        },
        method: 'GET',
        dataType: "json"
    }).then(function (data) {
        feedOptions(data);
    });
}

//Create currencies options
function feedOptions(data) {
    var index;
    for (index in data.rates) {
        $(selectCurrency1).append(`<option value="${index}">${index}</option>`);
        $(selectCurrency2).append(`<option value="${index}">${index}</option>`);
    }
}

async function calculate() {
    currencyA = selectCurrency1.value;
    currencyB = selectCurrency2.value;
    transationValue = currencyValue.value;

    requestCurrencyData(currencyA, currencyB, transationValue);
}

function formatDate(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

function switchCurrency() {
    selectCurrency1 = document.getElementById("selectCurrency1");
    selectCurrency2 = document.getElementById("selectCurrency2");
    var aux = selectCurrency1.value;
    selectCurrency1.value = selectCurrency2.value;
    selectCurrency2.value = aux;
}

//function getValue(data) {
//    valorReal = data.rates["BRL"];
//    var index = 0;
//    var arrayM = [];
//    for (index in data.rates) {
//        arrayM.push(index);
//    }
//    console.log(valorReal + " " + arrayM);
//}
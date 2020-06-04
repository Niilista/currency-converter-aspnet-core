var invocation = new XMLHttpRequest();
var selectCurrency1 = document.getElementById("selectCurrency1");
var selectCurrency2 = document.getElementById("selectCurrency2");
var currencyValue = document.getElementById("currencyValue");
var convertResult = document.getElementById("convertResult");
var exactlyResult = document.getElementById("exactlyResult");
var currencyA;
var currencyB;
var transationValue;
var o1 = document.getElementById("o1");
var o2 = document.getElementById("o2");
var stringTable = "";
var tabela = document.getElementById("tabela");
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var variationArray = [];

var recentDate = new Date();

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

function getPreviewDate(date) {

    let aux = [];
    aux = getDate(date);

    if (aux[1] > 0) {
        return (aux[0] + "-" + aux[1] + "-" + aux[2]);
    } else {
        aux[1] = 12;
        aux[0]--;
        return (aux[0] + "-" + aux[1] + "-" + aux[2]);
    }
}

function getPreviewRate(base, rate) {

    clearArray();
    var dateArray = [];
    var date = new Date();

    for (let i = 5; i >= 0; i--) {
        date = getPreviewDate(date);
        dateArray[i] = date;
    }

    for (let j = 5; j >= 0; j--) {
        $.ajax({
            url: "https://api.exchangeratesapi.io/" + dateArray[j],
            data: {
                "rates": {},
                "base": base,
            },
            method: 'GET',
            dataType: "json"
        }).done(function (data) {
            variationArray[j] = data.rates[rate];
        });
    }
    defer(function () {
        createChart(rate, base, dateArray);
    });

    return variationArray;

}

//Create currencies options
function feedOptions(data) {
    var index;
    for (index in data.rates) {
        $(selectCurrency1).append(`<option value="${index}">${index}</option>`);
        $(selectCurrency2).append(`<option value="${index}">${index}</option>`);
    }
}

function calculate() {
    currencyA = selectCurrency1.value;
    currencyB = selectCurrency2.value;
    transationValue = currencyValue.value;

    requestCurrencyData(currencyA, currencyB, transationValue);
    getPreviewRate(currencyA, currencyB);
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

function defer(method) {
    var flag = false;
    for (let i = 0; i < 6; i++) {
        if (variationArray[i] == null) {
            flag = true;
        }
    }
    if (flag == true) {
        setTimeout(function () { defer(method) }, 50);
    } else {
        method();
    }
}

function createChart(currencyA, currencyB, dateArray) {
    Highcharts.chart('container1', {

        title: {
            text: 'Currency Variation ' + months[dateArray[0].split("-")[1] - 1] + "/" + dateArray[0].split("-")[0] + " - " + months[dateArray[5].split("-")[1] - 1] + "/" + dateArray[5].split("-")[0]
        },

        subtitle: {
            text: 'Using api.exchangeratesapi.io'
        },

        yAxis: {
            title: {
                text: 'Currency value'
            }
        },

        xAxis: {
            categories: dateArray
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },

        series: [{
            name: currencyA,
            data: variationArray
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}

//// ======== UTILITY FUNCTIONS

function clearArray() {
    variationArray = [];
}

function getDate(date) {
    let aux = [];
    if (typeof date == "object") {
        aux[0] = date.getFullYear();
        aux[1] = date.getMonth() + 1;
        aux[2] = date.getDate();
        return aux;
    } else if (typeof date == "string") {
        aux = date.split("-");
        aux[1]--;
        return aux;
    }
}
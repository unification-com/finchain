/* 
Sources to pull from:

https://www.alphavantage.co/documentation/
https://www.worldtradingdata.com/home
https://iexcloud.io/docs/api/#metadata

*******THE FOLLOWING KEYS SHOULD DEFINITELY BE STORED AS ENV VARS!!!**************
alphavantage API key: PC5LQPAGBFVN0E07
worldtradingdata API key: gA38Z0zV0GKDoNKNxFqb82sWYSarX7bNvcrTm0mC0irfnEfYdr8fm1qa7ID4
IEX API key : pk_9d147f681d434a19b6bad93e80bacf0a
*/

require("dotenv").config();

var request = require('request');

exports.symbols.symbols = ['ATVI','ADBE', 'AMD', 'ALXN','ALGN','GOOGL','GOOG','AMZN','AAL','AMGN','ADI','AAPL','AMAT','ASML',
    'ADSK','ADP', 'BIDU','BIIB','BMRN',	'BKNG',	'AVGO',	'CDNS','CELG','CERN','CHTR','CHKP','CTAS','CSCO','CTXS',
    'CTSH',	'CMCSA','COST','CSX','CTRP','DLTR','EBAY','EA','EXPE','FB',	'FAST',	'FISV',	'FOX','FOXA','GILD','HAS',
    'HSIC',	'IDXX',	'ILMN','INCY',	'INTC',	'INTU',	'ISRG',	'JBHT',	'JD','KLAC','LRCX','LBTYA',	'LBTYK','LULU',
    'MAR','MXIM','MELI','MCHP',	'MU','MSFT','MDLZ','MNST','MYL','NTAP',	'NTES','NFLX','NVDA','NXPI','ORLY',
    'PCAR','PAYX','PYPL','PEP','QCOM','REGN','ROST','SIRI','SWKS','SBUX','SYMC','SNPS','TMUS','TTWO','TSLA',
    'TXN','KHC','ULTA','UAL','VRSN','VRSK',	'VRTX',	'WBA','WDAY','WDC','WLTW','WYNN','XEL','XLNX'];

function alphaVantageApi() {
    var alpha_key = 'PC5LQPAGBFVN0E07';
    var alpha_uri = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+symbols[0]+'&interval=60min&apikey='+alpha_key;

    request.get(alpha_uri, function getData(error, response, body) {
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if (error) console.log('error:', error); // Print the error if one occurred
        else {  
            var myJson = JSON.parse(body);
            var price = myJson["Time Series (60min)"];
            for (x in price){
                console.log(price[x]['4. close']); //print JSON body
            }   
        }
    });
}

function worldTradingDataApi() {
    var world_key = 'gA38Z0zV0GKDoNKNxFqb82sWYSarX7bNvcrTm0mC0irfnEfYdr8fm1qa7ID4';
    var world_uri = 'https://api.worldtradingdata.com/api/v1/stock?symbol='+symbols[0]+'&api_token='+world_key;

    function worldrequest(error, response, body) {
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if (error) console.log('error:', error); // Print the error if one occurred
        else {  
            var myJson = JSON.parse(body);
            console.log(myJson);
        }   
    }
    request.get(world_uri,worldrequest);
}


function IEXApi () {
    var IEX_key = 'pk_9d147f681d434a19b6bad93e80bacf0a';
    var IEX_uri = 'https://cloud.iexapis.com/stable/tops?token='+IEX_key+'&symbols='+symbols[0];

    request.get(IEX_uri, function getData(error, response, body) {
        //console.log("statusCode: ", response);
        if (error) console.log("error: ", error);
        else {
            console.log(body);
        }

    });
}

function callApi(callback) {
    alphaVantageApi();
    worldTradingDataApi();
    IEXApi();
    callback();
}


/*
setTimeout(); //useful for continually executing a piece of code on an interval
*/
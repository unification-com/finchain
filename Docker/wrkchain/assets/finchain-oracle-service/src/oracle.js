/* 
Sources to pull from:

https://www.alphavantage.co/documentation/
https://www.worldtradingdata.com/home
https://iexcloud.io/docs/api/#metadata

*/

require('dotenv').config({ path: 'C:/Users/Waleed Elsakka/Documents/Bounties/finchain-demo/.env'});

var request = require('request');

//list of symbols. Should remain as is? or become env var?
exports.symbols = ['ATVI','ADBE', 'AMD', 'ALXN','ALGN','GOOGL','GOOG','AMZN','AAL','AMGN','ADI','AAPL','AMAT','ASML',
    'ADSK','ADP', 'BIDU','BIIB','BMRN',	'BKNG',	'AVGO',	'CDNS','CELG','CERN','CHTR','CHKP','CTAS','CSCO','CTXS',
    'CTSH',	'CMCSA','COST','CSX','CTRP','DLTR','EBAY','EA','EXPE','FB',	'FAST',	'FISV',	'FOX','FOXA','GILD','HAS',
    'HSIC',	'IDXX',	'ILMN','INCY',	'INTC',	'INTU',	'ISRG',	'JBHT',	'JD','KLAC','LRCX','LBTYA',	'LBTYK','LULU',
    'MAR','MXIM','MELI','MCHP',	'MU','MSFT','MDLZ','MNST','MYL','NTAP',	'NTES','NFLX','NVDA','NXPI','ORLY',
    'PCAR','PAYX','PYPL','PEP','QCOM','REGN','ROST','SIRI','SWKS','SBUX','SYMC','SNPS','TMUS','TTWO','TSLA',
    'TXN','KHC','ULTA','UAL','VRSN','VRSK',	'VRTX',	'WBA','WDAY','WDC','WLTW','WYNN','XEL','XLNX'];

function alphaVantageApi(callback) {

    var alpha_uri = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+exports.symbols[0]+'&interval=60min&apikey='+process.env.ALPHAVANTAGE;

    request.get(alpha_uri, function getData(error, response, body) {
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if (error) console.log('error:', error); // Print the error if one occurred
        else {  
            console.log("AlphaVantage API: \n\n")
            var myJson = JSON.parse(body);
            var price = myJson["Time Series (60min)"];
            for (x in price){
                console.log(
                    "Ticker : ", exports.symbols[0], '\n',
                    "Price : ", price[x]['4. close'], '\n', 
                    "Timestamp : ", x, '\n'
                    ); //print JSON body
                break;
            }
            callback();   
        }
    });
}

//function for World Trading API
function worldTradingDataApi(callback) {

    var world_uri = 'https://api.worldtradingdata.com/api/v1/stock?symbol='+exports.symbols[0]+'&api_token='+process.env.WORLDTRADING;

    request.get(world_uri, function worldrequest(error, response, body) {
        //proper formatting for World Trading API
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if (error) console.log('error:', error); // Print the error if one occurred
        else {  
            console.log("WorldTrading API: \n\n");
            var myJson = JSON.parse(body);
            var data = myJson["data"][0];
            console.log(
                "Ticker : ", data['symbol'], '\n',
                "Price : ", data['price'], '\n', 
                "Timestamp : ", data['last_trade_time'], '\n',
            );
            callback();
        }   
    });
}

//function for IEX cloud API
function IEXApi (callback) {

    var IEX_uri = 'https://cloud.iexapis.com/stable/tops?token='+process.env.IEX+'&symbols='+exports.symbols[0];

    request.get(IEX_uri, function getData(error, response, body) {
        console.log("statusCode: ", response && response.statusCode);
        if (error) console.log("error: ", error);
        else {
            //proper formatting for IEX Cloud API
            console.log("IEX API: \n\n ");
            var myJson = JSON.parse(body);
            console.log(
                "Ticker : ", exports.symbols[0], '\n',
                "Price : ", myJson, '\n', 
                "Timestamp : ", "new Date(myJson[0]['lastSaleTime']).toISOString().slice(0, 19).replace('T', ' ')", '\n',
                );
                console.log();
            callback();
        }

    });
}

//driver function to be exported to ethereum.js
exports.callapi = function callApi() {
    //pass in NoOfStocks from smart contract
    //for (i = 0; i < NoOfStocks; ++i) 
        //each function should take i as an arg, and use that to define which symbol data should be related to
        alphaVantageApi(this.log);
        worldTradingDataApi(this.log);
        //IEXApi(logComplete);
};

//callback function to inform when API call is complete
exports.log = function logComplete () {
    console.log("\n\nAPI'S REQUESTED SUCCESSFULLY\n\n");
}


/*
setInterval
setTimeout(); //useful for continually executing a piece of code on an interval
*/
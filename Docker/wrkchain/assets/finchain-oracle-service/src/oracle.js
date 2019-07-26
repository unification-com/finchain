/* 
Sources to pull from:

https://www.alphavantage.co/documentation/
https://www.worldtradingdata.com/home
https://iexcloud.io/docs/api/#metadata

*/

require('dotenv').config({ path: 'C:/Users/Waleed Elsakka/Documents/Bounties/finchain-demo/.env'});

var request = require('request');

//array of symbols
symbols = ['ATVI','ADBE', 'AMD', 'ALXN','ALGN','GOOGL','GOOG','AMZN','AAL','AMGN','ADI','AAPL','AMAT','ASML',
    'ADSK','ADP', 'BIDU','BIIB','BMRN',	'BKNG',	'AVGO',	'CDNS','CELG','CERN','CHTR','CHKP','CTAS','CSCO','CTXS',
    'CTSH',	'CMCSA','COST','CSX','CTRP','DLTR','EBAY','EA','EXPE','FB',	'FAST',	'FISV',	'FOX','FOXA','GILD','HAS',
    'HSIC',	'IDXX',	'ILMN','INCY',	'INTC',	'INTU',	'ISRG',	'JBHT',	'JD','KLAC','LRCX','LBTYA',	'LBTYK','LULU',
    'MAR','MXIM','MELI','MCHP',	'MU','MSFT','MDLZ','MNST','MYL','NTAP',	'NTES','NFLX','NVDA','NXPI','ORLY',
    'PCAR','PAYX','PYPL','PEP','QCOM','REGN','ROST','SIRI','SWKS','SBUX','SYMC','SNPS','TMUS','TTWO','TSLA',
    'TXN','KHC','ULTA','UAL','VRSN','VRSK',	'VRTX',	'WBA','WDAY','WDC','WLTW','WYNN','XEL','XLNX'];

function alphaVantageApi(index) {
    return new Promise((resolve,reject) => {

        var alpha_uri = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+symbols[index]+'&interval=60min&apikey='+process.env.ALPHAVANTAGE;

        request.get(alpha_uri, function getData(error, response, body) {
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            if (error) reject(error); // Print the error if one occurred
            else {  
                console.log("AlphaVantage API: \n\n")
                var myJson = JSON.parse(body);
                var price = myJson["Time Series (60min)"];
                for (x in price){

                    var alphaArr = [symbols[index], price[x]['4. close'], x];
                    resolve(alphaArr);
                }
            }
        });
    })
}

//function for World Trading API
function worldTradingDataApi(index) {

    return new Promise((resolve,reject) => {

        var world_uri = 'https://api.worldtradingdata.com/api/v1/stock?symbol='+symbols[index]+'&api_token='+process.env.WORLDTRADING;

        request.get(world_uri, function worldrequest(error, response, body) {
            //proper formatting for World Trading API
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            if (error) reject(error); // Print the error if one occurred
            else {  
                var myJson = JSON.parse(body);
                var data = myJson["data"][0];
                var array = [data['symbol'],data['price'],data['last_trade_time']];
                resolve(array);
            }   
        });
    });
}

//function for IEX cloud API
function IEXApi (index) {
    
    return new Promise((resolve,reject) => {

        var IEX_uri = 'https://cloud.iexapis.com/stable/tops?token='+process.env.IEX+'&symbols='+symbols[index];

        request.get(IEX_uri, function getData(error, response, body) {
            console.log("statusCode: ", response && response.statusCode);
            if (error) reject(error);
            else {
                //proper formatting for IEX Cloud API
                console.log("IEX API: \n\n ");
                var myJson = JSON.parse(body);
                var data = myJson[0];
                var array = [symbols[index], data['lastSalePrice'], new Date(myJson[0]['lastSaleTime']).toISOString().slice(0, 19).replace('T', ' ')];
                resolve(array);
            }
        });
    });
}


exports.callapi = (index) => {
    return new Promise ( (resolve,reject) => {

        const alpha = (index) =>{
            return new Promise( (resolve, reject) =>{
                alphaVantageApi(index).then(array => {
                    if(array != null){
                        console.log(array[0],array[1],array[2]);
                        resolve(array);
                    }
                    else reject();
                });
            });
        };

       const world = (index) => {
           return new Promise ( (resolve, reject) =>{
                worldTradingDataApi(index).then(array => {
                    if(array != null){
                        console.log(array[0],array[1],array[2]);
                        resolve(array);
                    }
                    else reject();
                });
           });
       };

       const iex = (index) => {
           return new Promise ((resolve,reject) => {
                IEXApi(index).then(array => {
                    if(array != null){
                        console.log(array[0],array[1],array[2]);
                        resolve(array);
                    }
                    else reject();
                });
           });
       };

       //some type of promiseall or resolve an array of arrays?
       var apidata =[alpha,world,iex];
       resolve(apidata);
    });
}


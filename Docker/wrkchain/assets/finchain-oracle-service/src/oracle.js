/* 
Sources to pull from:

https://www.alphavantage.co/documentation/
https://www.worldtradingdata.com/home
https://iexcloud.io/docs/api/#metadata

*/

require('dotenv').config();

var request = require('request');

var avTest = {"Meta Data": {"1. Information": "Intraday (60min) open, high, low, close prices and volume","2. Symbol": "ATVI","3. Last Refreshed": "2019-08-19 15:30:00","4. Interval": "60min","5. Output Size": "Compact","6. Time Zone": "US/Eastern"},"Time Series (60min)": {"2019-08-19 15:30:00": {"1. open": "47.9800","2. high": "48.0050","3. low": "47.9000","4. close": "47.9200","5. volume": "607011"},"2019-08-19 14:30:00": {"1. open": "47.9500","2. high": "48.1100","3. low": "47.8700","4. close": "47.9900","5. volume": "488597"}}};

var wtdTest = {"symbols_requested":1,"symbols_returned":1,"data":[{"symbol":"ATVI","name":"Activision Blizzard, Inc.","currency":"USD","price":"47.92","price_open":"47.55","day_high":"48.30","day_low":"47.28","52_week_high":"84.68","52_week_low":"39.85","day_change":"1.26","change_pct":"2.70","close_yesterday":"46.66","market_cap":"36755881984","volume":"3685935","volume_avg":"7207366","shares":"766006976","stock_exchange_long":"NASDAQ Stock Exchange","stock_exchange_short":"NASDAQ","timezone":"EST","timezone_name":"America/New_York","gmt_offset":"-18000","last_trade_time":"2019-08-19 16:00:01"}]};

var iexTest = [{"symbol":"ATVI","sector":"consumerdurables","securityType":"cs","bidPrice":0,"bidSize":0,"askPrice":0,"askSize":0,"lastUpdated":1566244800004,"lastSalePrice":47.975,"lastSaleSize":100,"lastSaleTime":1566244793901,"volume":119210}];

exports.alphaVantageApi = (symbol) => {
    return new Promise((resolve,reject) => {

        var alpha_uri = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+symbol+'&interval=60min&apikey='+process.env.ALPHAVANTAGE;
        request.get(alpha_uri, function getData(error, response, body) {
            if (error) reject(error); // Print the error if one occurred
            else {
                var myJson = JSON.parse(body);
                if(myJson.hasOwnProperty("Time Series (60min)")) {
                    var price = myJson["Time Series (60min)"];
                    var idx = Object.keys(price)[0];
                    var alphaArr = [symbol, price[idx]['4. close'], Date.now()];
                } else {
                    var alphaArr = [symbol,0,Date.now()];
                }
                resolve(alphaArr);
            }
        });
    })
}

//function for World Trading API
exports.worldTradingDataApi = (symbol) => {

    return new Promise((resolve,reject) => {

        var world_uri = 'https://api.worldtradingdata.com/api/v1/stock?symbol='+symbol+'&api_token='+process.env.WORLDTRADING;

        request.get(world_uri, function worldrequest(error, response, body) {
            //proper formatting for World Trading API
            if (error) reject(error); // Print the error if one occurred
            else {
                var myJson = JSON.parse(body);
                if(myJson.hasOwnProperty('data')) {
                    var data = myJson["data"][0];
                    var array = [symbol,data['price'],Date.now()];
                } else {
                    var array = [symbol,0,Date.now()];
                }
                resolve(array);
            }
        });
    });
}

this.worldTradingDataApi(4);

//function for IEX cloud API
exports.IEXApi = (symbol) => {

    return new Promise((resolve,reject) => {

        var IEX_uri = 'https://cloud.iexapis.com/stable/tops?token='+process.env.IEX+'&symbols='+symbol;

        request.get(IEX_uri, function getData(error, response, body) {
            if (error) reject(error);
            else {
                //proper formatting for IEX Cloud API
                var myJson = JSON.parse(body);
                if(myJson.length > 0) {
                var data = myJson[0];
                    if(data.hasOwnProperty('symbol')) {
                        var array = [symbol, data['lastSalePrice'],Date.now()];
                    } else {
                        var array = [symbol,0,Date.now()];
                    }
                } else {
                    var array = [symbol,0,Date.now()];
                }
                resolve(array);
            }
        });

    });
}

/* 
Sources to pull from:

https://www.alphavantage.co/documentation/
https://www.worldtradingdata.com/home
https://iexcloud.io/docs/api/#metadata

*/

require('dotenv').config();

var request = require('request');
const axios = require("axios");

var avTest = {"Meta Data": {"1. Information": "Intraday (60min) open, high, low, close prices and volume","2. Symbol": "ATVI","3. Last Refreshed": "2019-08-19 15:30:00","4. Interval": "60min","5. Output Size": "Compact","6. Time Zone": "US/Eastern"},"Time Series (60min)": {"2019-08-19 15:30:00": {"1. open": "47.9800","2. high": "48.0050","3. low": "47.9000","4. close": "47.9200","5. volume": "607011"},"2019-08-19 14:30:00": {"1. open": "47.9500","2. high": "48.1100","3. low": "47.8700","4. close": "47.9900","5. volume": "488597"}}};

var wtdTest = {"symbols_requested":1,"symbols_returned":1,"data":[{"symbol":"ATVI","name":"Activision Blizzard, Inc.","currency":"USD","price":"47.92","price_open":"47.55","day_high":"48.30","day_low":"47.28","52_week_high":"84.68","52_week_low":"39.85","day_change":"1.26","change_pct":"2.70","close_yesterday":"46.66","market_cap":"36755881984","volume":"3685935","volume_avg":"7207366","shares":"766006976","stock_exchange_long":"NASDAQ Stock Exchange","stock_exchange_short":"NASDAQ","timezone":"EST","timezone_name":"America/New_York","gmt_offset":"-18000","last_trade_time":"2019-08-19 16:00:01"}]};

var iexTest = [{"symbol":"ATVI","sector":"consumerdurables","securityType":"cs","bidPrice":0,"bidSize":0,"askPrice":0,"askSize":0,"lastUpdated":1566244800004,"lastSalePrice":47.975,"lastSaleSize":100,"lastSaleTime":1566244793901,"volume":119210}];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.alphaVantageApi = (trackedTickers) => {
    return new Promise((resolve,reject) => {
        let results = [];
        let tickers = trackedTickers.split(",");
        let tickerChunks = [];

        //split into chinks of 5. Max is 5 requests per minute for AV
        while(tickers.length > 0) {
            tickerChunks.push(tickers.splice(0, 5));
        }

        const getStockData = (ticker) => {
            return new Promise((resolve, reject) => {
                let alpha_uri = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+ticker+'&interval=60min&apikey='+process.env.ALPHAVANTAGE;
                console.log(alpha_uri);
                axios.get(alpha_uri)
                .then(response => {
                    const data = response.data;
                    if(data.hasOwnProperty("Time Series (60min)")) {
                        var price = data["Time Series (60min)"];
                        var idx = Object.keys(price)[0];
                        return resolve({symbol: ticker, price: price[idx]['4. close'], datetime: Date.now()});
                    } else {
                        console.log("AV Data error for:", ticker);
                        console.log(data);
                        console.log("send zero values for AV");
                        return resolve({symbol: ticker, price: 0, datetime: Date.now()})
                    }
                })
                .catch(error => {
                    return reject(error.message)
                })
            })
        }

        const getStocks = async() => {
            console.log('Alpha Vantage Start');
            for (let tc of tickerChunks) {
                for (let ticker of tc) {
                    console.log(ticker);
                    await getStockData(ticker).then((res) => {
                        if(res.price > 0) {
                            results.push(res);
                        }
                    })
                 }
                 if(tickerChunks.length > 1) {
                     console.log("AV - wait 60 seconds until next batch");
                     await sleep(60000);
                 }

             }
             console.log('Alpha Vantage End');
             resolve(results);
        }

        getStocks();

    });
}

//function for World Trading API
exports.worldTradingDataApi = (trackedTickers) => {

    return new Promise((resolve,reject) => {
        let tickers = trackedTickers.split(",");
        let results = [];
        let tickerChunks = [];

        //split into chinks of 5. Max is 5 for WTD
        while(tickers.length > 0) {
            tickerChunks.push(tickers.splice(0, 5));
        }

        const getStockData = (tickers) => {
            return new Promise((resolve, reject) => {
                let world_uri = 'https://api.worldtradingdata.com/api/v1/stock?symbol='+tickers+'&api_token='+process.env.WORLDTRADING;
                console.log(world_uri);
                axios.get(world_uri)
                .then(response => {
                    const data = response.data;
                    let r = [];
                    if(data.hasOwnProperty("data")) {
                        for(i=0; i < data['data'].length; i++) {
                            let stockData = data['data'][i];
                            r.push({symbol: stockData['symbol'], price: stockData['price'], datetime: Date.now()});
                        }

                    } else {
                        console.log("WTD data error:", data);
                        console.log("send zero values for WTD");
                        let dummyTickers = tickers.split(",");
                        for(let t of dummyTickers) {
                            r.push({symbol: t, price: 0.0, datetime: Date.now()});
                        }
                    }
                    return resolve(r);
                })
                .catch(error => {
                    return reject(error.message)
                })
            })
        }

        const getStocks = async() => {
            console.log('WTD Start');
            for (let tc of tickerChunks) {
                let t = tc.join(",");
                console.log(t);
                await getStockData(t).then((res) => {
                    for(let r of res) {
                        results.push(r);
                    }
                })
             }
             console.log('WTD End');
             resolve(results);
        }

        getStocks();
    });
}

//function for IEX cloud API
exports.IEXApi = (trackedTickers) => {

    return new Promise((resolve,reject) => {
        let tickers = trackedTickers.split(",");
        let results = [];
        let tickerChunks = [];

        //split into chinks of 10
        while(tickers.length > 0) {
            tickerChunks.push(tickers.splice(0, 10));
        }

        const getStockData = (tickers) => {
            return new Promise((resolve, reject) => {
                var IEX_uri = 'https://cloud.iexapis.com/stable/tops?token='+process.env.IEX+'&symbols='+tickers;
                console.log(IEX_uri);
                axios.get(IEX_uri)
                .then(response => {
                    const data = response.data;
                    let r = [];
                    if(data.length > 0) {
                        for(i=0; i < data.length; i++) {
                            let stockData = data[i];
                            r.push({symbol: stockData['symbol'], price: stockData['lastSalePrice'], datetime: Date.now()});
                        }
                    } else {
                        console.log("IEX data error:", data);
                        console.log("send zero values for IEX");
                        let dummyTickers = tickers.split(",");
                        for(let t of dummyTickers) {
                            r.push({symbol: t, price: 0.0, datetime: Date.now()});
                        }
                    }
                    return resolve(r);
                })
                .catch(error => {
                    return reject(error.message)
                })
            })
        }

        const getStocks = async() => {
            console.log('IEX Start');
            for (let tc of tickerChunks) {
                let t = tc.join(",");
                console.log(t);
                await getStockData(t).then((res) => {
                    for(let r of res) {
                        results.push(r);
                    }
                })
             }
             console.log('IEX End');
             resolve(results);
        }

        getStocks();
    });
}

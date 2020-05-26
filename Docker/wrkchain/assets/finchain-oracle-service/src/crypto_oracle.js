require('dotenv').config();

var request = require('request');
const axios = require("axios");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const BaseUrl = "https://api.coingecko.com/api/v3/exchanges/";

//function for IEX cloud API
exports.GetCryptoPrices = (trackedCryptos, exchange) => {
    return new Promise((resolve, reject) => {
        let results = [];
        var URL = BaseUrl + exchange + '/tickers?coin_ids=' + trackedCryptos;
        console.log(URL);
        axios.get(URL)
            .then(response => {
                const data = response.data;
                try {
                    let tickers = data.tickers;
                    for (i = 0; i < tickers.length; i++) {
                        if (tickers[i]["target"] === "USD" || tickers[i]["target"] === "USDT") {
                            let cryptoData = tickers[i];
                            let d = Date.parse(cryptoData['timestamp']);
                            let timestamp = Math.round(d / 1000);
                            let resData = {
                                symbol: cryptoData['base'],
                                price_usd: cryptoData['converted_last']['usd'],
                                datetime: timestamp,
                            }
                            results.push(resData);
                        }
                    }
                } catch (e) {
                    console.log(exchange + "data error", e.toString());
                    let dummyTickers = tickers.split(",");
                    for (let t of dummyTickers) {
                        const now = new Date()
                        const timestamp = Math.round(now.getTime() / 1000)
                        results.push({
                            symbol: t,
                            price_usd: 0.0,
                            datetime: timestamp
                        });
                    }
                }
                return resolve(results);
            })
            .catch(error => {
                return reject(error.message)
            })
    });
}

var ether = require('./ethereum.js');
var oracle = require('./oracle.js');
var cryptoOracle = require('./crypto_oracle');

isStockAdded = false;
isCryptoAdded = false;
let stockSources = [null, 'Alpha Vantage', 'IEX Cloud']
let tickers = process.env.TRACKED_TICKERS;
let tickersArray = tickers.split(",");

let cryptoExchanges = ['gdax','binance','huobi','bittrex','bitfinex','bitstamp','digifinex','probit','bitforex'];
let cryptoTickers = process.env.TRACKED_CRYPTOS;

//The below function calls should be for initializing the contract and updating stock prices

//Adding each approved address to the whitelist; execute if boolean
function addStockAddressToWhitelist(){
    for (i = 1; i < 3; i++) {
        ether.addStocksSource(i, stockSources[i]);
    };
    isStockAdded = true
};

function addCryptoAddressToWhitelist(){
    for (i = 0; i < cryptoExchanges.length; i++) {
        ether.addCryptoSource(i+1, cryptoExchanges[i]);
    };
    isCryptoAdded = true
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function updateStocksSmartContract() {

    if (isStockAdded === false) {
        await addStockAddressToWhitelist();
        await sleep(20000); //wait for block to process
    }

    console.log("Waiting...\n");
    let receivedStocks = {};
    for(i=0; i<tickersArray.length; i++) {
        receivedStocks[tickersArray[i]] = 0;
    }


    var apidata = [oracle.alphaVantageApi(tickers),oracle.IEXApi(tickers)];
    Promise.all(apidata).then(async (dataArray) => {
        let accIdx = 0;
        for (const oracleRes of dataArray) {
            accIdx++;
            for(var i = 0; i < oracleRes.length; i++) {
                let price = 0
                if(oracleRes[i].price != null) {
                    price = (Math.trunc(parseFloat(oracleRes[i].price) * 100));
                }
                let symbol = oracleRes[i].symbol;
                let updateRes = await ether.updateStock(symbol, price, accIdx)
                    .catch(console.error, async () => {});
                console.log(updateRes);
                receivedStocks[symbol] = receivedStocks[symbol] + 1;
                await sleep(1000);
            }
        }
        console.log(receivedStocks);
        console.log("wait for", process.env.UPDATE_TIME / 1000, "seconds until next poll...")
    }).catch(console.error);
}

async function updateCryptoSmartContract() {

    if(isCryptoAdded === false) {
        await addCryptoAddressToWhitelist();
        await sleep(20000); //wait for block to process
    }

    console.log("Waiting...\n");
    let apiData = [
        cryptoOracle.GetCryptoPrices(cryptoTickers, cryptoExchanges[0]),
        cryptoOracle.GetCryptoPrices(cryptoTickers, cryptoExchanges[1]),
        cryptoOracle.GetCryptoPrices(cryptoTickers, cryptoExchanges[2]),
        cryptoOracle.GetCryptoPrices(cryptoTickers, cryptoExchanges[3]),
        cryptoOracle.GetCryptoPrices(cryptoTickers, cryptoExchanges[4]),
        cryptoOracle.GetCryptoPrices(cryptoTickers, cryptoExchanges[5]),
        cryptoOracle.GetCryptoPrices(cryptoTickers, cryptoExchanges[6]),
        cryptoOracle.GetCryptoPrices(cryptoTickers, cryptoExchanges[7]),
        cryptoOracle.GetCryptoPrices(cryptoTickers, cryptoExchanges[8])
    ];
    Promise.all(apiData).then(async (promiseArray) => {
        let exchangeIdx = 0;
        for (const dataArray of promiseArray) {
            let accIdx = exchangeIdx + 1;
            for(var i = 0; i < dataArray.length; i++) {
                let intPrice = 0;
                if(dataArray[i].price_usd != null && dataArray[i].price_usd > 0) {
                    intPrice = (Math.round(parseFloat(dataArray[i].price_usd) * 100));
                }
                let symbol = dataArray[i].symbol;
                let updateRes = await ether.updateCryptoTicker(symbol, intPrice, dataArray[i].datetime, accIdx)
                    .catch(console.error, async () => {});
                console.log(cryptoExchanges[exchangeIdx], updateRes);
                await sleep(1000);

            }
            exchangeIdx++;
        }
    }).catch(console.error);
}

//run for the first time
//updateStocksSmartContract()

updateCryptoSmartContract();

//run every stated interval
//setInterval(updateStocksSmartContract, process.env.UPDATE_TIME || 3600000);
setInterval(updateCryptoSmartContract, process.env.CRYPTO_UPDATE_TIME || 600000);

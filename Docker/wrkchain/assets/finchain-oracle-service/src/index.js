var ether = require('./ethereum.js');
var oracle = require('./oracle.js');

isAdded = false;
let sources = [null, 'Alpha Vantage', 'World Trading', 'IEX Cloud']
let tickers = process.env.TRACKED_TICKERS;
let tickersArray = tickers.split(",");

//The below function calls should be for initializing the contract and updating stock prices

//Adding each approved address to the whitelist; execute if boolean
function addAddressToWhitelist(){
    for (i = 1; i < 4; i++) {
        ether.addSource(i, sources[i]);
    };
    isAdded = true;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function updateSmartContract() {

    if (isAdded == false) {
        await addAddressToWhitelist();
        await sleep(20000); //wait for block to porcess
    }

    console.log("Waiting...\n");
    let receivedStocks = {};
    for(i=0; i<tickersArray.length; i++) {
        receivedStocks[tickersArray[i]] = 0;
    }


    var apidata = [oracle.alphaVantageApi(tickers),oracle.worldTradingDataApi(tickers), oracle.IEXApi(tickers)];
    Promise.all(apidata).then(async (dataArray) => {
        let accIdx = 0;
        for (const oracleRes of dataArray) {
            accIdx++;
            for(var i = 0; i < oracleRes.length; i++) {
                let price = (Math.trunc(parseFloat(oracleRes[i].price) * 100));
                let symbol = oracleRes[i].symbol;
                let dateTime = oracleRes[i].datetime;
                await ether.updateStock(symbol, price, accIdx)
                    .catch(console.error, async () => {});
                receivedStocks[symbol] = receivedStocks[symbol] + 1;
                await sleep(1000);
            }
        }
        console.log(receivedStocks);
        for(i=0; i<tickersArray.length; i++) {
            let ticker = tickersArray[i];
            if(receivedStocks[ticker] < 3) {
                await ether.resetShadowCounter(ticker);
            }
        }
        console.log("wait for", process.env.UPDATE_TIME / 1000, "seconds until next poll...")
    }).catch(console.error);



}

//run for the first time
updateSmartContract()

//run every stated interval
setInterval(updateSmartContract, process.env.UPDATE_TIME);

var ether = require('./ethereum.js');
var oracle = require('./oracle.js');

isAdded = false;
let trackedTickers = process.env.TRACKED_TICKERS.split(",");
// clean any spaces
for (i = 0; i < trackedTickers.length; i++) {
    trackedTickers[i] = trackedTickers[i].trim();
}
let sources = [null, 'Alpha Vantage', 'World Trading', 'IEX Cloud']

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

    console.log("Waiting...\n");

    
    if (isAdded == false) {
        await addAddressToWhitelist();
        await sleep(20000); //wait for block to porcess
    }

    for (i = 0; i < trackedTickers.length; i++) {
        k = 0;
        let symbol = trackedTickers[i];
        console.log("Symbol " + symbol);
        var apidata = [oracle.alphaVantageApi(symbol),oracle.worldTradingDataApi(symbol), oracle.IEXApi(symbol)];
        Promise.all(apidata).then(async (arr) => {
            for (const item of arr) {
                ++k;
                let price = (Math.trunc(item[1] * 100));
                if(price > 0 && k <= 3) {
                    await ether.updateStock(item[0], price, k)
                    .catch(console.error, async () => {

                    });
                } else {
                    console.log("price is 0. Daily query allowance probably ran out for ", symbol, k, sources[k])
                }
                 await sleep(1000);
            }
        });
        await sleep(5000);
    }
}

//run for the first time
updateSmartContract()

//run every stated interval
setInterval(updateSmartContract, process.env.UPDATE_TIME);

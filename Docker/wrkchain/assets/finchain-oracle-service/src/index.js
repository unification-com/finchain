var ether = require('./ethereum.js');
var oracle = require('./oracle.js');

isAdded = false;

//The below function calls should be for initializing the contract and updating stock prices

//Adding each approved address to the whitelist; execute if boolean
function addAddressToWhitelist(){
    for (i = 1; i < 4; i++) {
        ether.addSource(i);
    };
    isAdded = true;
};


//pass in process.env.NOOFSTOCKS
async function updateSmartContract(numStocks) {

    console.log("Waiting...\n");
    k = 0;
    
    if (isAdded == false) {
        await addAddressToWhitelist();
        await ether.resetShadow();
    }

    for (i = 0; i < numStocks; i++) {
        
        var apidata = [oracle.alphaVantageApi(i),oracle.worldTradingDataApi(i), oracle.IEXApi(i)];
        Promise.all(apidata).then(async (arr) => {
            for (const item of arr) {
                ++k;
                await ether.updateStock(item[0], (Math.trunc(item[1] * 100)) * k, i - 1, k)
                    .catch(console.error, async () => {
                        await ether.resetShadow();
                    });
            }
        });         
    }
}

setInterval(updateSmartContract, process.env.UPDATE_TIME, process.env.NOOFSTOCKS);
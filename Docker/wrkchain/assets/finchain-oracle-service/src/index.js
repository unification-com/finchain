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
function updateSmartContract(index) {
    ether.event.watch();

    if (isAdded == false) {
        addAddressToWhitelist();
    }

    for (i = 0; i < index; i++) {
        var apidata = [oracle.alphaVantageApi(i),oracle.worldTradingDataApi(i), oracle.IEXApi(i)];
        Promise.all(apidata).then(arr => {
            for (k = 0; k < 3; k++) {
                ether.updateStock(arr[k][0], Math.trunc(arr[k][1] * 100), arr[k][2]);
            }
        });
    }
}

setInterval(updateSmartContract, process.env.UPDATE_TIME, process.env.NOOFSTOCKS);



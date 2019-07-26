var ether = require('./ethereum.js');
var oracle = require('./oracle.js');

var arrays = oracle.callapi(0);
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
    if(isAdded == false) {
        addAddressToWhitelist();
    }
    
    
}


/*
setInterval
setTimeout(); //useful for continually executing a piece of code on an interval
*/

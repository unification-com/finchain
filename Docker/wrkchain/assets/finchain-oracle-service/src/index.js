var ether = require('./ethereum.js');
var oracle = require('./oracle.js');

oracle.callapi();

//The below function calls should be for initializing the contract and updating stock prices

//Adding each approved address to the whitelist
for (i = 1; i < 4; i++) {
    addSource(i);
  }

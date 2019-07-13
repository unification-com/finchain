const Finchain = artifacts.require("Finchain");
const Web3 = require('web3-utils');
require("dotenv").config();



module.exports = function(deployer) {
    //Pass 7 (percent) as the threshold, 1 as the no of stocks to update
  deployer.deploy(Finchain, 7, 1)
};
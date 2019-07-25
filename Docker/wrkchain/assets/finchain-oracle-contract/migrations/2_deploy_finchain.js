const Finchain = artifacts.require("Finchain");
const Web3 = require('web3-utils');
require("dotenv").config();

module.exports = function(deployer) {
    //Pass 7 (percent) as the threshold, 1 as the no of stocks to update
  deployer.deploy(Finchain, 7, 1, {from : "0x83197e2e58929c41f6ebe3b4ea6d6a07cfb4a97b"})
};
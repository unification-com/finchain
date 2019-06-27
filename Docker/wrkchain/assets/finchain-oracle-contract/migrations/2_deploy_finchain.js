const Finchain = artifacts.require("Finchain");
const Web3 = require('web3-utils');
require("dotenv").config();

//let threshold = [
//  process.env.THRESHOLD,
//]

module.exports = function(deployer) {
    //Pass 7 (percent) as the constructor value for Finchain
  deployer.deploy(Finchain, 7)
};
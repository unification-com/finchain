const Stocks = artifacts.require("Stocks");
require("dotenv").config();

module.exports = function(deployer) {
  deployer.deploy(
    Stocks,
    process.env.THRESHOLD)
};
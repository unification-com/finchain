const Crypto = artifacts.require("Crypto");
require("dotenv").config();

module.exports = function(deployer) {
  deployer.deploy(
    Crypto,
    process.env.CRYPTO_THRESHOLD,
    process.env.CRYPTO_TIMEDIFF)
};
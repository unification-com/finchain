const Finchain = artifacts.require("Finchain");
require("dotenv").config();

module.exports = function(deployer) {
  deployer.deploy(
    Finchain,
    process.env.THRESHOLD
};
const Finchain = artifacts.require("Finchain");
require("dotenv").config();

module.exports = function(deployer) {
  deployer.deploy(
    Finchain,
    process.env.THRESHOLD,
    process.env.NOOFSTOCKS,
    {from : "0x83197e2e58929c41f6ebe3b4ea6d6a07cfb4a97b"}
    )
};
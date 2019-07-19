require("dotenv").config();

//can replace imports with require, but does not entirely matter
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from "web3";
var config = require('./../../finchain-oracle-contract/truffle-config');
var finabi = require('./../../finchain-oracle-contract/build/contracts/finchain.json');
var symbols = require('./oracle');

//If process.env does not work, just replace with hard coded values
const web3 = new Web3(new HDWalletProvider( //connection to WRKChain
    config.privateKeys,
    config.rpcport,
    0,
    4 ));
const abi = finabi.abi;
const address = process.env.CONTRACT_ADDRESS;
const contract = web3.eth.contract(abi).at(address); //instance of contract

//code to get accounts from web3 variable, can change to modular functions rather than promises
const account = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err === null) {
      console.log(accounts);
        resolve(accounts);
      } else {
        reject(err);
      }
    });
  });
};

//First, 3 calls to addSource provided addresses

function addSources (callback) {
    for (i = 1; i < account.length; ++i){
        contract.addSource(account[i], {from : account[0]});
    }
}
function logAddress() {
    console.log("Account "+ account[1]+" added.\n");
  }

//block of code using contract var to call smart contract functions and passes in the proper parameters
//For finchain, the function to call would be updateStock, which in turn will call the other 
//private functions once certain criteria is met

function updateStock (ticker, price, index, account) {
    contract.updateStock(
      ticker, price, index , { from : account }, function callComplete (err) {
        if (err) console.log("error: ", err);
        else console.log("Stock updated\n"); 
    })
}

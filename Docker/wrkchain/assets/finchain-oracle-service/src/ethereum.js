require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

//research how to create arrays and abi strings for process.env
var privateKeys = [
  process.env.WRKCHAIN_PKEY_1,
  process.env.WRKCHAIN_PKEY_2,
  process.env.WRKCHAIN_PKEY_3,
  process.env.WRKCHAIN_PKEY_4
];

const abi = JSON.parse(process.env.FINCHAIN_ORACLE_ABI);

//Infura HDWalletProvider, passes in array of keys, RPC_port (or URL), array index to start at, and number of keys in array
const provider = new HDWalletProvider(privateKeys, process.env.WRKCHAIN_WEB3_PROVIDER_URL , 0 , 4);
//utilizing web3 protocol to call contract functions
const web3 = new Web3(provider);
//instantiation of contract at its address and with abi
const myContract = web3.eth.contract(abi).at(process.env.CONTRACT_ADDRESS);
exports.dis = myContract.discrepancy({}, {fromBlock: 0, toBlock: 'latest'}); 
exports.data = myContract.stockData();

//addSource function
exports.addSource = (i, source) => {
  return new Promise( (resolve, reject) => {
    account().then(account => {
      myContract.addSource(account[i], source, { from: account[0] }, (err) => { //where account[0] is the contract owner address
        if (err === null) {
            console.log(account[i], source, " Added to Whitelist\n");
            resolve();
          } else {
            console.log(account[i], " FAILED\n");
            reject(err);
          }
        });
      });
    });
  }

exports.resetShadowCounter = (ticker) => {
  return new Promise ( (resolve,reject) => {
    account().then(account => {
      myContract.resetShadowCounter(ticker, {from : account[0]}, (err) => {
        if (err === null) {
          console.log("reset ShadowCounter for ", ticker);
          resolve();
        } else {
          reject(err);
        }
      });
    });
  });
}

//function to receive public keys of passed in private keys
const account = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err === null) {
      resolve(accounts);
      } else {
      reject(err);
      }
    });
  });
};

//updateStock function
exports.updateStock = (ticker, price, i) => {
  return new Promise((resolve, reject) => {
    account().then(account => {
      myContract.updateStock(ticker, price, { from: account[i] },
         (err, res) => {
          console.log("attempt updateStock parameters: ", ticker, price, { from: account[i]})
          if (err === null) {
            resolve(res);
          } else {
            console.log(err)
            reject(err);
          }
        }
      );
    }).catch(console.error, async () => { console.log("error from ", i)});
  });
};

//necessary to stop Infura HDWalletProvider;
//provider.engine.stop();
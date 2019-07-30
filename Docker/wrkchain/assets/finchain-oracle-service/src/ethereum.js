require('dotenv').config({ path: 'C:/Users/Waleed Elsakka/Documents/Bounties/finchain-demo/.env'});

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

//research how to create arrays and abi strings for process.env
var privateKeys = [
  "cbb3de0ea413043e7ae615115e01d3435a7e2d66728f6739006fa5fe95e69898",
  "226cd6688ec379ef14ae04e9893e96c9adc612bd4f5360d2cb3c4380f9fa612c",
  "62eff7207e271faea97fe8d2d7ae12093c7cfe43b9e20ffd57232bf42f5cc899",
  "5d0929559ea34a21cfece4183400ebfbb049f7c8a7cb251b61a4b6cde399ef42"
];

const abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "stocks",
    "outputs": [
      {
        "name": "ticker",
        "type": "string"
      },
      {
        "name": "price",
        "type": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "name": "sourceID",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "whiteList",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "threshold",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "oracleArr",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "noOfStocks",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_threshold",
        "type": "uint256"
      },
      {
        "name": "_noOfStocks",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_ticker",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_id",
        "type": "address"
      }
    ],
    "name": "stockData",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_ticker1",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_price1",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_ticker2",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_price2",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_ticker3",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_price3",
        "type": "uint256"
      }
    ],
    "name": "discrepancy",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_ticker",
        "type": "string"
      },
      {
        "name": "_price",
        "type": "uint256"
      },
      {
        "name": "i",
        "type": "uint256"
      }
    ],
    "name": "updateStock",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_source",
        "type": "address"
      }
    ],
    "name": "addSource",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "readStockData",
    "outputs": [
      {
        "components": [
          {
            "name": "ticker",
            "type": "string"
          },
          {
            "name": "price",
            "type": "uint256"
          },
          {
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "name": "sourceID",
            "type": "address"
          }
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_threshold",
        "type": "uint256"
      }
    ],
    "name": "configureErrorMargins",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

//Infura HDWalletProvider, passes in array of keys, RPC_port (or URL), array index to start at, and number of keys in array
const provider = new HDWalletProvider(privateKeys, process.env.WRKCHAIN_RPC_PORT , 0 , 4);
//utilizing web3 protocol to call contract functions
const web3 = new Web3(provider);
//instantiation of contract at its address and with abi
const myContract = web3.eth.contract(abi).at(process.env.CONTRACT_ADDRESS);

//addSource function
exports.addSource = (i) => {
  return new Promise( (resolve, reject) => {
    account().then(account => {
      myContract.addSource(account[i], { from: account[0] }, (err) => { //where account[0] is the contract owner address
        if (err === null) {
            console.log(account[i], " Added to Whitelist\n");
            resolve();
          } else {
            console.log(account[i], " FAILED\n");
            reject(err);
          }
        });
      }).catch(err => reject(err));
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
exports.updateStock = (ticker, price, index) => {
  return new Promise((resolve, reject) => {
    account().then(account => {
      myContract.updateStock(ticker, price, index, { from: account[0] },
         (err, res) => {
          if (err === null) {
            resolve(res);
          } else {
            console.log("nah")
            reject(err);
          }
        }
      );
    }).catch(error => reject(error));
  });
};


exports.logEvent = () => {
  return new Promise((resolve, reject) => {
    myContract.discrepancy(function (result,error) {
      if (!error){
        console.log(result);
        resolve(result);
      }
    });
  });
}

//functions to implement
//const readStockData;
//const changeThreshold;

//necessary to stop Infura HDWalletProvider; Good for testing, might not need it for actual deployment
provider.engine.stop();
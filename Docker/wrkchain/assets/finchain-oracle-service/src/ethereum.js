require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const stocksAbi = JSON.parse(process.env.FINCHAIN_ORACLE_ABI);

//Infura HDWalletProvider, passes in array of keys, RPC_port (or URL), array index to start at, and number of keys in array
const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.WRKCHAIN_WEB3_PROVIDER_URL, 0, 20);
//utilizing web3 protocol to call contract functions
const web3 = new Web3(provider);
//instantiation of contract at its address and with abi
const stocksContract = web3.eth.contract(stocksAbi).at(process.env.CONTRACT_ADDRESS);
exports.dis = stocksContract.discrepancy({}, {
    fromBlock: 0,
    toBlock: 'latest'
});
exports.data = stocksContract.stockData();

const cryptosAbi = JSON.parse(process.env.CRYPTO_ORACLE_ABI);
const cryptosContract = web3.eth.contract(cryptosAbi).at(process.env.CRYPTO_CONTRACT_ADDRESS);


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

/**
 * STOCKS
 */

//addStocksSource function
exports.addStocksSource = (i, source) => {
    return new Promise((resolve, reject) => {
        account().then(account => {
            stocksContract.addSource(account[i], source, {from: account[0]}, (err) => { //where account[0] is the contract owner address
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


//updateStock function
exports.updateStock = (ticker, price, i) => {
    return new Promise((resolve, reject) => {
        account().then(account => {
            stocksContract.updateStock(ticker, price, {from: account[i]},
                (err, res) => {
                    console.log("attempt updateStock parameters: ", ticker, price, {from: account[i]})
                    if (err === null) {
                        resolve(res);
                    } else {
                        console.log(err)
                        reject(err);
                    }
                }
            );
        }).catch(console.error, async () => {
            console.log("error from ", i)
        });
    });
};

//setStockThreshold function
exports.setStockThreshold = (threshold) => {
    return new Promise((resolve, reject) => {
        account().then(account => {
            stocksContract.setThreshold(threshold, {from: account[0]}, (err) => { //where account[0] is the contract owner address
                if (err === null) {
                    console.log("Threshold set to:", threshold);
                    resolve();
                } else {
                    console.log("FAILED")
                    console.log(err);
                    reject(err);
                }
            });
        });
    });
}


/**
 * CRYPTO
 */

//addCryptoSource function
exports.addCryptoSource = (i, source) => {
    return new Promise((resolve, reject) => {
        account().then(account => {
            cryptosContract.addSource(account[i], source, {from: account[0]}, (err) => { //where account[0] is the contract owner address
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


//updateCryptoTicker function
exports.updateCryptoTicker = (ticker, price, timestamp, i) => {
    return new Promise((resolve, reject) => {
        account().then(account => {
            cryptosContract.updateCurrency(ticker, price, timestamp, {from: account[i]},
                (err, res) => {
                    console.log("attempt updateCurrency parameters: ", ticker, price, timestamp, {from: account[i]})
                    if (err === null) {
                        resolve(res);
                    } else {
                        console.log(err)
                        reject(err);
                    }
                }
            );
        }).catch(console.error, async () => {
            console.log("error from ", i)
        });
    });
};

//setCryptoThreshold function
exports.setCryptoThreshold = (threshold) => {
    return new Promise((resolve, reject) => {
        account().then(account => {
            cryptosContract.setThreshold(threshold, {from: account[0]}, (err) => { //where account[0] is the contract owner address
                if (err === null) {
                    console.log("Crypto Threshold set to:", threshold);
                    resolve();
                } else {
                    console.log("FAILED")
                    console.log(err);
                    reject(err);
                }
            });
        });
    });
}
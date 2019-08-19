require("dotenv").config();
var express = require('express');
var app = express();
var ether = require('../finchain-oracle-service/src/ethereum.js');

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/',express.static(__dirname + '/public'));

var WRKCHAIN_ROOT_ABI=[{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_addressesToRemove","type":"address[]"}],"name":"removeAuthAddresses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_newAuthAddresses","type":"address[]"}],"name":"addAuthAddresses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_authAddresses","type":"address[]"},{"name":"_genesisHash","type":"bytes32"}],"name":"registerWrkChain","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"uint256"}],"name":"getNumBlocksSubmitted","outputs":[{"name":"numBlocksSubmitted_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"wrkchainList","outputs":[{"name":"lastBlock","type":"uint256"},{"name":"genesisHash","type":"bytes32"},{"name":"isWrkchain","type":"bool"},{"name":"owner","type":"address"},{"name":"numBlocksSubmitted","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_height","type":"uint256"},{"name":"_hash","type":"bytes32"},{"name":"_parentHash","type":"bytes32"},{"name":"_receiptRoot","type":"bytes32"},{"name":"_txRoot","type":"bytes32"},{"name":"_stateRoot","type":"bytes32"},{"name":"_blockSigner","type":"address"}],"name":"recordHeader","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_address","type":"address"}],"name":"isAuthorisedAddress","outputs":[{"name":"_isAuthorised","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"uint256"}],"name":"getGenesis","outputs":[{"name":"genesisHash_","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_newOwner","type":"address"}],"name":"changeWrkchainOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"uint256"}],"name":"getLastRecordedBlockNum","outputs":[{"name":"lastBlock_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_wrkchainRegDeposit","type":"uint256"},{"name":"_minBlocksForDepositReturn","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_height","type":"uint256"},{"indexed":true,"name":"_hash","type":"bytes32"},{"indexed":false,"name":"_parentHash","type":"bytes32"},{"indexed":false,"name":"_receiptRoot","type":"bytes32"},{"indexed":false,"name":"_txRoot","type":"bytes32"},{"indexed":false,"name":"_stateRoot","type":"bytes32"},{"indexed":false,"name":"_blockSigner","type":"address"}],"name":"RecordHeader","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":false,"name":"_genesisHash","type":"bytes32"}],"name":"RegisterWrkChain","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"LogFallbackFunctionCalled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_owner","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"WRKChainDepositRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_authorisedBy","type":"address"},{"indexed":false,"name":"_address","type":"address"}],"name":"AuthoriseNewAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_removedBy","type":"address"},{"indexed":false,"name":"_address","type":"address"}],"name":"RemoveAuthorisedAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":false,"name":"_old","type":"address"},{"indexed":false,"name":"_new","type":"address"}],"name":"WRKChainOwnerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_owner","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"WRKChainDepositPaid","type":"event"}];
var WRKCHAIN_ROOT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000087";

var ticker1, ticker2, ticker3;
var price1, price2, price3;
var date;
var txhash;
var isFound = false;

ether.dis.watch(function (error,result) {
    if (!error){
        console.log(" Event Found ! \n")
        isFound = true;
        ticker1 = result.args._ticker1;
        ticker2 = result.args._ticker2;
        ticker3 = result.args._ticker3;
        price1 = result.args._price1;
        price2 = result.args._price2;
        price3 = result.args._price3;
        date = new Date();
        txhash = result.transactionHash;
    }
    else console.log(error);
  });

// event listener page
app.get('/', function(req, res) {
    res.render('pages/listener',{
        WRKCHAIN_WEB3_PROVIDER_URL: process.env.WRKCHAIN_WEB3_PROVIDER_URL,
        MAINCHAIN_WEB3_PROVIDER_URL: process.env.MAINCHAIN_WEB3_PROVIDER_URL,
        MAINCHAIN_EXPLORER_URL: process.env.MAINCHAIN_EXPLORER_URL,
        WRKCHAIN_ROOT_CONTRACT_ADDRESS: WRKCHAIN_ROOT_CONTRACT_ADDRESS,
        WRKCHAIN_ROOT_ABI: WRKCHAIN_ROOT_ABI,
        WRKCHAIN_NAME: process.env.WRKCHAIN_NAME,
        FOUND : isFound,
        UPDATE_TIME: process.env.UPDATE_TIME / 1000,
        TICKER1 : ticker1,
        PRICE1 : price1,
        TICKER2 : ticker2,
        PRICE2 : price2,
        TICKER3 : ticker3,
        PRICE3 : price3,
        TXHASH : txhash,
        DATE : date
    });
});

const PORT = '9090'
app.listen(PORT);

console.log( "====================================");
console.log( "= FINCHAIN UI READY =");
console.log( "= -------------------------------- =");
console.log( "=                                  =");
console.log( "= open:                            =");
console.log( "= http://localhost:" + PORT + "            =");
console.log( "=                                  =");
console.log( "====================================");

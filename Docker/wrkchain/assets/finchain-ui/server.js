require("dotenv").config();
var express = require('express');
var app = express();

if (process.env.LEGACY_WRKCHAIN_ROOT == 'true') {
    var WRKCHAIN_ROOT_ABI=[{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_addressesToRemove","type":"address[]"}],"name":"removeAuthAddresses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_newAuthAddresses","type":"address[]"}],"name":"addAuthAddresses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_authAddresses","type":"address[]"},{"name":"_genesisHash","type":"bytes32"}],"name":"registerWrkChain","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"uint256"}],"name":"getNumBlocksSubmitted","outputs":[{"name":"numBlocksSubmitted_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"wrkchainList","outputs":[{"name":"lastBlock","type":"uint256"},{"name":"genesisHash","type":"bytes32"},{"name":"isWrkchain","type":"bool"},{"name":"owner","type":"address"},{"name":"numBlocksSubmitted","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_height","type":"uint256"},{"name":"_hash","type":"bytes32"},{"name":"_parentHash","type":"bytes32"},{"name":"_receiptRoot","type":"bytes32"},{"name":"_txRoot","type":"bytes32"},{"name":"_stateRoot","type":"bytes32"},{"name":"_blockSigner","type":"address"}],"name":"recordHeader","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_address","type":"address"}],"name":"isAuthorisedAddress","outputs":[{"name":"_isAuthorised","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"uint256"}],"name":"getGenesis","outputs":[{"name":"genesisHash_","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"uint256"},{"name":"_newOwner","type":"address"}],"name":"changeWrkchainOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"uint256"}],"name":"getLastRecordedBlockNum","outputs":[{"name":"lastBlock_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_wrkchainRegDeposit","type":"uint256"},{"name":"_minBlocksForDepositReturn","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_height","type":"uint256"},{"indexed":true,"name":"_hash","type":"bytes32"},{"indexed":false,"name":"_parentHash","type":"bytes32"},{"indexed":false,"name":"_receiptRoot","type":"bytes32"},{"indexed":false,"name":"_txRoot","type":"bytes32"},{"indexed":false,"name":"_stateRoot","type":"bytes32"},{"indexed":false,"name":"_blockSigner","type":"address"}],"name":"RecordHeader","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":false,"name":"_genesisHash","type":"bytes32"}],"name":"RegisterWrkChain","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"LogFallbackFunctionCalled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_owner","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"WRKChainDepositRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_authorisedBy","type":"address"},{"indexed":false,"name":"_address","type":"address"}],"name":"AuthoriseNewAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_removedBy","type":"address"},{"indexed":false,"name":"_address","type":"address"}],"name":"RemoveAuthorisedAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":false,"name":"_old","type":"address"},{"indexed":false,"name":"_new","type":"address"}],"name":"WRKChainOwnerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"uint256"},{"indexed":true,"name":"_owner","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"WRKChainDepositPaid","type":"event"}];
} else {
    var WRKCHAIN_ROOT_ABI=[{"constant":false,"inputs":[{"name":"_chainId","type":"bytes32"},{"name":"_authAddresses","type":"address[]"},{"name":"_genesisHash","type":"bytes32"}],"name":"registerWrkChain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"bytes32"},{"name":"_height","type":"uint256"},{"name":"_hash","type":"bytes32"},{"name":"_parentHash","type":"bytes32"},{"name":"_receiptRoot","type":"bytes32"},{"name":"_txRoot","type":"bytes32"},{"name":"_stateRoot","type":"bytes32"}],"name":"recordHeader","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"bytes32"}],"name":"getNumBlocksSubmitted","outputs":[{"name":"numBlocksSubmitted_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"bytes32"}],"name":"getGenesis","outputs":[{"name":"genesisHash_","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"bytes32"},{"name":"_address","type":"address"}],"name":"isAuthorisedAddress","outputs":[{"name":"isAuthorised_","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"bytes32"},{"name":"_addressesToRemove","type":"address[]"}],"name":"removeAuthAddresses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"bytes32"}],"name":"getLastBlock","outputs":[{"name":"lastHash_","type":"bytes32"},{"name":"lastParentHash_","type":"bytes32"},{"name":"lastReceiptRoot_","type":"bytes32"},{"name":"lastTxRoot_","type":"bytes32"},{"name":"lastStateRoot_","type":"bytes32"},{"name":"lastSubmissionTime_","type":"uint256"},{"name":"lastSubmittedBy_","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"wrkchainList","outputs":[{"name":"genesisHash","type":"bytes32"},{"name":"isWrkchain","type":"bool"},{"name":"numAuthAddresses","type":"uint256"},{"name":"owner","type":"address"},{"name":"numBlocksSubmitted","type":"uint256"},{"name":"numHistoricalBlocksSubmitted","type":"uint256"},{"name":"lastBlock","type":"uint256"},{"name":"lastHash","type":"bytes32"},{"name":"lastParentHash","type":"bytes32"},{"name":"lastReceiptRoot","type":"bytes32"},{"name":"lastTxRoot","type":"bytes32"},{"name":"lastStateRoot","type":"bytes32"},{"name":"lastSubmissionTime","type":"uint256"},{"name":"lastSubmittedBy","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"changeWrkchainOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"bytes32"}],"name":"getLastRecordedBlockNum","outputs":[{"name":"lastBlock_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_chainId","type":"bytes32"}],"name":"chainExists","outputs":[{"name":"chainExists_","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_chainId","type":"bytes32"},{"name":"_newAuthAddresses","type":"address[]"}],"name":"addAuthAddresses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"bytes32"},{"indexed":true,"name":"_height","type":"uint256"},{"indexed":true,"name":"_hash","type":"bytes32"},{"indexed":false,"name":"_parentHash","type":"bytes32"},{"indexed":false,"name":"_receiptRoot","type":"bytes32"},{"indexed":false,"name":"_txRoot","type":"bytes32"},{"indexed":false,"name":"_stateRoot","type":"bytes32"},{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_submittedBy","type":"address"}],"name":"RecordHeader","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"bytes32"},{"indexed":true,"name":"_height","type":"uint256"},{"indexed":true,"name":"_hash","type":"bytes32"},{"indexed":false,"name":"_parentHash","type":"bytes32"},{"indexed":false,"name":"_receiptRoot","type":"bytes32"},{"indexed":false,"name":"_txRoot","type":"bytes32"},{"indexed":false,"name":"_stateRoot","type":"bytes32"},{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_submittedBy","type":"address"}],"name":"RecordHeaderHistorical","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"bytes32"},{"indexed":false,"name":"_genesisHash","type":"bytes32"},{"indexed":false,"name":"_timestamp","type":"uint256"}],"name":"RegisterWrkChain","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"LogFallbackFunctionCalled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"bytes32"},{"indexed":true,"name":"_authorisedBy","type":"address"},{"indexed":false,"name":"_address","type":"address"}],"name":"AuthoriseNewAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"bytes32"},{"indexed":true,"name":"_removedBy","type":"address"},{"indexed":false,"name":"_address","type":"address"}],"name":"RemoveAuthorisedAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_chainId","type":"bytes32"},{"indexed":false,"name":"_old","type":"address"},{"indexed":false,"name":"_new","type":"address"}],"name":"WRKChainOwnerChanged","type":"event"}];
}
var WRKCHAIN_ROOT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000087";

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/',express.static(__dirname + '/public'));

let trackedTickers = process.env.TRACKED_TICKERS.split(",");

// event listener page
app.get('/', function(req, res) {
    let selectedTicker = req.query.ticker;
    if(selectedTicker === undefined || selectedTicker === null) {
        selectedTicker = trackedTickers[0];
    }
    res.render('pages/listener',{
        WRKCHAIN_NAME: process.env.WRKCHAIN_NAME,
        WRKCHAIN_WEB3_PROVIDER_URL: process.env.WRKCHAIN_WEB3_PROVIDER_URL,
        FINCHAIN_ORACLE_ABI: JSON.parse(process.env.FINCHAIN_ORACLE_ABI),
        FINCHAIN_ORACLE_CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
        UPDATE_TIME: process.env.UPDATE_TIME / 1000,
        TRACKED_TICKERS: trackedTickers,
        TICKER: selectedTicker,
        THRESHOLD: process.env.THRESHOLD,
        TRADING: req.query.trading
    });
});

// wrkoracle watcher page
app.get('/wrkoracle', function(req, res) {
    res.render('pages/wrkoracle',{
        MAINCHAIN_WEB3_PROVIDER_URL: process.env.MAINCHAIN_WEB3_PROVIDER_URL,
        WRKCHAIN_ROOT_ABI: WRKCHAIN_ROOT_ABI,
        WRKCHAIN_ROOT_CONTRACT_ADDRESS: WRKCHAIN_ROOT_CONTRACT_ADDRESS,
        MAINCHAIN_EXPLORER_URL: process.env.MAINCHAIN_EXPLORER_URL,
        WRKCHAIN_ROOT_WRITE_TIMEOUT: process.env.WRKCHAIN_ROOT_WRITE_TIMEOUT,
        WRKCHAIN_NAME: process.env.WRKCHAIN_NAME,
        WRKCHAIN_NETWORK_ID: process.env.WRKCHAIN_NETWORK_ID,
        LEGACY_WRKCHAIN_ROOT: process.env.LEGACY_WRKCHAIN_ROOT
    });
});

// block validation page
app.get('/validate', function(req, res) {
    res.render('pages/validate',{
        WRKCHAIN_WEB3_PROVIDER_URL: process.env.WRKCHAIN_WEB3_PROVIDER_URL,
        MAINCHAIN_WEB3_PROVIDER_URL: process.env.MAINCHAIN_WEB3_PROVIDER_URL,
        WRKCHAIN_ROOT_CONTRACT_ADDRESS: WRKCHAIN_ROOT_CONTRACT_ADDRESS,
        WRKCHAIN_ROOT_ABI: WRKCHAIN_ROOT_ABI,
        BLOCK_NUM: req.query.block,
        WRKCHAIN_NAME: process.env.WRKCHAIN_NAME,
        WRKCHAIN_NETWORK_ID: process.env.WRKCHAIN_NETWORK_ID,
        LEGACY_WRKCHAIN_ROOT: process.env.LEGACY_WRKCHAIN_ROOT
    });
});

const PORT = process.env.WRKCHAIN_VALIDATOR_SERVICE_PORT
app.listen(PORT);

console.log( "====================================");
console.log( "= FINCHAIN UI READY =");
console.log( "= -------------------------------- =");
console.log( "=                                  =");
console.log( "= open:                            =");
console.log( "= http://localhost:" + PORT + "            =");
console.log( "=                                  =");
console.log( "====================================");

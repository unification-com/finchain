require("dotenv").config();
const Web3 = require('web3');
var express = require('express');
var app = express();
const InputDataDecoder = require('ethereum-input-data-decoder');

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/',express.static(__dirname + '/public'));

let trackedTickers = process.env.TRACKED_TICKERS.split(",");

app.get('/', function(req, res) {
    res.render('pages/listener',{
        WRKCHAIN_NAME: process.env.WRKCHAIN_NAME,
        WRKCHAIN_WEB3_PROVIDER_URL: process.env.WRKCHAIN_WEB3_PROVIDER_URL,
        FINCHAIN_ORACLE_ABI: JSON.parse(process.env.FINCHAIN_ORACLE_ABI),
        FINCHAIN_ORACLE_CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
        UPDATE_TIME: process.env.UPDATE_TIME / 1000,
        TRACKED_TICKERS: trackedTickers,
        TICKER: trackedTickers[0],
        THRESHOLD: process.env.THRESHOLD,
        TRADING: 'open',
        WRKCHAIN_EXPLORER_URL: process.env.WRKCHAIN_EXPLORER_URL,
        TIMESPAN: 24
    });
});

// event listener page
app.get('/track/:ticker?/:trading?/:timespan?', function(req, res) {
    let selectedTicker = req.params.ticker;
    if(selectedTicker === undefined || selectedTicker === null) {
        selectedTicker = trackedTickers[0];
    }
    let timespan = 24;
    if(req.params.timespan !== undefined) {
        timespan = parseInt(req.params.timespan);
    }

    switch(timespan) {
        case 24:
        case 48:
        case 72:
        case 96:
        case 168:
            break;
        default:
            timespan = 24;
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
        TRADING: req.params.trading,
        WRKCHAIN_EXPLORER_URL: process.env.WRKCHAIN_EXPLORER_URL,
        TIMESPAN: timespan
    });
});



// wrkoracle watcher page
app.get('/wrkoracle', function(req, res) {
    res.render('pages/wrkoracle',{
        MAINCHAIN_REST_URL: process.env.MAINCHAIN_REST_URL,
        MAINCHAIN_EXPLORER_URL: process.env.MAINCHAIN_EXPLORER_URL,
        WRKCHAIN_WRITE_TIMEOUT: process.env.WRKCHAIN_WRITE_TIMEOUT,
        WRKCHAIN_NAME: process.env.WRKCHAIN_NAME,
        WRKCHAIN_NETWORK_ID: process.env.WRKCHAIN_NETWORK_ID,
        WRKCHAIN_EXPLORER_URL: process.env.WRKCHAIN_EXPLORER_URL,
        WRKCHAIN_ID: process.env.WRKCHAIN_ID,
        WRKCHAIN_OWNER: process.env.WRKCHAIN_OWNER,
    });
});


// block validation page
app.get('/validate/:block?', function(req, res) {
    res.render('pages/validate',{
        WRKCHAIN_WEB3_PROVIDER_URL: process.env.WRKCHAIN_WEB3_PROVIDER_URL,
        MAINCHAIN_REST_URL: process.env.MAINCHAIN_REST_URL,
        MAINCHAIN_EXPLORER_URL: process.env.MAINCHAIN_EXPLORER_URL,
        BLOCK_NUM: req.params.block,
        WRKCHAIN_NAME: process.env.WRKCHAIN_NAME,
        WRKCHAIN_NETWORK_ID: process.env.WRKCHAIN_NETWORK_ID,
        WRKCHAIN_EXPLORER_URL: process.env.WRKCHAIN_EXPLORER_URL,
        WRKCHAIN_ID: process.env.WRKCHAIN_ID,
        WRKCHAIN_OWNER: process.env.WRKCHAIN_OWNER,
    });
});

app.get('/decode', function(req, res) {

    const result = decoder.decodeData(req.query.d);

    let formattedResult = {};
    formattedResult['method'] = result.method;
    formattedResult['types'] = [];
    formattedResult['inputs'] = [];
    formattedResult['names'] = [];

    for(i=0; i< result.types.length; i++) {
        let theType = result.types[i];
        formattedResult['types'].push(result.types[i]);
        formattedResult['names'].push(result.names[i]);

        switch(theType) {
            case 'uint256':
                let n = new Web3.utils.BN(result.inputs[i]);
                formattedResult['inputs'].push(n.toString());
                break;
            case 'bytes32':
                formattedResult['inputs'].push(Web3.utils.bytesToHex(result.inputs[i]));
                break;
            case 'address':
                formattedResult['inputs'].push("0x" + result.inputs[i]);
                break;
            default:
                formattedResult['inputs'].push(result.inputs[i]);
                break;
        }

    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(formattedResult));
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

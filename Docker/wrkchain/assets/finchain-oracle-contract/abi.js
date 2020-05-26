const fs = require('fs');

const ContractJsonPath = './build/contracts/Stocks.json'

function main() {
    let args = process.argv.slice(2);
    let contract = args[1];
    let contractJsonPath = './build/contracts/Stocks.json';
    if(contract === 'crypto') {
        contractJsonPath = './build/contracts/Crypto.json';
    }

    let contractJson = JSON.parse(fs.readFileSync(contractJsonPath, 'utf8'));

    switch (args[0]) {
       case 'abi':
       default:
           abi(contractJson);
           break;
       case 'addr':
           contract_address(contractJson, args[2]);
           break;
    }
}

function abi(contract) {
    console.log(JSON.stringify(contract.abi));
}

function contract_address(contract, networkId) {
    console.log(contract.networks[networkId].address);
}

main();

require("dotenv").config();

//can replace imports with require, but does not entirely matter
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from "web3";

//If process.env does not work, just replace with hard coded values
const web3 = new Web3(new HDWalletProvider(
    process.env.PRIVATE_KEY,
    process.env.WRKCHAIN_WEB3_PROVIDER_URL
    ));
const abi = JSON.parse(
    process.env.FINCHAIN_ORACLE_ABI
    );
const address = process.env.FINCHAIN_CONTRACT_ADDRESS;
const contract = web3.eth.contract(abi).at(address);

//code to get accounts from web3 variable, can change to modular functions rather than promises
const account = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err === null) {
      console.log(accounts[0]);
        resolve(accounts[0]);
      } else {
        reject(err);
      }
    });
  });
};

//block of code using contract var to call smart contract functions and passes in the proper parameters
//For finchain, the function to call would be updateStock, which in turn will call the other 
//private functions once certain criteria is met 
export const updateWeather = ({ weatherDescription, temperature, humidity, visibility, pressure, sunrise, sunset }) => {
  return new Promise((resolve, reject) => {
    account().then(account => {
      contract.updateWeather(weatherDescription, temperature, humidity, visibility, pressure, sunrise, sunset,
        { from: account }, (err, res) => {
          if (err === null) {
            resolve(res);
          } else {
            reject(err);
          }
        }
      );
    }).catch(error => reject(error));
  });
};

export const weatherUpdate = (callback) => {
  contract.WeatherUpdate((error, result) => callback(error, result));
};
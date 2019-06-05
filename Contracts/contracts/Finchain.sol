pragma solidity >0.5.0;

contract Finchain {

    //whitelisted oracle address, could have two oracles simultaneously call contract if another address
    //is whitelisted
    address public oracleAddress;

    //struct to store Stock data
     struct Stock {
         string ticker;
         uint256 price;
         uint timestamp;
         bytes32 sourceID;
     }

    //event to emit stock data
     event stockData(
         address indexed _from,
         string indexed _ticker,
         uint256 _price,
         uint _timestamp,
         bytes32 _id
    );
    
    //event shows which stock has a possible arbitrage opportunity at a specified price
    event discrepency(address indexed _from, string indexed _ticker, uint256 price);

     mapping(string => Stock) stocks; //mapping of Stock structs
     mapping(string => uint) sources; //mapping of sourceID's
     Stock[] public stockArr; //array to iterate through stock mapping


    constructor (address _oracleAddress) public{
        oracleAddress = _oracleAddress;
    }

     function updateStock (string memory _ticker, uint256 _price, uint _timestamp, bytes32  _sourceID) public payable {
         require (msg.sender == oracleAddress, "Address not Authorized"); //Only oracle service can add API data

         stocks[_ticker].ticker = _ticker;
         stocks[_ticker].price = _price;
         stocks[_ticker].timestamp = _timestamp;
         stocks[_ticker].sourceID = _sourceID;

         stockArr.push(stocks[_ticker]); //add to stock array
         
         emit stockData(msg.sender, _ticker, _price, _timestamp, _sourceID);

     }

     function addSource(string memory source) public {
         //Figure out how to add sources from oracle to mapping
         //presumed to come in as JSON format
     }

     function configureErrorMargins() public {
         //inputs determined once metrics determined
     }

     function compareStocks() private {
         //should take an array as input, emit event between stocks of different sources
     }

}
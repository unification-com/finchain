pragma solidity >0.5.0;
pragma experimental ABIEncoderV2 ; //To remove or not remove?

contract Finchain {

    address owner;

     modifier onlyOracle() {
     require (oracleAddresses[msg.sender] == true,
        "Only owner can call this function.");
      _;
     }

    //struct to store Stock data
     struct Stock {
         string ticker;
         uint256 price;
         uint timestamp;
         address sourceID;
     }

    //event to emit stock data
     event stockData(
         address indexed _from,
         string indexed _ticker,
         uint256 _price,
         uint _timestamp,
         address _id
    );

    //event shows which stock has a possible arbitrage opportunity at a specified price
    event discrepency(
        address _source1,
        address source2,
        string _ticker,
        uint256 price
    );

     mapping (address => bool) oracleAddresses; //whitelisted oracle addresses
     mapping(string => Stock) stocks; //mapping of Stock structs
     Stock[] public stockArr; //array to iterate through stock mapping


     constructor (address[] memory _oracleAddresses) public {
        owner = msg.sender;

        for (uint i = 0; i < _oracleAddresses.length; i++) {
            oracleAddresses[_oracleAddresses[i]] = true;
    }
  }

     function updateStock (
         string memory _ticker,
         uint256 _price,
         uint _timestamp,
         address _sourceID
         )
         public payable onlyOracle{
         
         stocks[_ticker].ticker = _ticker;
         stocks[_ticker].price = _price;
         stocks[_ticker].timestamp = _timestamp;
         stocks[_ticker].sourceID = _sourceID;

         stockArr.push(stocks[_ticker]); //add to stock array
     }

     function readStockData(string memory _ticker) public returns (Stock memory _stock){
         return stocks[_ticker];
     }

     function addSource(address source) private {
         require (msg.sender == owner,
            "Only owner can call this function.");

         oracleAddresses[source] = true;
     }

     function configureErrorMargins() public {
         //inputs determined once metrics determined
     }

     function compareStocks() public {
         //should take an array as input, emit event between stocks of different sources
     }

}
pragma solidity >0.5.0;
pragma experimental ABIEncoderV2 ; //To remove or not remove?

contract Finchain {

     address owner;
     uint shadowCounter; //might be helpful 

     modifier whiteList() {
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
         string _ticker,
         uint256 _price,
         uint _timestamp,
         address _id
    );

    //event shows which stock has a possible arbitrage opportunity at a specified price
     event discrepency(
         address _source1,
         address _source2,
         string _ticker,
         uint256 _price
    );

     mapping (address => bool) oracleAddresses; //whitelisted oracle addresses
     mapping(address => Stock[]) stocks; //mapping of oracle Addresses to stock arrays
     Stock[] public stockArr; //array to iterate through stock mapping, NOT NEEDED?


     constructor (address[] memory _oracleAddresses) public {
        owner = msg.sender;

        for (uint i = 0; i < _oracleAddresses.length; i++) {
            oracleAddresses[_oracleAddresses[i]] = true;
    }
        oracleAddresses[owner] = true;
  }

     function updateStock (
         string memory _ticker,
         uint256 _price,
         uint _timestamp,
         address _sourceID,
         uint i // array index, to be passed by nodeJS process
         )
         public whiteList{

         stocks[msg.sender][i].ticker = _ticker;
         stocks[msg.sender][i].price = _price;
         stocks[msg.sender][i].timestamp = _timestamp;
         stocks[msg.sender][i].sourceID = _sourceID;

     }

     function readStockData()
        public whiteList
        view
        returns (Stock[] memory)
        { return stocks[msg.sender]; }

     function addSource(address source) private {
         require (msg.sender == owner,
            "Only owner can call this function.");

         oracleAddresses[source] = true;
     }

     function configureErrorMargins() public returns (bool) {
         //inputs determined once metrics determined
         //ex: price difference is greater than 7%, return true
     }

     function compareStocks(address _source1, address _source2) public {
         //should take an array as input, emit event between stocks of different sources
         uint k = 0; //counter
         for (k; k < 5 ; ++k){
             uint p1 = stocks[_source1][k].price;
             uint p2 = stocks[_source2][k].price;
             /*
             make some call to configureErrorMargins or 
             new function called error margins to compare the stock prices
             by some metric (perhaps just price difference)
             */
             
             //if errorMargins = true { emit discrepency( , , , ); }
         }
         
         emit discrepency();
     }

}
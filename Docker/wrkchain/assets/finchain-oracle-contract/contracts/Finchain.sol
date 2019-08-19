pragma solidity >= 0.4.22;
//pragma experimental ABIEncoderV2 ; //To remove or not remove?

contract Finchain {
     address public owner;
     uint public threshold;
     uint public noOfStocks;
     uint shadowCounter; //used to keep track of how many of the oracles updated their stocks

     modifier isAuthorized() {
     require (whiteList[msg.sender] == true,
        "Only authorized addresses can call this function.");
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
         uint _timestamp
    );

    //event shows which stock has a possible arbitrage opportunity at a specified price
     event discrepancy(
         string _ticker1,
         uint256 _price1,
         string _ticker2,
         uint256 _price2,
         string _ticker3,
         uint256 _price3
    );

     mapping (address => bool) public whiteList; //whitelisted oracle addresses
     address[] public oracleArr; //array of oracle addresses
     /*
     Mapping of oracle Addresses to stock arrays
     This allocates an array of stock structs to every oracle address
     */
     mapping(address => Stock[]) public stocks;


     constructor (uint _threshold, uint _noOfStocks) public {
        owner = msg.sender;
        whiteList[owner] = true;
        threshold = _threshold;
        noOfStocks = _noOfStocks;
        shadowCounter = 0;
  }

     function updateStock (
         string memory _ticker,
         uint256 _price,
         uint i // array index, to be passed by nodeJS process
         )
         public {
         require (shadowCounter < 3, "Only three oracles currently permitted");

         stocks[msg.sender].push(Stock({ticker: _ticker, price: _price, timestamp: now, sourceID: msg.sender }));
         //emit stockData(msg.sender, _ticker, _price, now);

         if (i == (noOfStocks - 1)) shadowCounter++;

         if (shadowCounter >= 3){
             shadowCounter = 0;
             uint result = compareStocks(oracleArr[0], oracleArr[1], oracleArr[2]); //move on to next state
             if (result < 101) {
                emit discrepancy(
                    stocks[oracleArr[0]][result].ticker,
                    stocks[oracleArr[0]][result].price,
                    stocks[oracleArr[1]][result].ticker,
                    stocks[oracleArr[1]][result].price,
                    stocks[oracleArr[2]][result].ticker,
                    stocks[oracleArr[2]][result].price
                    );
                delete stocks[oracleArr[0]]; delete stocks[oracleArr[1]]; delete stocks[oracleArr[2]];
             } else {
                delete stocks[oracleArr[0]]; delete stocks[oracleArr[1]]; delete stocks[oracleArr[2]];
             }
         }
     }

     function compareStocks(address _source1, address _source2, address _source3) public returns (uint) {

         uint k; //counter
         for (k; k < noOfStocks; ++k){ //can be top 100 stocks
             uint p1 = stocks[_source1][k].price;
             uint p2 = stocks[_source2][k].price;
             uint p3 = stocks[_source3][k].price;

             bool result = errorMargins(p1, p2, p3);

             if (result == true) {
                 return k;
             }
         }
         return 101;
     }

    function errorMargins(uint _p1, uint _p2, uint _p3) public view returns (bool) {
        /*
        This function checks for a significant price difference
        for each stock between sources. The threshold level to emit an event is
        configured in the configureErrorMargins function
        */

        uint temp1 = min (_p1, _p2);
        uint temp2 = min (temp1, _p3);

        uint comp1 = ( ( (_p1 - temp2) * 100 )/ temp2 );
        uint comp2 = ( ( (_p2 - temp2) * 100 )/ temp2 );
        uint comp3 = ( ( (_p3 - temp2) * 100 )/ temp2 );

        if ( comp1 > threshold) return true;
        if ( comp2 > threshold) return true;
        if ( comp3 > threshold) return true;

        return false;

    }

     function addSource(address _source) public {
         require (msg.sender == owner,
            "Only owner can call this function.");

         whiteList[_source] = true;
         oracleArr.push(_source);
     }

     function resetShadow() public isAuthorized {
          shadowCounter = 0; 
          delete stocks[oracleArr[0]]; delete stocks[oracleArr[1]]; delete stocks[oracleArr[2]];
          }


     function configureErrorMargins(uint _threshold) public {
         require(msg.sender == owner, "Only the owner of this contract can modify values");
         threshold = _threshold;
     }

     //function to determine the smallest between two values. Used as a way to 
     //find the percent difference between two prices, and to avoid negative values

     function min(uint a, uint b) private pure returns (uint) {
         return a < b ? a : b;
    }

}
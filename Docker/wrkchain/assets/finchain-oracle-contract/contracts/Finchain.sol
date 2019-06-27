pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2 ; //To remove or not remove?

contract Finchain {
    
     address public owner;
     uint public threshold;
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
         uint _timestamp,
         address _id
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


     constructor (uint _threshold) public {
        owner = msg.sender;
        whiteList[owner] = true;
        threshold = _threshold;
  }

     function updateStock (
         string memory _ticker,
         uint256 _price,
         uint i // array index, to be passed by nodeJS process
         )
         public isAuthorized{
         require (shadowCounter < 3, "Only three oracles currently permitted");

         stocks[msg.sender].push(Stock({ticker: _ticker, price: _price, timestamp: now, sourceID: msg.sender }));
         
         if (i == 99) shadowCounter++;

         if (shadowCounter == 3){
             shadowCounter = 0;
             compareStocks(oracleArr[0], oracleArr[1], oracleArr[2]); //move on to next state
         }
     }

     function compareStocks(address _source1, address _source2, address _source3) private {
         
         uint k; //counter
         for (k; k < 1 ; ++k){ //k < 1 just as an example of 1 stock; Will be top 100 stocks
             uint p1 = stocks[_source1][k].price;
             uint p2 = stocks[_source2][k].price;
             uint p3 = stocks[_source3][k].price;
             
             bool result = errorMargins(p1, p2, p3);
             
             if (result == true){
                 emit discrepancy(
                    stocks[_source1][k].ticker,
                    stocks[_source1][k].price,
                    stocks[_source2][k].ticker,
                    stocks[_source2][k].price,
                    stocks[_source3][k].ticker,
                    stocks[_source3][k].price
                    ); }
                    
            
         }
         
         delete stocks[_source1]; delete stocks[_source2]; delete stocks[_source3];
     }
     
    function errorMargins(uint _p1, uint _p2, uint _p3) private view returns (bool) {
        /*
        This function checks for a significant price difference
        for each stock between sources. The threshold level to emit an event is
        configured in the configureErrorMargins function
        */
        
        uint temp1 = min (_p1, _p2);
        uint temp2 = min (temp1, _p3);
        
        uint comp1 = ( ( (_p1 - temp2) / temp2) * 100 );
        uint comp2 = ( ( (_p2 - temp2) / temp2) * 100 );
        uint comp3 = ( ( (_p3 - temp2) / temp2) * 100 );
        
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
    
     function readStockData()
        public isAuthorized
        view
        returns (Stock[] memory)
        { return stocks[msg.sender]; }


     function configureErrorMargins(uint _threshold) public {
         require(msg.sender == owner, "Only the owner of this contract can modify values");
         threshold = _threshold;
     }
     
     //function to determine the smallest between two values. Used as a way to 
     //find the percent difference between two prices, and to avoid negative
     //values
     function min(uint a, uint b) private pure returns (uint) {
         return a < b ? a : b;
    }

}
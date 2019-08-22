pragma solidity >= 0.4.22;

contract Finchain {
     address public owner;
     uint public threshold;

    modifier onlyOwner() {
     require (msg.sender == owner,
            "Only owner can call this function.");
      _;
     }

     modifier isAuthorized() {
     require (whiteList[msg.sender] == true,
        "Only authorized addresses can call this function.");
      _;
     }

     //struct to store Stock data
     struct Stock {
         uint256 price;
         uint timestamp;
     }

     //event to emit stock data
     event stockData(
         address indexed _from,
         string _ticker,
         uint256 _price,
         uint _timestamp,
         bytes32 indexed _tickerHash,
         string _source
    );

    //event shows which stock has a possible arbitrage opportunity at a specified price
     event discrepancy(
         string _ticker,
         uint256 _price1,
         uint256 _price2,
         uint256 _price3,
         uint _timestamp,
         bytes32 indexed _tickerHash,
         uint _threshold
    );

     mapping (address => bool) public whiteList; //whitelisted oracle addresses
     address[] public oracleArr; //array of oracle addresses
     mapping (address => string) public sources;
     mapping (bytes32 => uint) public shadowCounter;
     /*
     Mapping of oracle Addresses to stock arrays
     This allocates an array of stock structs to every oracle address
     */
     mapping(bytes32 => mapping(address => Stock)) stocks;

     constructor (uint _threshold) public {
        owner = msg.sender;
        whiteList[owner] = true;
        threshold = _threshold;
     }

     function updateStock (
         string memory _ticker,
         uint256 _price
         )
         public isAuthorized() {

         bytes32 tickerHash = keccak256(abi.encodePacked(_ticker));

         stocks[tickerHash][msg.sender] = Stock({price: _price, timestamp: now});

         emit stockData(msg.sender, _ticker, _price, now, tickerHash, sources[msg.sender]);

         shadowCounter[tickerHash] = shadowCounter[tickerHash] + 1;

         if(shadowCounter[tickerHash] == 3) {
             compareStocks(_ticker, tickerHash);
             shadowCounter[tickerHash] = 0;
         }
     }

    function resetShadowCounter(string memory _ticker) public isAuthorized() {
        bytes32 tickerHash = keccak256(abi.encodePacked(_ticker));
        shadowCounter[tickerHash] = 0;
    }

     function compareStocks(string memory _ticker, bytes32 tickerHash) public {

         uint p1 = stocks[tickerHash][oracleArr[0]].price;
         uint p2 = stocks[tickerHash][oracleArr[1]].price;
         uint p3 = stocks[tickerHash][oracleArr[2]].price;

         if(errorMargins(p1, p2, p3)) {
             emit discrepancy(
                 _ticker,
                 p1,
                 p2,
                 p3,
                 now,
                 tickerHash,
                 threshold
             );
         }
     }

    function errorMargins(uint _p1, uint _p2, uint _p3) public view returns (bool) {
        /*
        This function checks for a significant price difference
        for each stock between sources. The threshold level to emit an event is
        configured in the configureErrorMargins function
        */

        uint temp1 = min (_p1, _p2);
        uint temp2 = min (temp1, _p3);

        uint comp1 = _p1 - temp2;
        if ( comp1 >= threshold) return true;
        uint comp2 = _p2 - temp2;
        if ( comp2 >= threshold) return true;
        uint comp3 = _p3 - temp2;
        if ( comp3 >= threshold) return true;

        return false;

    }

     function addSource(address _oracle, string memory _source) public onlyOwner() {


         if(oracleArr.length < 3) {
             whiteList[_oracle] = true;
             oracleArr.push(_oracle);
             sources[_oracle] = _source;
         }
     }

    function setThreshold(uint _threshold) public onlyOwner() {
        require(_threshold > 0, "threshold must be > 0");
        threshold = _threshold;
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

    function getSource(address _oracle) public view returns (string memory) {
        return sources[_oracle];
    }
}
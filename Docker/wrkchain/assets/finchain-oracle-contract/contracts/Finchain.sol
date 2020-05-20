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
         address _oracle1,
         uint256 _price1,
         uint _timestamp1,
         string _source1,
         address _oracle2,
         uint256 _price2,
         uint _timestamp2,
         string _source2,
         bytes32 indexed _tickerHash,
         uint _threshold
     );

     event addDataSource(
         address _oracle,
         string _source
     );

     uint public numSources;
     mapping (address => bool) public whiteList; //whitelisted oracle addresses
     address[] public oracleArr; //array of oracle addresses
     mapping (address => string) public sources;
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

         uint timestamp = now;

         stocks[tickerHash][msg.sender] = Stock({price: _price, timestamp: timestamp});

         emit stockData(msg.sender, _ticker, _price, timestamp, tickerHash, sources[msg.sender]);

         compareStocks(_ticker, tickerHash, timestamp, msg.sender);
     }

     function compareStocks(string memory _ticker, bytes32 tickerHash, uint _timestamp, address _o1) public {

         uint p1 = stocks[tickerHash][_o1].price;
         for(uint i = 0; i < numSources; i++) {
             address o2 = oracleArr[i];
             uint p2 = stocks[tickerHash][o2].price;
             uint ts2 = stocks[tickerHash][o2].timestamp;
             uint tsDiff = max(_timestamp, ts2) - min(_timestamp, ts2);

             if(errorMargins(p1, p2) && tsDiff < 600 && _o1 != o2) {
                 emit discrepancy(
                     _ticker,
                     _o1,
                     p1,
                     _timestamp,
                     getSource(_o1),
                     o2,
                     p2,
                     ts2,
                     getSource(o2),
                     tickerHash,
                     threshold
                 );
             }
         }
     }

    function errorMargins(uint _p1, uint _p2) public view returns (bool) {
        /*
        This function checks for a significant price difference
        for each stock between sources. The threshold level to emit an event is
        configured in the configureErrorMargins function
        */

        uint temp1 = min(_p1, _p2);

        uint comp1 = _p1 - temp1;
        if ( comp1 >= threshold) return true;
        uint comp2 = _p2 - temp1;
        if ( comp2 >= threshold) return true;

        return false;

    }

     function addSource(address _oracle, string memory _source) public onlyOwner() {
         if(whiteList[_oracle] != true) {
             whiteList[_oracle] = true;
             oracleArr.push(_oracle);
             sources[_oracle] = _source;
             numSources = numSources + 1;
             emit addDataSource(_oracle, _source);
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

    function max(uint a, uint b) private pure returns (uint) {
         return a > b ? a : b;
    }

    function getSource(address _oracle) public view returns (string memory) {
        return sources[_oracle];
    }

    function getAllOracles() public view returns (address[] memory){
        address[] memory ret = new address[](numSources);
        for (uint i = 0; i < numSources; i++) {
            ret[i] = oracleArr[i];
        }
        return ret;
    }
}
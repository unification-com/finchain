pragma solidity >0.5.0;
pragma experimental ABIEncoderV2 ; //To remove or not remove?

contract Finchain {
    
    using SafeMath for uint256;

     address owner;
     uint threshold;
     uint shadowCounter; //used to keep track of how many of the oracles updated their stocks

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
     /*
     Mapping of oracle Addresses to stock arrays
     This allocates an array of stock structs to every oracle address
     */
     mapping(address => Stock[]) stocks; 
     address[] public oracleArr; //array of oracle addresses
     Stock[] public stockArr; //array to iterate through stock mapping, NOT NEEDED?


     constructor (address[] memory _oracleAddresses, uint _threshold) public {
        owner = msg.sender;
        for (uint i; i < _oracleAddresses.length; i++) {
            oracleAddresses[_oracleAddresses[i]] = true;
            oracleArr.push(_oracleAddresses[i]);
            
    }
        oracleAddresses[owner] = true;
        threshold = _threshold;
  }

     function updateStock (
         string memory _ticker,
         uint256 _price,
         uint _timestamp,
         address _sourceID,
         uint i // array index, to be passed by nodeJS process
         )
         public whiteList{
         require (shadowCounter < 3, "Only three oracles currently permitted");

         stocks[msg.sender][i].ticker = _ticker;
         stocks[msg.sender][i].price = _price;
         stocks[msg.sender][i].timestamp = _timestamp;
         stocks[msg.sender][i].sourceID = _sourceID;
         
         shadowCounter++;
         
         if (shadowCounter == 3){
             shadowCounter = 0;
             compareStocks(oracleArr[0], oracleArr[1], oracleArr[2]); //move on to next state
         }
     }

 
     function compareStocks(address _source1, address _source2, address _source3) public {
         
         uint k; //counter
         for (k; k < 5 ; ++k){ //k < 5 just as an example of 5 stocks; Will be top 100 stocks
             uint p1 = stocks[_source1][k].price;
             uint p2 = stocks[_source2][k].price;
             uint p3 = stocks[_source3][k].price;
             
             bool result = errorMargins(p1, p2, p3);
             
             if (result = true){
                 emit discrepency(
                    _source1,
                    _source2,
                    stocks[_source1][k].ticker,
                    stocks[_source1][k].price
                    ); }
             
             
         }
     }
     
     function errorMargins(uint _p1, uint _p2, uint _p3) public returns (bool) {
        /*
        This function checks for a significant price difference
        for each stock between sources. The threshold level to emit an event is
        configured in the configureErrorMargins function
        */
        
        uint temp1 = min (_p1, _p2);
        uint temp2 = min (temp1, _p3);
        
        if (((_p1 - temp2) / temp2) > threshold) return true;
        if (((_p2 - temp2) / temp2) > threshold) return true;
        if (((_p3 - temp2) / temp2) > threshold) return true;
        
        return false;
        
        
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

     function configureErrorMargins(uint _threshold) public {
         threshold = _threshold;
     }
     
     function min(uint a, uint b) private pure returns (uint) {
         return a < b ? a : b;
    }

}

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}
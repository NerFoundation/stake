pragma solidity ^0.4.23;


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

  /**
  * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender) public view returns (uint256);
  function transferFrom(address from, address to, uint256 value) public returns (bool);
  function approve(address spender, uint256 value) public returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Stake{

    using SafeMath for uint;
    ERC20 public token;

    struct User{
        address user;
        uint amount;
        bool exists;
    }

    mapping(address => User) public users;
    
    address[] usersList;
    address owner;

    uint public indexOfPayee;
    uint public bonusRate;


    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    constructor(address _token, uint _bonusRate) public {
        token = ERC20(_token);
        owner = msg.sender;
        bonusRate = _bonusRate;
    }

    event OwnerChanged(address newOwner);

    function changeOwner(address _newOwner) public onlyOwner {
        require(_newOwner != 0x0);
        require(_newOwner != owner);
        owner = _newOwner;

        emit OwnerChanged(_newOwner);
    }

    event BonusChanged(uint newBonus);

    function changeBonus(uint _newBonus) public onlyOwner {
        require(_newBonus > 0);
        bonusRate = _newBonus;

        emit BonusChanged(_newBonus);
    }

    event Deposited(address from, uint amount);

    function deposit(uint _value) public returns(bool) {
        require(_value > 0);
        require(token.allowance(msg.sender, address(this)) >= _value);

        User storage user = users[msg.sender];

        if(!user.exists){
            usersList.push(msg.sender);
            user.user = msg.sender;
            user.exists = true;
        }

        user.amount = user.amount + _value;

        token.transferFrom(msg.sender, address(this), _value);

        emit Deposited(msg.sender, _value);

        return true;

    }

    function multiSendToken() public onlyOwner {
        uint i = indexOfPayee;
        
        while(i<usersList.length && msg.gas > 200000){
            User memory currentUser = users[usersList[i]];
            
            uint amount = currentUser.amount;
            uint bonus = amount.mul(bonusRate).div(100);

            require(token.balanceOf(address(this)) >= bonus);
            require(token.transfer(currentUser.user, bonus));
            i++;
        }

        indexOfPayee = i;
    }

    function multiSendTokenComplete() public onlyOwner {
        indexOfPayee = 0;
    }

    
}
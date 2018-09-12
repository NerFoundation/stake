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

    struct Contribution{
        uint amount;
        uint time;
    }

    struct User{
        address user;
        uint amountAvailableToWithdraw;
        bool exists;
        uint totalAmount;
        Contribution[] contributions;       
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
        user.totalAmount = user.totalAmount.add(_value);
        user.contributions.push(Contribution(_value, now));
        token.transferFrom(msg.sender, address(this), _value);

        emit Deposited(msg.sender, _value);

        return true;

    }

    function multiSendToken() public onlyOwner {
        uint i = indexOfPayee;
        
        while(i<usersList.length && msg.gas > 200000){
            User memory currentUser = users[usersList[i]];
            
            uint amount = currentUser.totalAmount;
            if(amount >= 10000 * (10 ** 18)){
                uint bonus = amount.mul(bonusRate).div(100);

                require(token.balanceOf(address(this)) >= bonus);
                require(token.transfer(currentUser.user, bonus));
            }
            i++;
        }

        indexOfPayee = i;
    }

    event MultiSendComplete(bool status);
    function multiSendTokenComplete() public onlyOwner {
        indexOfPayee = 0;
        emit MultiSendComplete(true);
    }

    event Withdrawn(address withdrawnTo, uint amount);
    function withdrawTokens(uint _value) public {
        require(_value > 0);

        User storage user = users[msg.sender];

        for(uint q = 0; q < user.contributions.length; q++){
            if(now > user.contributions[q].time + 4 weeks){
                user.amountAvailableToWithdraw = user.amountAvailableToWithdraw.add(user.contributions[q].amount);
                remove(q,user.contributions);
            }
        }

        require(_value <= user.amountAvailableToWithdraw);
        require(token.balanceOf(address(this)) >= _value);

        user.amountAvailableToWithdraw = user.amountAvailableToWithdraw.sub(_value);

        token.transfer(msg.sender, _value);

        emit Withdrawn(msg.sender, _value);


    }

    function remove(uint index, Contribution[] storage contributions) internal {
        if (index >= contributions.length) return;

        for (uint i = index; i<contributions.length-1; i++){
            contributions[i] = contributions[i+1];
        }
        delete contributions[contributions.length-1];
        contributions.length--;
    }


    function public payable(){

    }
    

    
}
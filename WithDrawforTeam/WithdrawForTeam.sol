// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol';
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

/**
 * @dev https://cainuriel.github.io/ 
 * This contract is intended to prevent a rug for the team. 
 * Does not allow funds to be withdrawn until the entire team has purchased their share.
 * Allows payments in percentage or direct amount
 */
contract WithdrawForTeams is Ownable {

    using SafeMath for uint256;

    uint public membersForRegister;
    uint public stillToBePaid;  
    mapping(address => uint256) public percentage;
    mapping(address => uint256) public memberAmount;
    mapping(address => bool) public paidOut;

        /**
    * withdraw from the remainder sold after the team has cashed
    * @param amount total balance remainder
    * @param date collection date
    */
    event Withdraw(
        uint256 amount,
        uint256 date
    );

        /**
    * Event for team collect logging
    * @param member address of team
    * @param percentage of the member
    * @param amount balance of the team
    * @param date collection date
    */
    event WithdrawTeamPercentage(
        address member,
        uint256 percentage,
        uint256 amount,
        uint256 date
    );

          /**
    * Event for team collect logging
    * @param member address of team
    * @param amount balance of the team
    * @param date collection date
    */
    event WithdrawTeamAmount(
        address member,
        uint256 amount,
        uint256 date
    );
    
    /**CAUTION
     * @dev Cannot reduce or expand the number of team members after deploying the contract
     */
    constructor(uint _teamNumber)  
    {
        membersForRegister = _teamNumber;
        stillToBePaid = _teamNumber;
    }

        /**
        * @dev sets the percentage that a team member will receive.
        */
        function setPercentageTeam(address _member, uint256 _percentage)  public onlyOwner 
    {
        require(membersForRegister != 0, "The registration of team members is now complete");
        percentage[_member] = _percentage;
        membersForRegister = membersForRegister.sub(1);
    }

        /**
        * @dev sets the amount that a team member will receive.
        */
        function setAmountTeam(address _member, uint256 _amount)  public onlyOwner 
    {
        require(membersForRegister != 0, "The registration of team members is now complete");
        memberAmount[_member] = _amount;
        membersForRegister = membersForRegister.sub(1);
    }

        /**
        * @dev Before collecting the team has to take the agreed part
        */
        function withdraw() public onlyOwner 
    {   require(stillToBePaid == 0, "Has not yet received all the team");
        uint256 amount = address(this).balance;
        payable(msg.sender).transfer(amount);
        emit Withdraw(amount, block.timestamp);
        
    }
        /**
        * @dev Members who have a percentage must call this function
        */
        function withdrawTeamPercentage() public 
    {   require(percentage[msg.sender] != 0, "This account is not in the team or have amount");
        require(!paidOut[msg.sender], "You have already collected your share");
        uint256 balance = getBalance();
        uint256 amount = balance.mul(percentage[msg.sender]).div(10**2);
        payable(msg.sender).transfer(amount);
        stillToBePaid = stillToBePaid.sub(1);
        paidOut[msg.sender] = true;
        emit WithdrawTeamPercentage(msg.sender,percentage[msg.sender], amount, block.timestamp);
        
    }

        /**
        * @dev Members who have a amount must call this function
        */
        function withdrawTeamAmount() public 
    {   require(memberAmount[msg.sender] != 0, "This account is not in the team or have percentage");
        require(!paidOut[msg.sender], "You have already collected your share");
        uint256 amount = memberAmount[msg.sender];
        payable(msg.sender).transfer(amount);
        stillToBePaid = stillToBePaid.sub(1);
        paidOut[msg.sender] = true;
        emit WithdrawTeamAmount(msg.sender, amount, block.timestamp);
        
    }

        function getBalance() public view returns(uint256) 
    {
        return address(this).balance;
    }

} 


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Betting is Ownable {
  event GainsClaimed(address indexed _address, uint256 _value);

  using MerkleProof for bytes32[];

  uint256 public totalBetOne;
  uint256 public totalBetTwo;

  uint256 public minimumBet;

  address[] public playersBetOne;
  address[] public playersBetTwo;

  mapping(address => uint256) public players;
  mapping(address => uint256) public claimed;

  bytes32 merkleRoot;
  uint8 winner;

  constructor() Ownable() {
    // minimum bet is 1 gwei
    minimumBet = 1000000000;
  }

  function setMerkleRoot(bytes32 root, uint8 team) onlyOwner public 
  {
    merkleRoot = root;
    winner = team;
  }

  function checkPlayer(address player) public view returns(bool){
    return !(players[player] == 0);
  }

  function getTotalBetOne() public view returns(uint256){
    return totalBetOne;
   }

  function getTotalBetTwo() public view returns(uint256){
    return totalBetTwo;
  }

  function getPlayersBetOne() public view returns(address[] memory) {
    return playersBetOne;
  }

  function getPlayersBetTwo() public view returns(address[] memory) {
    return playersBetTwo;
  }

  function bet(uint8 team) public payable {
    require(team == 1 || team == 2, "Invalid team");

    require(!checkPlayer(msg.sender), "You bet on a game already");

    require(msg.value >= minimumBet, "Minimum bet is 1 gwei");

    require(merkleRoot == 0, "Bets are closed");

    if(team == 1) {
      playersBetOne.push(msg.sender);
      totalBetOne += msg.value;
    } else {
      playersBetTwo.push(msg.sender);
      totalBetTwo += msg.value;
    }

    players[msg.sender] = msg.value;
  }

  function claim(bytes32[] memory proof) public {
    require(merkleRoot != 0, "No winner yet for this bet");

    require(proof.verify(merkleRoot, keccak256(abi.encodePacked(msg.sender))), "You are not in the list");

    uint256 senderBet = players[msg.sender];

    uint256 totalWinners = totalBetOne;
    uint256 totalLosers = totalBetTwo;

    if(winner == 2) {
      totalWinners = totalBetTwo;
      totalLosers = totalBetOne;
    }

    uint256 total = senderBet + ((senderBet / totalWinners) * totalLosers);

    (bool success, ) = msg.sender.call{value:total}("");

    require(success, "Transfer failed.");

    emit GainsClaimed(msg.sender, total);
  }
}

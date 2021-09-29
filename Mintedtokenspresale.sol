//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;


import  "@openzeppelin/contracts/access/Ownable.sol";

interface TokenInterface {
    
    function balanceOf(address owner) external view returns (uint256 balance);
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) external;
}

/**After deployed remember to allow this contract to manage the NFTs using the function setApprovalForAll
 * of the NFTs contract
 * 
 *\The owner of this contract must be the same as that of all the tokens put up for sale
 */
contract Presale is Ownable {
    
  uint256 public limitBuy = 3;
  address payable public _wallet;
  uint256 public _tokenPrice = 100000000000000000; //0.1 BNB
  TokenInterface TokenContract; // interface of NFT contract.

   /**
   * Event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param idToken NFT purchased
   */
  event TokenPurchase(
    address indexed purchaser,
    address indexed beneficiary,
    uint256 value,
    uint256 idToken
  );

  constructor  (address payable wallet, address addressToken)  
 {

        TokenContract = TokenInterface(addressToken);    
        _wallet = wallet;
  }

  function endSold() public  onlyOwner() {

     payable(_wallet).transfer(address(this).balance);
  }
    
  function TokenBalance() public view returns (uint256)  {
     return TokenContract.balanceOf(owner());

  }
  
   function BNBBalance() public view onlyOwner() returns (uint256)  {
      return address(this).balance;

  }
  

  receive ()  external payable {

  }
  
  
  function setLimitBuy(uint256 _newLimit) public onlyOwner() {
        limitBuy = _newLimit;
  }
  

  function getBalanceOfNFTs(address _user) public view returns (uint256){
      return TokenContract.balanceOf(_user);
  }
  
    /**
    * @dev low level token purchase ***DO NOT OVERRIDE***
    * @param _beneficiary Address performing the token purchase
    */
  function buyTokens(address _beneficiary, uint256 tokenId) public payable {
    uint256 balance = getBalanceOfNFTs(_beneficiary);  
    
    require(balance <= limitBuy, "You have already purchased the maximum allowed NFTs");
    require(msg.value >= _tokenPrice, "value sent needs to be atleast sale price");
    TokenContract.safeTransferFrom(owner(), msg.sender, tokenId, "");


    
    emit TokenPurchase(owner(), _beneficiary, msg.value, tokenId);

  }

}


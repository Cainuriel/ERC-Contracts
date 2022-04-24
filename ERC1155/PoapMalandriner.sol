// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token//ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol";

contract Contract1155 is ERC1155, Ownable {

uint256 public constant POAP = 1;

// 0x93A29402Dc4C6233102B1580717126565c5c7cBf testnet
mapping(uint => string) private _URIS;

constructor() ERC1155("https://raw.githubusercontent.com/Cainuriel/metadatas/main/{id}.json") 
    {

    _mint(msg.sender, POAP, 71, "");

    }

function mint(address account, uint256 id, uint256 amount) public onlyOwner 
    {
            _mint(account, id, amount, "");
    }

    function sale(address account, uint256 id, uint256 amount) public payable 
    {       
            _mint(account, id, amount, "");
    }

function burn(address account, uint256 id, uint256 amount) public 
    {
    require(msg.sender == account);
    _burn(account, id, amount);
    }

function setUniqueURI(uint _tokenId, string memory _uri) public onlyOwner 
    {
     _URIS[_tokenId] = _uri;
    }

 function uri(uint256 _tokenId) override public view returns (string memory) 
    {
 

        if(bytes(_URIS[_tokenId]).length != 0) 
        {
         return string(_URIS[_tokenId]);
        }

        return string(
            abi.encodePacked(
            "https://raw.githubusercontent.com/Cainuriel/metadatas/main/",
            Strings.toString(_tokenId),
            ".json"
           )
        );
    }

  

}

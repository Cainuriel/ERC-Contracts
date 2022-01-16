// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol';
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol";

contract Contract1155 is ERC1155, Ownable {

uint256 public constant TOKEN1 = 0;
uint256 public constant TOKEN2 = 1;
uint256 public constant TOKEN3 = 2;
uint256 public constant TOKEN4 = 3;
uint256 public constant TOKEN5 = 4;
uint256 public constant TOKEN6 = 5;

mapping(uint => string) private _URIS; // for tokens ERC721 style.

constructor() ERC1155("https://BASEURI/{id}.json") {
    // CREAMOS LOS NFTs de un vuelo
    _mint(msg.sender, TOKEN1, 4, "");
    _mint(msg.sender, TOKEN2, 1, "");
    _mint(msg.sender, TOKEN3, 2, "");
    _mint(msg.sender, TOKEN4, 1, "");
    _mint(msg.sender, TOKEN5, 3, "");
    _mint(msg.sender, TOKEN6, 1000000000, "");
}

function mint(address account, uint256 id, uint256 amount) public onlyOwner {
            _mint(account, id, amount, "");
}

function burn(address account, uint256 id, uint256 amount) public {
    require(msg.sender == account);
    _burn(account, id, amount);
}

function setUniqueURI(uint _tokenId, string memory _uri) public onlyOwner {
     _URIS[_tokenId] = _uri;
}

 function uri(uint256 _tokenId) override public view returns (string memory) {

        if(bytes(_URIS[_tokenId]).length != 0) {
         return string(_URIS[_tokenId]);
     }

        return string(
            abi.encodePacked(
            "https://BASEURI/",
            Strings.toString(_tokenId),
            ".json"
           )
        );
      }


}
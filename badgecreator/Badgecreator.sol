//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./ERC721Full.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0-beta.0/contracts/drafts/Counters.sol";



contract Badgecreator is ERC721Full {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor(string memory name, string memory symbol, string memory setBaseURI) ERC721Full(name, symbol, setBaseURI) public {}

    function createBadge(address player, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
    
}



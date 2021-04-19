//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0-beta.0/contracts/token/ERC721/ERC721Enumerable.sol";
import "./ERC721Metadata.sol";

/**
 * @title Full ERC721 Token
 * @dev This implementation includes all the required and some optional functionality of the ERC721 standard
 * Moreover, it includes approve all functionality using operator terminology.
 *
 * See https://eips.ethereum.org/EIPS/eip-721
 */
contract ERC721Full is ERC721Enumerable, ERC721Metadata {
    constructor (string memory name, string memory symbol, string memory baseURI) public ERC721Metadata(name, symbol, baseURI) { }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        virtual
        override(ERC721Enumerable, ERC721Metadata)
        internal
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 0x021701866f36058701FcAB16d5ED3E844A62e085 in rinkeby       
contract NFTtotalcustom is ERC721Enumerable, Ownable  
{   
    
    string public baseURI;
    mapping(uint256 => string) private _tokenURIs;
    
    constructor(string memory name, string memory symbol) 
    ERC721(name, symbol) 
    {
        setBaseURI("https://ipfs.io/ipfs/");

    }

         /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal view virtual override returns (string memory) 
    {
        return baseURI;
    }

    function mintToken(address to, string memory metadata) public onlyOwner 
    {

    uint256 supply = totalSupply();
    _safeMint(to, supply + 1);
    _setTokenURI(supply + 1, metadata);

    }
     

     function multipleMInt(address to, string[] memory hashes) public onlyOwner 
     {

        uint256 supply = totalSupply();

        for (uint256 i = 0; i < hashes.length; i++) {
            _safeMint(to, supply + 1);
            _setTokenURI(supply + 1, hashes[i]);
            supply++;
        }
    }
    
      /**
     * @dev show all the tokens of the owner.
     */
    function tokensOfOwner(address _owner) public view returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);

        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner 
    {
        baseURI = _newBaseURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) 
    {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner
    {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
      
                
}

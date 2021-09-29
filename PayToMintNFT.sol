//SPDX-License-Identifier: MIT

//DEV: https://cainuriel.github.io/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract PayToMintNFT is ERC721Enumerable, Ownable  
{   
    
    string public baseURI;
    mapping(uint256 => string) private _tokenURIs;
    uint256 public constant tokenPrice = 400000000000000000; //0.4 BNB
    bool public saleIsActive = false;
    
    constructor(string memory name, string memory symbol) 
    ERC721(name, symbol) 
    {
    
        setBaseURI("");

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

    function mintToken() public payable
    {
        require(saleIsActive, "Sale must be active to mint Token");    
        require(tokenPrice == msg.value, "BNB value sent is not correct");
    
        uint256 supply = totalSupply();
        _safeMint(msg.sender, supply + 1);

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
    
      function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
    
      function bnbBalance() public view onlyOwner returns(uint256) {
        return address(this).balance;

    }
    
     /*
    * Pause sale if active, make active if paused
    */
    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }
      
                
}

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Shares is ERC20 {

      constructor(string memory _name, string memory _simbol, address _to, uint256 _amountShares) ERC20(_name, _simbol) {
        _mint(_to, _amountShares);
      }
}

contract NFTwithshares is ERC721Enumerable, Ownable {

  uint256 counter;
  mapping(uint256 => address) public nftAddressToken;

  constructor() ERC721("NFT con acciones", "NFTSHAR") {}

  function mint(address _owner, string memory _name, string memory _simbol, uint256 _shares) public onlyOwner {
    counter++;
    _mint(address(this), counter);
    nftAddressToken[counter] = address( 
                            new Shares(   // el "casteo" address es para obtener la direccion del contrato ERC20
                            _name,
                            _simbol,
                            _owner,
                          _shares * 10 ** 18)); // para aceptar numeros redondos
  }

}

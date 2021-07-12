//SPDX-License-Identifier: Unlicense

pragma solidity ^0.6.12;

import  "./Crowdsale.sol";
import  "./tools/Ownable.sol";
//import  "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
//import  "@openzeppelin/contracts/token/ERC20/Ownable.sol";
//import "hardhat/console.sol";

// trusty contrato de fernando: 0x21176b07a996E62C905e5bf29b1E3e8F1f237d8A

/**
 * Standard de preventa con algunas customizacinones personales.
 *
 *endsold: para la preventa y envia los tokens que no se hayan vendido
 *al propietario
 *TokenBalance: Indica la cantidad de tokens que hay en el contrato
*
 Setrate: Cambia la cantidad de tokens a enviar por 1 BNB cuando queramos.
 *\
 */


interface TokenInterface {
    // determinamos las funciones que necesitamos del ERC20. Tienen que ser iguales.
    function decimals() external view  returns(uint8);
    function balanceOf(address _address) external view returns(uint256);
    function transfer(address _to, uint256 _value) external returns (bool success);
}



contract SALETOKEN is Crowdsale, Ownable {
    
   uint256  public limitBuy = 3000000000000000000;
   
   uint256 public minRate = 100000;
   uint256 public maxRate = 220000;
    
     TokenInterface TokenContract; // interface para manipular metodos del token.

    // tanto _token como _addresstoken son la misma direccion. La diferencia esta en su uso.
    // Debemos pasarlo como contrato y como direccion para 
    // hacer operaciones diferentes.
    constructor  (uint256 _rate, 
    address payable _wallet, 
    BEP20 _token,
    address _addressToken
    ) 
    

        
    Crowdsale(_rate,  _wallet, _token) 
    
    public {
        
        require(_rate >= minRate && _rate <= maxRate , "La cantidad de tokens tiene que estar entre 100000 y 220000");
        
        // pásamos el contrato del token, como direccion para ser usada por la interface
        TokenContract = TokenInterface(_addressToken);
        
        //console.log("Desplegado contrato de venta de los tokens del contrato: ", _token);
        
        
    }
    
     // Funcion que liquida el contrato para que no se pueda vender mas.
    function endSold() public  onlyOwner() {
        
        // compensacion de saldos. 
        require(TokenContract.transfer(owner(), TokenContract.balanceOf(address(this))));
        msg.sender.transfer(address(this).balance);
        weiRaised = 0;
       
    }
    
       function TokenBalance() public view returns (uint256)  {
    return TokenContract.balanceOf(address(this));
    
  }
  
     function setRate(uint256 _newrate) public onlyOwner() {
         
    require(_newrate >= minRate && _newrate <= maxRate , "La cantidad de tokens tiene que estar entre 100000 y 220000");
    rate = _newrate;
  }
  
      function setLimitBuy(uint256 _newLimit) public onlyOwner() {
    limitBuy = _newLimit;
  }
  
      function setLimirates(uint256 _newLimitminRate, uint256 _newLimitmaxRate) public onlyOwner() {
    minRate = _newLimitminRate;
    maxRate = _newLimitmaxRate;
  }
  
   /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   * @param _beneficiary Address performing the token purchase
   */
  function buyTokens(address _beneficiary) public override payable {
      
    require(TokenContract.balanceOf(_beneficiary) <= limitBuy.mul(rate), "Esta cuenta ya tiene el limite de tokens permitido para la preventa");

    uint256 weiAmount = msg.value;
    
    require(weiAmount <= limitBuy, "Compra excede el máximo de BNBs permitido");
    
    _preValidatePurchase(_beneficiary, weiAmount);

    // calculate token amount to be created
    uint256 tokens = _getTokenAmount(weiAmount);

    // update state
    weiRaised = weiRaised.add(weiAmount);

    _processPurchase(_beneficiary, tokens);
    emit TokenPurchase(
      msg.sender,
      _beneficiary,
      weiAmount,
      tokens
    );
    
  }

}


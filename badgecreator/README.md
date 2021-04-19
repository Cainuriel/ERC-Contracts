# Badge creator
Creador de insignias ERC721 en una red Ethereum para desplegar en la IDE Remix

## Instalación

Instalar la wallet metamask en el navegador: [Tutorial](https://etherworld.co/2019/07/07/install-metamask-on-brave-browser/).

Lo encontrarás en 
 [chrome web store](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=es).


1. Ir a la IDE de Remix y crear un workspace.
2. Crear los archivos en la carpeta contracts en la misma raiz.
⋅⋅2 ![](img/carpeta-contracts.png "carpeta de contratos")
3. Seleccionar el archivo Badgecreator.sol para compilar.
⋅⋅*. ![](img/seleccion-archivo.png "seleccion del archivo")
4. Ir a compilacion, el botón de la izquierda con la S de solidity,seleccionar una versión de compilación que no sea inferior a la de los contratos ``` pragma solidity ^0.6.0; ```
⋅⋅*. ![](img/seleccion-compilador.png "seleccion de compilador")
5. Realizará automáticamente las importaciones de Github. 
6. Ir, debajo de compilación, a _deploy run transactions_. Botón con el símbolo de Ethereum.
7.  Elija el entorno de desarrollo:
⋅⋅*. Si elije la maquina virtual en JavaScript podrá desplegar en local el contrato para realizar las pruebas de forma segura ![](img/entorno-javascript.png "seleccion de compilador")
⋅⋅*. Si elije _Injected Web3_ deberá conectar su metamask a una maquina virtual de Ethereum. en la imagen comprobará que hemos conectado a la red de pruebas _Robsten_ ![](img/entorno-injected-Web3.png "seleccion de compilador")


## Conseguir Ethereum para la redes de Pruebas.

Existen dos redes de pruebas en las que podemos desplegar los contratos inteligentesl. Pero, para emular a la real maquina virtual de Ethereum, necesitamos de Ethers para poder pagar las transacciones y el gas.

A continuación dispone de los links para solicitar Ethers para realizar sus pruebas tanto en _Robsten_ como en _Rinkeby_:

 [Robsten](https://faucet.ropsten.be/)

  [Rinkeby](https://faucet.rinkeby.io/)

## "Deployando" el contrato


## Saludos
A la comunidad Malandriner de  [Daniel Primo](https://www.danielprimo.io/).

## License
[MIT](https://choosealicense.com/licenses/mit/)
## Este contrato se ha desarrollado en Alchemy. Si desea realizarlo igual tendrá que crearse una APP en su plataforma. Nosotros hemos usado la red Robsten.

[Alchemy](https://www.alchemyapi.io/)

## INSTALACIÓN 

### USAREMOS NODE

```npm init```

#### USAREMOS HARDHAT

Es un entorno de trabajo para probar contratos inteligentes.

```npm install --save-dev hardhat```

Dentro del proyecto:

```npx hardhat```

Elegir proyecto vacio.

Cuando cree el archivo NFT.sol recuerde instalar las librerias con:
```npm install @openzeppelin/contracts@3.1.0-solc-0.7```

Tambien necesitamos crear un archivo .env:

```npm install dotenv --save```

En el archivo deberá escribir su clave privada. Acuerdese ignorar este archivo en su .gitignore para no compartir su clave privada

``` 
API_URL = "https://eth-ropsten.alchemyapi.io/v2/your-api-key"
PRIVATE_KEY = "your-private-key"
```

Tendremos tambien que instalar Ethers.js

``` npm install --save-dev @nomiclabs/hardhat-ethers 'ethers@^5.0.0' ```


comando de compilación para comprobar que todo ha ido bien.

``` npx hardhat compile ```

Finalmente, implemente el contrato con:

``` npx hardhat run scripts/deploy.js --network ropsten ```


## CREACIÓN DE TOKENS

Deberemos descargar web3 de alchemy

```npm install @alch/alchemy-web3```

### Tenemos que crearnos una cuenta en pinata para poder tener el token descentralizado en IPFS 

Siga los pasos en:

[Pinata](https://pinata.cloud/)

Tiene que subir la imagen, y luego incluirla en el JSON, para finalmente, volver a subir a Pinata.


Para realizar la transaccion final de su token tendrá que correr el archivo mint-nft.js

```node scripts/mint-nft.js```

## API DE ETHERSCAN

### Instalación

``` npm install --save-dev @nomiclabs/hardhat-etherscan ```

### Creación de la llave

Registrese y cree su llave:
[Etherscan](https://etherscan.io/apis/)

No olvide introducir su __ETHERSCAN_API_KEY__ en sus variables de entorno.

Este complemento ayuda a verificar el código fuente del contrato en Etherscan, tanto en la red real como en todas sus testnet.

Proporcione la dirección de implementación y los argumentos del constructor, nosotros no usamos, y el complemento detectará localmente el contrato a verificar:
``` npx hardhat verify --network ropsten CONTRACT-ADDRESS  "" ```

# 1º Despliegue en la testnet de Binance Smart Chain

## Clonar repositorio

```bash
git clone git@github.com:HosTechTools/react-front-BEP20.git
```

## Instalar dependencias del proyecto

```bash
npm install
```

## Crear archivo .env

Crear archivo .env en la raiz del directorio, con el siguiente contenido:


```env
PRIVATE_KEY = "YOUR_PRIVATE_KEY" 

```

## Compilar

```bash
npx hardhat compile
```

## Compilación de los contratos.

Colocados adecuadamente en la carpeta contracts compilamos.

```bash
npx hardhat compile
```

## Despliegue en la testnet de Binance smart chain

Configurado adecuadamente el archivo deploy.js nos disponemos a desplegarlo en la testnet.

```bash
npx hardhat run scripts/deploy.js --network testnet 
```

Si todo ha ido bien, __devolverá por consola__ la dirección del contrato. 

## Lanzar local server

```bash
npm start
```

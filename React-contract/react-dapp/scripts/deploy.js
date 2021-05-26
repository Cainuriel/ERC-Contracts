// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const [deployer] = await hre.ethers.getSigners();
    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );


  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
   await hre.run('compile');

  // We get the contract Greeter
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  // TOKEN contract
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();

  await greeter.deployed();

  // deploy token contract
  await token.deployed();

  console.log("Greeter deployed to:", greeter.address);
  console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

  // Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3 first time in local node.

  // Token deployed to: 0x9da66e97fAC7Bc1279060e220E441Ef1470940f1 ropsten net
  // Deploying contracts with the account: 0x322d9e3F049a845e9C8ED089B2Bdf8F33c65a08F 
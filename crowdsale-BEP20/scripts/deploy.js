// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Presale = await hre.ethers.getContractFactory("Presale");
  const presale = await Presale.deploy(100000, "0x322d9e3F049a845e9C8ED089B2Bdf8F33c65a08F", "0x21176b07a996E62C905e5bf29b1E3e8F1f237d8A", "0x21176b07a996E62C905e5bf29b1E3e8F1f237d8A"); // Trusty contract.

  await presale.deployed();

  console.log("Presale deployed to:", presale.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

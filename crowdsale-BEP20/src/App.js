import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import Presale from './artifacts/contracts/Presale.sol/Presale.json'

require('dotenv').config();


const { PRIVATE_KEY } = process.env;

// COLOCA TU CONTRATO DEPLOYADO
const presaleaddress = "0x7dc96230239aE0A750e5A962af8dC36330EB4B05" 

function App() {

  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(0);
  console.log('Billetera conectada? ',window.ethereum.isConnected());
  

  async function requestAccount() {
    return  await  window.ethereum.request({ method: 'eth_requestAccounts' });
    //console.log('mira el request', request );
  }

  async function fetchrate() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
     // console.log({ provider })
      const contract = new ethers.Contract(presaleaddress, Presale.abi, provider)
      try {
        const data = await contract.rate();
        console.log('Tokens por un BNB: ', data.toString());
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(presaleaddress, Presale.abi, provider);
      const balance = await contract.TokenBalance();
      const tokens =  balance.toString();
      console.log('Tokens disponibles: ', ethers.utils.formatUnits(tokens));
      console.log("Solicitud de cuenta : ", account.toString());
    }
  }
  // parsear decimales a weis.
  //ethers.utils.parseEther('1.2');

  async function buytokens() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('cuenta conectada: ', account);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(presaleaddress, Presale.abi, signer);
     // console.log('amount', amount);
      //console.log('signer', signer);
     const bnbamount =ethers.utils.parseEther(amount);
      const transation = await contract.buyTokens(account, {value: bnbamount});
      await transation.wait();
      console.log(`${bnbamount} Weis  successfully sent from ${account}`);
    }
  }

//    async function buytokens()
// {
//     let wallet = new ethers.Wallet('932ae634402a819b6341c9abab6576013a8f9fb8e43f5a19759012d9e561b94e');
//     let walletSigner = wallet.connect(window.ethersProvider);
//     //const bnbamount =ethers.utils.parseEther(amount);
//     const [account] =  await window.ethereum.request({ method: 'eth_requestAccounts' });
//     window.ethersProvider.getGasPrice().then((currentGasPrice) => 
//     {
//         let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice));
//         console.log(`gas_price: ${ gas_price }`);

//         if(presaleaddress)// general token send
//         {
//             let contract = new ethers.Contract(presaleaddress, Presale.abi, walletSigner)
            
//             // How many tokens?
//             let numberOfTokens = ethers.utils.parseUnits(amount, 18);
//             console.log(`numberOfTokens: ${ numberOfTokens }`);
            
//             // Send tokens
//             contract.buyTokens(account).then((transferResult) =>
//             {
//                 console.dir(transferResult);
//                 alert("sent token");
//             });
//         }
//         else // ether send
//         {
//             const tx = 
//             {
//                 from : '0x322d9e3F049a845e9C8ED089B2Bdf8F33c65a08F',
//                 to : account,
//                 value : ethers.utils.parseEther(amount),
//                 nonce : window.ethersProvider.getTransactionCount('0x322d9e3F049a845e9C8ED089B2Bdf8F33c65a08F', 'latest'),
//                 gasLimit : ethers.utils.hexlify(0x100000), // 100000
//                 gasPrice : gas_price
//             }
//             console.dir(tx);
//             try{
//                 walletSigner.sendTransaction(tx).then((transaction) => 
//                 {
//                     console.dir(transaction);
//                     alert('Send finished!');
//                 });
//             }catch(error){
//                 alert("failed to send!!");
//             }

//     }
//     });
// }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchrate}>Tokens por 1 BNB</button>
        <button onClick={getBalance}>Tokens disponibles</button>

        {/* <input onChange={e => setUserAccount(e.target.value)} placeholder={userAccount} value={userAccount}/> */}
        <input onChange={e => setAmount(e.target.value)} placeholder={amount} value={amount}/>
        <button onClick={buytokens}>Comprar tokens</button>
      </header>
    </div>
  );
  
}

export default App;

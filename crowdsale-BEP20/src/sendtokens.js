import './App.css';
import { ethers } from 'ethers'
import Presale from './artifacts/contracts/Presale.sol/Presale.json'
require('dotenv').config();

const { PRIVATE_KEY, PUBLIC_KEY } = process.env;

//window.provider = new InfuraProvider("ropsten");
let wallet = new ethers.Wallet(PRIVATE_KEY);
let walletSigner = wallet.connect(window.ethersProvider);

const gas_price = window.ethersProvider.getGasPrice(); // gasPrice

function App() {

walletSigner.sendTransaction(tx).then((transaction) => 
        {
            console.dir(transaction);
            alert('Send finished!');
        });

        let send_token_amount = '100000';
        let send_address = '0xD960114fEFE2e930B7C0174aE9328D9de3dD4384';
        let gas_limit = '0x100000';
        let wallet = new ethers.Wallet(PRIVATE_KEY);
        let walletSigner = wallet.connect(window.ethersProvider);
        //window.ethersProvider = new ethers.providers.InfuraProvider("ropsten");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const presaleaddress = "0x078a934A34b3cae51Fab550847A8d0B08e8eE68a" // in testnet of Binance Smart Chain

        

const tx = 
{
    from : PUBLIC_KEY,
    to : send_address,
    value : ethers.utils.parseEther(send_token_amount),
    nonce : window.ethersProvider.getTransactionCount(send_address, 'latest'),
    gasLimit : ethers.utils.hexlify(gas_limit), // 100000
    gasPrice : gas_price
}

function send_token( send_token_amount, PUBLIC_KEY, send_address, private_key)
{
    let wallet = new ethers.Wallet(private_key);
    let walletSigner = wallet.connect(window.ethersProvider);

    window.ethersProvider.getGasPrice().then((currentGasPrice) => 
    {
        let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice));
        console.log(`gas_price: ${ gas_price }`);

        if(presaleaddress)// general token send
        {
            const contract = new ethers.Contract(presaleaddress, Presale.abi, provider)
            
            // How many tokens?
            let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18);
            console.log(`numberOfTokens: ${ numberOfTokens }`);
            
            // Send tokens
            // contract.transfer({PUBLIC_KEY}, numberOfTokens).then((transferResult) =>
            // {
            //     console.dir(transferResult);
            //     alert("sent token");
            // });

            contract.buyTokens(PUBLIC_KEY).then((transferResult) =>
            {
                console.dir(transferResult);
                alert("sent token");
            });
        }
        else // ether send
        {
            const tx = 
            {
                from : PUBLIC_KEY,
                to : send_address,
                value : ethers.utils.parseEther(send_token_amount),
                nonce : window.ethersProvider.getTransactionCount(send_address, 'latest'),
                gasLimit : ethers.utils.hexlify(gas_limit), // 100000
                gasPrice : gas_price
            }
            console.dir(tx);
            try{
                walletSigner.sendTransaction(tx).then((transaction) => 
                {
                    console.dir(transaction);
                    alert('Send finished!');
                });
            }catch(error){
                alert("failed to send!!");
            }

    }
    });
}

send_token(presaleaddress, send_token_amount, PUBLIC_KEY, send_address, PRIVATE_KEY);
console.log('Se ejecuto el archivo');

}

export default App;
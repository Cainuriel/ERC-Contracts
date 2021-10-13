import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import Presale from './artifacts/contracts/Presale.sol/Presale.json'
import Swal from 'sweetalert2'
import VideoPlayer from "react-background-video-player";

const presaleaddress = "0x67EB19e65f3f204B2A243bC20A49dB6C75fF3Ba9" // Pandoras - in testnet of Binance Smart Chain 

function App() {

  const [network, setNetwork] = useState('no-net');
  const [contractBalance, setContractBalance] = useState(0);
  const [userAccount, setUserAccount] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [userBalancePandoras, setUserBalancePandoras] = useState(0);
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [info, setInfo] = useState(false);
  let amountPandoras = amount * rate;
  const BINANCENETWORK = 'bnbt'; // Testnet
  //const BINANCENETWORK = 'bnb';

  // parallax effect
  const [offSetY, setOffSetY] = useState(0);
  const handleScroll = () => setOffSetY(window.scrollY);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(function () {

    console.log('El gran useEffect con cinco funciones')

    isconnectedMetamask();
    changeAccounts();
    changeNetwork();
    fetchrate();
    getBalance();

  },[],);

//===========================================================================================
  async function addNetwork() {

    // let networkData = [{
    //         chainId: "0x61",
    //         chainName: "BSCTESTNET",
    //         rpcUrls: ["https://data-seed-prebsc-2-s3.binance.org:8545"],
    //         nativeCurrency: {
    //           name: "BINANCE COIN",
    //           symbol: "BNB",
    //           decimals: 18,
    //         },
    //         blockExplorerUrls: ["https://testnet.bscscan.com/"],
    //       },
    //     ];

      let networkData = [{
          chainId: "0x38",
          chainName: "BSCMAINET",
          rpcUrls: ["https://bsc-dataseed1.binance.org"],
          nativeCurrency: {
            name: "BINANCE COIN",
            symbol: "BNB",
            decimals: 18,
          },
          blockExplorerUrls: ["https://testnet.bscscan.com/"],
        },
      ];

      // agregar red o cambiar red
      return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: networkData,
      });
  }

//===========================================================================================
  useEffect(function () {

    
      console.log('Dentro del useEffect network')
      if(network !== BINANCENETWORK && network !== 'no-net' ){ 

          Swal.fire({
            title: 'No estas en la Testnet de Binance Smart Chain',
            text: 'Estas en la red '+network,
            showCancelButton: true,
            confirmButtonText: 'Configurar red',
            //imageUrl: 'https://i2.wp.com/criptotendencia.com/wp-content/uploads/2020/04/binance-smart-chain.jpg?fit=1200%2C674&ssl=1',
            imageUrl: 'https://cryptodaily.io/wp-content/uploads/2021/07/p-2.png',
            imageWidth: 300,
            
            imageAlt: 'Red Binance Smart Chain',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              addNetwork();
              //window.open('https://academy.binance.com/es/articles/connecting-metamask-to-binance-smart-chain', '_blank');  
            }
          })
        } else {

          fetchrate();
          getBalance();
        }
          
          console.log('useEffect de control de network. resultado', network );

  },[network]);


  if (typeof window.ethereum === 'undefined') {
  
    console.log('Metamask no existe en este navegador')

    Swal.fire({
      title:  'Sin Metamask',
      text: "Tendrá que instalarse una billetera",
      showCancelButton: true,
      confirmButtonText: 'instalar metamask',
      imageUrl: './img/metamask-transparent.png',
      // imageWidth: 600,
      // imageHeight: 150,
      imageAlt: 'instalando metamask',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');  
      }
    })
  } 

  async function conectionMetamask() {
    console.log('funcion connection metamask');

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const network = await provider.getNetwork();
    console.log('network', network.name);
    setNetwork(network.name);

    const signer = provider.getSigner(); // user
    const accountUser = await signer.getAddress();

    let cuentaUsuario = accountUser.toString();
    let subini = cuentaUsuario.substr(0,4);
    let subfinal = cuentaUsuario.substr(-4,4);
    document.querySelector('#wallet').innerHTML = `${subini} ... ${subfinal}`;

    const accountUserBalance = await provider.getBalance(accountUser);
    let amount = ethers.utils.formatEther(accountUserBalance).toString();
    let result = Number.parseFloat(amount).toFixed(2);
    const SYMBOL = "BNB";
    let resultado = result.concat(" ", SYMBOL);
    let bnbButton = document.querySelector('#bnbs');
    bnbButton.classList.remove('d-none');
    bnbButton.innerHTML = resultado;
    
    const contract = new ethers.Contract(presaleaddress, Presale.abi, provider);
    try {
      const balancePandoras = await contract.getBalancePandoras({ from: cuentaUsuario });
      let balance = ethers.utils.formatEther(balancePandoras).toString();
      let pandoras = Number.parseFloat(balance).toFixed(0);
      setUserBalancePandoras(pandoras);
      document.querySelector('#pandoras').classList.remove('d-none');

    } catch (err) {
      console.log("Error: ", err)
    }

  }

  async function isconnectedMetamask() {

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      let cuentaUsuario = accounts[0];

      if (cuentaUsuario) {
        
        let subini = cuentaUsuario.substr(0,4);
        let subfinal = cuentaUsuario.substr(-4,4);
        let cuentaRecortada = `${subini} ... ${subfinal}`;
        setUserAccount(cuentaUsuario);

        document.querySelector('#wallet').innerHTML = cuentaRecortada;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contractUserBalance = await provider.getBalance(cuentaUsuario);
        let amount = ethers.utils.formatEther(contractUserBalance).toString();
        let result = Number.parseFloat(amount).toFixed(2);
        let bnbButton = document.querySelector('#bnbs');
        bnbButton.classList.remove('d-none');
        bnbButton.innerHTML = `${result} BNB`;
        setUserBalance(`${result} BNB`);

        const network = await provider.getNetwork();
        console.log('network', network.name);
        setNetwork(network.name);

        const contract = new ethers.Contract(presaleaddress, Presale.abi, provider);
        try {
          const balancePandoras = await contract.getBalancePandoras({ from: cuentaUsuario });
          let amountPandoras = ethers.utils.formatEther(balancePandoras).toString();
          let pandoras = Number.parseFloat(amountPandoras).toFixed(0);
          setUserBalancePandoras(pandoras);
          document.querySelector('#pandoras').classList.remove('d-none');
        } catch (err) {
          console.log("Error: ", err)
        }
      
      }
  }
  
  // funcion que detecta los cambios de cuenta
  async function changeAccounts() {
  
    if (typeof window.ethereum !== 'undefined') {

      window.ethereum.on("accountsChanged", async function () {

        await isconnectedMetamask();
        
      });

    }
  }

   // funcion que detecta los cambios de red
  async function changeNetwork() {
  
    if (typeof window.ethereum !== 'undefined') {
    // detect Network account change
    window.ethereum.on('networkChanged', async function(networkId) {
      console.log('cambio de red efectuado..',networkId);
      await isconnectedMetamask();
    });

    }
  }


  async function fetchrate() {

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // console.log({ provider })
      const contract = new ethers.Contract(presaleaddress, Presale.abi, provider)
      try {
        const data = await contract.rate();
        console.log('Tokens por un BNB: ', data.toString());

        setRate(data.toString());

      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  useEffect(function () {
    console.log('useffect de rate');
    document.querySelector('#rate').innerHTML = rate;

  },[rate]);

  async function getBalance() {

    if (typeof window.ethereum !== 'undefined') {
      //  const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(presaleaddress, Presale.abi, provider);

      try {
        const balance = await contract.TokenBalance();
        let tokens = ethers.utils.formatEther(balance).toString();
        let pandoras = Number.parseFloat(tokens).toFixed(0);
        setContractBalance(pandoras);

      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  useEffect(function () {
    console.log('useeffect de contracBalance');
    document.querySelector('#balance').innerHTML = contractBalance;

  },[contractBalance]);
  

  async function buytokens() {
  
    if (typeof window.ethereum !== 'undefined') {
      if (amount > 0) {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('cuenta conectada: ', account);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(presaleaddress, Presale.abi, signer);
        // console.log('amount', amount);
        //console.log('signer', signer);
        const bnbamount = ethers.utils.parseEther(amount);
        
        try {


          const transaction = await contract.buyTokens(account, { value: bnbamount });
          console.log("Esperando compraOk");
          Swal.fire({
            title: 'El proceso de compra ha comenzado',
            text: 'No actualice la página',
            // icon: 'info',
            showConfirmButton: false,
            imageUrl: 'https://thumbs.gfycat.com/ConventionalOblongFairybluebird-size_restricted.gif',
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'proceso de compra',
            

          })
          const compraOk = await transaction.wait();

          if (compraOk) {
            Swal.fire({
              title:  `Se han envíado ${amountPandoras} Pandoras a la cuenta ${account}`,
              html: `<a href="https://testnet.bscscan.com/tx/${transaction.hash}" target="_blank" rel="noreferrer">Hash de la transacción</a>`,
              icon: 'success',
              confirmButtonText:  'Añadir Pandora a su Metamask',
              confirmButtonClass: "btn-success",
              buttonsStyling: false,
              showCloseButton: true,
              
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                //Sí queremos añadir el token a Metamask
                addTokenToMetamask();
                
              } else if (result.isDenied) {
                // window.location.href = `https://testnet.bscscan.com/tx/${transation.hash}`;
              }
            })

            
            //let link = "<a href='https://testnet.bscscan.com/tx/"+transation.hash+"'>Ver en EtherScan</a>";
            
            getBalance();
            setAmount(0);
            isconnectedMetamask();
          }

          console.log(`La cuenta ${account}, ha recibido los Pandoras correctamente.`);

        } catch (err) {
          let mensajeError = err.message;
           
          if (err.data) {

            if (err.data.message === 'execution reverted: Excede compra de Pandoras permitida') {
              mensajeError =  'Excede compra de Pandoras permitida';
            } else {
              mensajeError =  'La transacción ha sido rechazada';
            }
          }
      
          Swal.fire({
            title: 'Ooops!',
            text: `${mensajeError}`,
            icon: 'error',
            confirmButtonText: 'Cerrar'
          })
          console.log("Error: ", err)
        }

        

      }
    
    }
  }

  const addTokenToMetamask = async () => {

    if (typeof window.ethereum !== 'undefined') {

      //PANDORA test Token
      const tokenAddress = '0x952292556C09C074f135e7912c5801E04219d901';
      const tokenSymbol = 'PANDORA';
      const tokenDecimals = 18;
      const tokenImage = 'https://gateway.pinata.cloud/ipfs/QmSzTfCjfV7dMMMrbjCm1MEeLkgjJCVWfzzW8SU6RSCQpk';


      
        try {
          // wasAdded is a boolean. Like any RPC method, an error may be thrown.
          const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: tokenAddress, // The address that the token is at.
                symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: tokenDecimals, // The number of decimals in the token
                image: tokenImage, // A string url of the token logo
              },
            },
          });

        } catch (error) {
          console.log(error);
        }
    }

  }

  return (

<div className="App">
        <main className="d-lg-none mt-5" style={{transform: `translateY(-${offSetY * 0.3}px)`}}>
        <div className="my-5">
          <a className="navbar-brand" href="">
            <img src="./logo192.png" height="30" alt="Logo de Pandora" />
          </a>
        </div>
        <div className="my-5">
          <h2 className="text-white my-5">The sale is only enabled through a computer</h2>
          <h2 className="my-5">La venta solo es posible conectándose con un Ordenador</h2>
        </div>
      </main>
      <main className="d-none d-lg-block">
        <header className="mb-5">
          <nav className="d-flex justify-content-between align-items-center mx-3 my-3">
            <div>
              <a className="navbar-brand" href="">
                <img src="./logo192.png" className="logoBlanco" alt="Logo de Pandora" />
              </a>
            </div>
            <div>
              <button id="wallet" className="btn btn-primary btn-ghost btn-shine" onClick={conectionMetamask}>Conectar Metamask</button>
              <button id="bnbs" className="btn btn-primary btn-ghost btn-shine mx-2 d-none">BNBs</button>
              <button id="pandoras" className="btn btn-primary btn-ghost btn-shine d-none"> {userBalancePandoras} Pandoras</button>
              {/* {(i18n.language == "en") ? <a className="col-md-2" onClick={() => i18n.changeLanguage('es')}><img src="./img/es.png" alt="Español" /></a> : <a className="col-md-2" onClick={() => i18n.changeLanguage('en')}><img src="./img/en.png" alt="English" /></a>} */}
            </div>
          </nav>
        </header>
      
        <div className="App-buttons my-3">
          <div className="row mt-3 mt-md-0 mb-3 mx-3 mx-md-0">
            <div className="card-deck">
              <div className="card pt-5 pb-3 btn btn-primary btn-ghost btn-shine">
                <h2 ><b>Pandoras</b> por 1 BNB</h2>
                <div className="card-body">
                  <h3 className="card-title numberSize" id="rate">...</h3>

                </div>
              </div>
              <div className="card pt-5 pb-3 btn btn-primary btn-ghost btn-shine">
                <h2> <b>Pandoras</b> disponibles</h2>
                <div className="card-body">
                  <h3 className="card-title numberSize" id="balance">...</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="row mb-3">
              <div className="btn btn-ghost btn-shine col-12 my-3">
                  <label className="bnb-brand font-weight-bold mr-2"><img className="mr-2 mb-2 logoBNB" src="./img/logoBNB.png" alt="Logo BNB" />BNB </label>
                  <input type="number" step="0.01" className="text-center btn btn-ghost btn-shine" onChange={e => setAmount(e.target.value.replace(',', '.'))} id="amount-bnb" placeholder='Introduzca cantidad' value={(amount === 0)? "" : amount} />
              </div>
              <div className="btn btn-ghost btn-shine col-12 my-3">
                  <label className="font-weight-bold mr-2"><img className="mr-2 mb-2" src="./img/logo-pandora.png" alt="Logo Pandora" /> PANDORA</label>
                  <input className="text-center btn btn-ghost btn-shine" id="amount-pandoras" value={amountPandoras} disabled />
              </div>
              <button className="col-12 btn btn-primary btn-ghost btn-shine font-weight-bold" onClick={buytokens}>Comprar Pandoras</button>
            </div>
          </div>     
        </div>
          <div>
          <a href="">
            <img className="logoBlanco" src="./logo192.png" alt="Logo Pandora" />
          </a>
        </div>
        <div id="infoBuyAllowed" className="d-flex align-items-center justify-content-center my-3">
                <button onMouseEnter={() => setInfo(!info)} onMouseLeave={() => setInfo(!info)} id="btnInfo" className="info mr-3"><i className="fa fa-info"></i></button>
                <div id="buyForUser" className="display-5 text-white">{ info  ? 'Usted todavía puede comprar ' + (rate * 1 - userBalancePandoras) +  ' Pandoras' : "Máxima compra permitida por usuario: 1 BNB" }</div>
        </div>
      </main>
     

    <VideoPlayer style={{transform: `translateY(${offSetY * 1}px)`}}
        className="Video"
        src={
          "./pandora.mp4"
        }
        autoPlay={true}
        muted={true}
      />
</div>

  );
}

export default App;

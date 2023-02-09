import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import TheCyberNFT from './utils/TheCyberNFT.json';

// Constants
const TWITTER_HANDLE = 'dhayoralabi';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/animelover-v3';
const BUILDSPACE_HANDLE = '_buildspace';
const BUILDSPACE_TWIITER_LINK = `https://twitter.com/${BUILDSPACE_HANDLE}`;
//const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x94cF58FD7e68aAe9DA98E1138592E86Ce7D8CC5F";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Install Metamask");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({method: 'eth_accounts'});

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account", account);
                                    setCurrentAccount(account)
      
      //event listener to check if a user has previously connected and authorized their wallet
      setupEventListener()
    } else {
      console.log("No authorized accounts found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Install Metamask");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      //Setup listner to check if a  user has previously connected and authorized a wallet
      setupEventListener()
    } catch (error) {
      console.log (error)
    }
  }

  //Setup listener
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, TheCyberNFT.abi, signer);

        //captures events from contract (like webhooks)
        connectedContract.on("NewCyberNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          // eslint-disable-next-line no-template-curly-in-string
          alert(`Your NFT has been minted and sent to your wallet, It might take up to 10 mins to appear on Opensea. Here the link to your NFT on Opensea https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener")

    } else {
      console.log("Ethereum object does not exist");
    }
  } catch (error) {
    console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, TheCyberNFT.abi, signer);

        console.log("Popping up wallet to pay gas")
        let nftTxn = await connectedContract.makeACyberNFT();

        console.log("Mining, Please wait.");
        await nftTxn.wait();
        console.log(nftTxn);
        console.log("Minted, see transaction: https://goerli.etherscan.io/tx");
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, )

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button mint-button">
      Mint NFT
    </button>
  )
  const opensea = () => (
    <a
      href={OPENSEA_LINK}
      target= "_blank"
      rel="noreferrer"
      >
        <button className='cta-button opensea-button'>Buy on Opensea</button>
    </a>
  )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Anime Lover</p>
          <p className="sub-text">
            Each unique, Each popular, Discover your NFT today on the Goerli Testnet.
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
          {opensea()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}
          <a className="footer-text"
            href={BUILDSPACE_TWIITER_LINK}
            target="_blank"
            rel="noreferrer"> {`on @${BUILDSPACE_HANDLE}`}
          </a>
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;

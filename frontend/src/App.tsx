/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnect from "./components/WalletConnect.tsx";
import MintForm from "./components/MintForm.tsx";

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if ((window as any).ethereum) {
      const initProvider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(initProvider);
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      alert("MetaMask is not installed");
      return;
    }

    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      console.log(network);
      setAddress(accounts[0]);
      setSigner(signer);
      setChainId(network.chainId);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setAddress("");
    setSigner(null);
    setChainId(null);
    setIsConnected(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Multi-Mint NFT Application</h1>

      <WalletConnect
        isConnected={isConnected}
        address={address}
        chainId={chainId}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />

      {isConnected && signer && (
        <MintForm signer={signer} userAddress={address} />
      )}

      {!isConnected && <p>Please connect your wallet to continue</p>}
    </div>
  );
}

export default App;

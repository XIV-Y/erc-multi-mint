interface WalletConnectProps {
  isConnected: boolean;
  address: string;
  chainId: bigint | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

function WalletConnect({
  isConnected,
  address,
  chainId,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "20px",
      }}
    >
      <h2>Wallet Connection</h2>

      {!isConnected ? (
        <button
          onClick={onConnect}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
          }}
        >
          Connect MetaMask
        </button>
      ) : (
        <div>
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>Chain ID:</strong> {chainId?.toString()}
          </p>
          <button
            onClick={onDisconnect}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;

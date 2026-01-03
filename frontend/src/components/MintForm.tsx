/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ethers } from "ethers";

const CONTROLLER_ABI = [
  "function multiMint(address to, uint256 erc721Count, uint256[] memory erc1155Ids, uint256[] memory erc1155Amounts, bytes memory signature) external",
];

interface MintFormProps {
  signer: ethers.Signer;
  userAddress: string;
}

function MintForm({ signer, userAddress }: MintFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const CONTROLLER_ADDRESS =
    import.meta.env.VITE_CONTRACT_CONTROLLER_ADDRESS ||
    "0x0000000000000000000000000000000000000000";

  const sampleData = {
    erc721Count: 2,
    erc1155Ids: [4], // 連番になるように書き換える
    erc1155Amounts: [1],
  };

  const signAndMint = async () => {
    try {
      setLoading(true);
      setMessage("Processing...");

      // コントラクトの取得
      const contract = new ethers.Contract(
        CONTROLLER_ADDRESS,
        CONTROLLER_ABI,
        signer
      );

      const network = await signer.provider!.getNetwork();

      // EIP-712署名のドメイン情報（コントラクトと一致させる（DOMAIN_SEPARATOR））
      const domain = {
        name: "MultiMintController",
        version: "1",
        chainId: network.chainId,
        verifyingContract: CONTROLLER_ADDRESS,
      };

      // EIP-712署名のデータ構造定義（MULTIMINT_TYPEHASH）
      const types = {
        MultiMint: [
          { name: "to", type: "address" },
          { name: "erc721Count", type: "uint256" },
          { name: "erc1155Ids", type: "uint256[]" },
          { name: "erc1155Amounts", type: "uint256[]" },
        ],
      };

      // 署名するデータ
      const value = {
        to: userAddress,
        erc721Count: sampleData.erc721Count,
        erc1155Ids: sampleData.erc1155Ids,
        erc1155Amounts: sampleData.erc1155Amounts,
      };

      const signature = await signer.signTypedData(domain, types, value);
      setMessage(`Signed: ${signature.slice(0, 20)}...`);

      // 署名付きでコントラクトのmultiMint関数を実行
      const tx = await contract.multiMint(
        userAddress,
        sampleData.erc721Count,
        sampleData.erc1155Ids,
        sampleData.erc1155Amounts,
        signature
      );

      setMessage((prev) => prev + `\nTX: ${tx.hash.slice(0, 20)}...`);
      const receipt = await tx.wait();
      setMessage((prev) => prev + `\nSuccess! Block: ${receipt!.blockNumber}`);
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px" }}>
      <h2>MultiMint</h2>
      <p>ERC721: {sampleData.erc721Count} NFTs</p>
      <p>
        ERC1155: IDs {sampleData.erc1155Ids.join(",")} Amounts{" "}
        {sampleData.erc1155Amounts.join(",")}
      </p>
      <button
        onClick={signAndMint}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
        }}
      >
        {loading ? "Processing..." : "Sign & Mint"}
      </button>
      {message && (
        <pre
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
          }}
        >
          {message}
        </pre>
      )}
    </div>
  );
}

export default MintForm;

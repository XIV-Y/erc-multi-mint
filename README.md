# Multi-Mint NFT Application

ERC721とERC1155を1回のトランザクションで同時にMintできるアプリケーション

### サンプルトランザクション

https://sepolia.etherscan.io/tx/0x7b76412f716575220a305820cf288c909abd720733e328d1398f30c883499d75

## 必要な環境

- Node.js 18以上
- MetaMask
- Sepolia testnet ETH
- Alchemy API Key

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone 
cd 
```

### 2. バックエンド（スマートコントラクト）のセットアップ
```bash
cd contract
npm install
```

### 3. 環境変数の設定
```bash
# contract/.env を作成
cp .env.example .env
```

`.env`ファイルを編集：
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
SEPOLIA_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```

または、`hardhat.config.ts`を直接編集して`url`と`accounts`を設定

### 4. コントラクトのデプロイ
```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

デプロイ後、**Controller address**をメモする

### 5. フロントエンドのセットアップ
```bash
cd ../frontend
npm install
```

### 6. フロントエンドの環境変数設定
```bash
# frontend/.env を作成
cp .env.example .env
```

`.env`ファイルを編集：
```
VITE_CONTRACT_CONTROLLER_ADDRESS=デプロイされたControllerアドレス
```

### 7. フロントエンドの起動
```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス

## エラーケース

- `authorizedSigner`以外のアドレスでミントを実行する
- フロントエンドのEIP-712署名のドメイン情報や、署名のデータ構造定義に不備がある（ブロックチェーン側と一致しない等）
- ERC1155ですでにミント済みのTokenIdを指定している

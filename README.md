# Open Wallet

Open Wallet is an open-source Ethereum wallet for desktop use.

## Screenshots

<p float="left">
  <img src="/screenshots/screenshot_001.png" width="30%" />
  <img src="/screenshots/screenshot_002.png" width="30%" /> 
  <img src="/screenshots/screenshot_003.png" width="30%" />
</p>

## Features

- Generation of new Ethereum wallet addresses and recovery of existing wallets.
- Retrieval of Ethereum transaction data and historical records.
- Additional functionalities are under development and will be implemented soon.

## Installation and Running in Development Mode

Replace the strings in /src/Transaction.js and /src/api.js with your own API key. Then, follow the steps below:

### npm

```sh
npm install
npm start
```

### Yarn

```sh
yarn install
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Building an Executable File

### npm

```sh
npm run electron-pack
```

### Yarn

```sh
yarn run electron-pack
```

The built file will be located inside the /dist folder.

## Disclaimer

- The private key is currently stored in the local store without encryption. Please DO NOT use any active addresses. It is recommended to use less important addresses or generate a new one.
- The wallet is currently configured for the Sepolia testnet. You may switch to the mainnet or other networks as per your requirement.
- The developer is not responsible for any loss incurred due to the use of this wallet.

## License

MIT
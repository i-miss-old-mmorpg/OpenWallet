import { ethers } from 'ethers';

export async function fetchPrices() {
  try {
    const response = await fetch('https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,tether,binance-coin,usd-coin,xrp,solana,cardano,dogecoin,tron,multi-collateral-dai,polygon,polkadot,litecoin,wrapped-bitcoin,bitcoin-cash,shiba-inu,chainlink,unus-sed-leo,trueusd');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const priceObj = data.data.reduce((acc, cur) => {
      acc[cur.id] = {
        name: cur.name,
        symbol: cur.symbol,
        priceUsd: cur.priceUsd,
      };
      return acc;
    }, {});
    return priceObj;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export function connectWebSocket(setPrices) {
  let ws = null;

  ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,tether,binance-coin,usd-coin,xrp,solana,cardano,dogecoin,tron,multi-collateral-dai,polygon,polkadot,litecoin,wrapped-bitcoin,bitcoin-cash,shiba-inu,chainlink,unus-sed-leo,trueusd');

  ws.onopen = () => {
    console.log('connected');
  };

  ws.onmessage = evt => {
    const priceData = JSON.parse(evt.data);

    setPrices(prevPrices => {
      // If prevPrices is null, do nothing.
      if (prevPrices === null) {
        return;
      }

      // Update prices.
      return {
        ...prevPrices,
        ...Object.fromEntries(
          Object.entries(priceData).map(([id, priceUsd]) => [
            id,
            { ...prevPrices[id], priceUsd }
          ])
        )
      };
    });
  };

  ws.onclose = () => {
    console.log('disconnected');
    setTimeout(() => connectWebSocket(setPrices), 10000);
  };

  ws.onerror = err => {
    console.error('WebSocket error:', err);
    ws = null;
  };

  return () => {
    if (ws) {
      ws.close();
    }
  };
}

export function createWalletAddress() {
  const wallet = ethers.Wallet.createRandom();
  return wallet;
}

export async function getBalance(walletData) {
  let provider = new ethers.EtherscanProvider('sepolia');
  let balance = await provider.getBalance(walletData.address);
  walletData.currentBalance = ethers.formatEther(balance);
  return walletData;
}

export async function getTransactionHistory(address) {
  try {
    const response = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=* Enter you api key here *`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const transactionObj = data.result.reduce((acc, cur) => {
      acc[cur.hash] = {
        from: cur.from,
        to: cur.to,
        value: cur.value,
        timeStamp: cur.timeStamp,
      };
      return acc;
    }, {});
    return transactionObj;

  } catch (error) {
    console.error('An error occurred:', error);
  }
}
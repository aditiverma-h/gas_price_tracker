import { ethers } from 'ethers';
import useGasStore from '../store/useGasStore';

export const fetchGasData = async () => {
  const RPC_URLS = {
    ethereum: 'https://eth.llamarpc.com',
    polygon: 'https://polygon.llamarpc.com',
    arbitrum: 'https://arb1.arbitrum.io/rpc',
  };

  const gasData = {};

  try {
    for (const chain of Object.keys(RPC_URLS)) {
      console.log(`⛽ Fetching data for ${chain}...`);
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chain]);
      const feeData = await provider.getFeeData();

      const baseFee = parseFloat(
        ethers.formatUnits(feeData.maxFeePerGas || 0, 'gwei')
      );
      const priorityFee = parseFloat(
        ethers.formatUnits(feeData.maxPriorityFeePerGas || 0, 'gwei')
      );

      gasData[chain] = { baseFee, priorityFee };
    }

    console.log("✅ Gas data fetched:", gasData);
    useGasStore.getState().setGasData(gasData);
  } catch (e) {
    console.error('❌ Error fetching gas data:', e);
  }
};

export const fetchEthPrice = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    const price = data.ethereum.usd;

    console.log("💰 ETH price:", price);
    useGasStore.getState().setUsdPrice(price);
  } catch (e) {
    console.error('❌ Error fetching ETH price:', e);
  }
};

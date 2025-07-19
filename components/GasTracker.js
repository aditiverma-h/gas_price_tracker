"use client";

import { useState, useEffect } from "react";
import useGasStore from "../store/useGasStore";
import { fetchGasData, fetchEthPrice } from "../lib/fetchGas";

const GasTracker = () => {
  const [mounted, setMounted] = useState(false);
  const gasData = useGasStore((state) => state.gasData);
  const usdPrice = useGasStore((state) => state.usdPrice);

  // ✅ Only set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch only if mounted (i.e., client-side)
  useEffect(() => {
    if (!mounted) return;

    fetchGasData();
    fetchEthPrice();

    const interval = setInterval(() => {
      fetchGasData();
      fetchEthPrice();
    }, 10000);

    return () => clearInterval(interval);
  }, [mounted]);

  // ✅ Guarded render
  if (!mounted) return null;

  return (
    <div>
      <p>
        💰 ETH/USD:{" "}
        <strong>{usdPrice ? `$${usdPrice.toFixed(2)}` : "Loading..."}</strong>
      </p>

      {gasData ? (
        Object.entries(gasData).map(([chain, { baseFee, priorityFee }]) => (
          <div key={chain}>
            <h2>{chain}</h2>
            <p>Base Fee: {baseFee.toFixed(2)} Gwei</p>
            <p>Priority Fee: {priorityFee.toFixed(2)} Gwei</p>
          </div>
        ))
      ) : (
        <p>Loading gas data...</p>
      )}
    </div>
  );
};

export default GasTracker;

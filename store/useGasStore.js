import { create } from 'zustand';

const useGasStore = create((set) => ({
  gasData: null,
  usdPrice: null,
  setGasData: (data) => set({ gasData: data }),
  setUsdPrice: (price) => set({ usdPrice: price }),
}));

export default useGasStore;


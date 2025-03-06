import { create } from 'zustand';

interface GlobalStore {
  API_URL: string;
}

const useGlobalStore = create<GlobalStore>(() => ({
  API_URL: 'http://localhost:8080/api',
}));

export default useGlobalStore;

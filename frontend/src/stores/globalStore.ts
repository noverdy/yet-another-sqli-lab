import { create } from 'zustand';

interface GlobalStore {
  APP_NAME: string;
  API_URL: string;
}

const useGlobalStore = create<GlobalStore>(() => ({
  APP_NAME: 'MySeclab',
  API_URL: '/api',
}));

export default useGlobalStore;

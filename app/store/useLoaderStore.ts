import { create } from "zustand";

interface LoaderState {
  isLoaded: boolean;
  setLoaded: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  isLoaded: false,
  setLoaded: () => set({ isLoaded: true }),
}));

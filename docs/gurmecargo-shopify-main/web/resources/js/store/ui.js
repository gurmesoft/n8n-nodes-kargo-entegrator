import { create } from "zustand";

export const uiStore = create((set) => ({
    loading: false,
    startLoading: () => set({ loading: true }),
    stopLoading: () => set({ loading: false }),
    errorMessage: null,
    setErrorMessage: (message) => set({ errorMessage: message }),
    clearErrorMessage: () => set({ errorMessage: null }),
}));

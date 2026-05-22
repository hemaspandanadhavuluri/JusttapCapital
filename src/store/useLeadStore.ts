import { create } from 'zustand';

interface LeadState {
  stepData: any;
  setStepData: (data: any) => void;
  resetLead: () => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  stepData: {}, // This will hold everything from Name to Assets
  setStepData: (data) => set((state) => ({ 
    stepData: { ...state.stepData, ...data } 
  })),
  resetLead: () => set({ stepData: {} }),
}));
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of your state for strict TypeScript alignment
interface WizardStoreState {
  currentStep: number;
  isProfileComplete: boolean; // Added state flag property to fix ts(2339)
  leadId: string | null;
  studentName: string;
  assignedFO: string | null;
  basicDetails: any;
  educationDetails: any;
  testScores: any;
  academicHistory: any;
  coApplicant: any;
  financialAssets: any;
  courseFinancials: any;
  references: any;
  identity: any;
  setStepPointer: (step: number) => void;
  updateStepData: (key: string, data: any) => void;
  hydrateFromBackend: (data: any) => void;
  resetStore: () => void;
}

export const useApplicationStore = create<WizardStoreState>()(
  persist(
    (set) => ({
      // Baseline global state properties
      currentStep: 1,
      isProfileComplete: false, // Default tracking state is false
      leadId: null,
      studentName: 'Aryan',
      assignedFO: null,
      basicDetails: {},
      educationDetails: {},
      testScores: {},
      academicHistory: {},
      coApplicant: {},
      financialAssets: {},
      courseFinancials: {},
      references: {},
      identity: {},

      // State Modifier pointers
      setStepPointer: (step) => set({ currentStep: step }),
      
      updateStepData: (key, data) => 
        set((state) => ({
          ...state,
          [key]: data
        })),

      // FIX: Guard local step progress against old remote server data overrides
      hydrateFromBackend: (data) => 
        set((state) => {
          // Fall back to local step if backend tries to roll us back
          const securedStep = 
            data && data.currentStep && data.currentStep > state.currentStep
              ? data.currentStep
              : state.currentStep;

          return {
            ...state,
            ...data,
            currentStep: securedStep // Retains local client step integrity
          };
        }),

      resetStore: () => set({ 
        currentStep: 1, 
        isProfileComplete: false, // Safely drops completeness flag on dev cache resets
        leadId: null, 
        studentName: 'Aryan',
        assignedFO: null, 
        basicDetails: {}, 
        educationDetails: {}, 
        testScores: {}, 
        academicHistory: {}, 
        coApplicant: {}, 
        financialAssets: {},
        courseFinancials: {},
        references: {},
        identity: {}
      }),
    }),
    {
      name: 'justtap-onboarding-storage', // Unique key for storage partition
      storage: createJSONStorage(() => AsyncStorage), // Sets local disk as source of truth
    }
  )
);
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useApplicationStore } from '../store/useApplicationStore';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ENDPOINTS } from '../config/apiConfig';

// Component Step Form Imports
import { Step1BasicDetails } from '../components/forms/Step1BasicDetails';
import { Step2EducationDetails } from '../components/forms/Step2EducationDetails';
import { Step3TestScores } from '../components/forms/Step3TestScores';
import { Step4AcademicHistory } from '../components/forms/Step4AcademicHistory';
import { Step5CourseFinancials } from '../components/forms/Step5CourseFinancials';
import { Step7StudentRelations } from '../components/forms/Step5CoApplicant';
import { Step6FinancialAssets } from '../components/forms/Step6FinancialAssets';
import { Step8OwnHouseGuarantor } from '../components/forms/Step8OwnHouseGuarantor';
import { Step9References } from '../components/forms/Step9References';

export const WizardContainer = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const currentStep = useApplicationStore((state) => state.currentStep);
  const leadId = useApplicationStore((state: any) => state.leadId || state.basicDetails?.leadId);
  const setStepPointer = useApplicationStore((state) => state.setStepPointer);
  const updateStepData = useApplicationStore((state) => state.updateStepData);

const handleSaveAndNext = async (storeKey: string, data: any) => {
  try {
    updateStepData(storeKey, data);

    // Sync progress to backend
    const response = await axios.patch(ENDPOINTS.SYNC(leadId), { 
      [storeKey]: data, 
      currentStep: currentStep + 1 
    });
    
    // Update store with the full object from server (contains assigned FO, etc.)
    if (response.data) {
      useApplicationStore.getState().hydrateFromBackend(response.data);
    }

    if (currentStep === 9) {
      // Flag complete within local state dictionary store
      useApplicationStore.getState().updateStepData('isProfileComplete', true);
      
      // Escape the modal form flow completely and exit clean back to Tabs
      navigation.replace('MainTabs');
    } else {
      setStepPointer(currentStep + 1);
    }
  } catch (error) {
    console.error("Local data persistence error:", error);
  }
};

  const handleBack = () => {
    if (currentStep > 1) {
      setStepPointer(currentStep - 1);
    }
  };

  const getStepHeading = () => {
    switch (currentStep) {
      case 1: return "Basic Details";
      case 2: return "Education Details";
      case 3: return "Test Scores";
      case 4: return "Academic History";
      case 5: return "Course Financials";
      case 6: return "Financial Assets";
      case 7: return "Student Relations";
      case 8: return "Own House Guarantor";
      case 9: return "Personal References";
      default: return "Application Complete";
    }
  };

  // Safe Rendering Step Switching Layer
  const renderActiveStepForm = () => {
    switch (currentStep) {
      case 1: 
        return <Step1BasicDetails onSave={(data) => handleSaveAndNext('basicDetails', data)} />;
      case 2:
        return <Step2EducationDetails onSave={(data) => handleSaveAndNext('educationDetails', data)} onBack={handleBack} />;
      case 3:
        return <Step3TestScores onSave={(data) => handleSaveAndNext('testScores', data)} onBack={handleBack} />;
      case 4:
        return <Step4AcademicHistory onSave={(data) => handleSaveAndNext('academicHistory', data)} onBack={handleBack} />;
      case 5:
        return <Step5CourseFinancials onSave={(data) => handleSaveAndNext('courseFinancials', data)} onBack={handleBack} />;
      case 6: 
        return <Step6FinancialAssets onSave={(data) => handleSaveAndNext('financialAssets', data)} onBack={handleBack} />;
      case 7: 
        return <Step7StudentRelations onSave={(data) => handleSaveAndNext('coApplicant', data)} onBack={handleBack} />;
      case 8:
        return <Step8OwnHouseGuarantor onSave={(data) => handleSaveAndNext('ownHouseGuarantor', data)} onBack={handleBack} />;
      case 9:
        return <Step9References onSave={(data) => handleSaveAndNext('references', data)} onBack={handleBack} />;
      
      // Fallback dashboard layout rendering when currentStep is completed (> 6)
      default:
        return (
          <ScrollView contentContainerStyle={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
            <Text style={styles.successTitle}>Profile Complete!</Text>
            <Text style={styles.successSub}>Your profile application data is moving forward smoothly with our field officers.</Text>
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Header Ribbon Strip */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.stepTitleLabel}>{getStepHeading()}</Text>
        <Text style={styles.headerText}>Step {currentStep <= 9 ? currentStep : 9} of 9</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min((currentStep / 9) * 100, 100)}%` }]} />
        </View>
      </View>

      {/* Screen Body View Frame */}
      <View style={{ flex: 1 }}>
        {renderActiveStepForm()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  stepTitleLabel: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  headerText: { fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 8 },
  progressBarBg: { height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4B2C85' },
  globalFooter: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10 },
  navTab: { alignItems: 'center', justifyContent: 'center', width: '25%' },
  activeTab: { borderTopColor: '#4B2C85' },
  tabLabel: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 4 },
  activeLabelText: { color: '#4B2C85' },
  successContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginTop: 16, marginBottom: 8 },
  successSub: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 }
});
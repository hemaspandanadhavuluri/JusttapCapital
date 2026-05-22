import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

// Import All Screens
import LandingScreen from '../screens/LandingScreen';
import SignupScreen from '../screens/SignupScreen';
import OTPVerifyScreen from '../screens/OTPVerifyScreen';
import BasicDetailsScreen from '../screens/BasicDetailsScreen';
import FurtherEducationScreen from '../screens/FurtherEducationScreen';
import TestScoresScreen from '../screens/TestScoresScreen';
import StudentDetailsScreen from '../screens/StudentDetailsScreen';
import FinancialsScreen from '../screens/FinancialsScreen';
import AssetsScreen from '../screens/AssetsScreen';
import CoApplicantsScreen from '../screens/CoApplicantsScreen';
import ReferencesScreen from '../screens/ReferencesScreen';
import IdentityScreen from '../screens/IdentityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import SupportScreen from '../screens/SupportScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Common configuration shared by your forms
const stackScreenOptions = {
  headerStyle: { backgroundColor: '#FFF' },
  headerTintColor: '#4B2C85',
  headerTitleStyle: { fontWeight: 'bold' as const },
  headerBackTitle: ' ',
};

// --- Home / Onboarding Tab Stack ---
const HomeStack = () => (
  <Stack.Navigator initialRouteName="Landing" screenOptions={stackScreenOptions}>
    <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
    <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} options={{ title: 'Verification' }} />
    <Stack.Screen name="BasicDetails" component={BasicDetailsScreen} options={{ title: 'Personal Details' }} />
    <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Help & Support' }} />
  </Stack.Navigator>
);

// --- Loans Funnel Tab Stack ---
const LoansStack = () => (
  <Stack.Navigator initialRouteName="FurtherEducation" screenOptions={stackScreenOptions}>
    <Stack.Screen name="FurtherEducation" component={FurtherEducationScreen} options={{ title: 'Loan Details' }} />
    <Stack.Screen name="AcademicExcellence" component={TestScoresScreen} options={{ title: 'Test Scores' }} />
    <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} options={{ title: 'Academic Background' }} />
    <Stack.Screen name="CourseFinancials" component={FinancialsScreen} options={{ title: 'Financials' }} />
    <Stack.Screen name="AssetsCollateral" component={AssetsScreen} options={{ title: 'Assets' }} />
    <Stack.Screen name="CoApplicants" component={CoApplicantsScreen} options={{ title: 'Co-applicants' }} />
    <Stack.Screen name="References" component={ReferencesScreen} options={{ title: 'References' }} />
    <Stack.Screen name="IdentityVerification" component={IdentityScreen} options={{ title: 'Identity' }} />
  </Stack.Navigator>
);

// --- Documents Tab Stack ---
const DocumentsStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
    <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ title: 'Terms of Service' }} />
  </Stack.Navigator>
);

// --- Profile Tab Stack ---
const ProfileStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
  </Stack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0F172A', // Dark Navy tone matched from your design files
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 75,
          paddingBottom: 12,
          paddingTop: 12,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ color }) => {
          let iconName: any;
          if (route.name === 'Home') iconName = 'home-sharp';
          else if (route.name === 'Loans') iconName = 'wallet-sharp';
          else if (route.name === 'Documents') iconName = 'folder-sharp';
          else if (route.name === 'Profile') iconName = 'person-sharp';

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Loans" component={LoansStack} />
      <Tab.Screen name="Documents" component={DocumentsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
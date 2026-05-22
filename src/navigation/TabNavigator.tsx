import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Authenticated Screen Imports
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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: '#FFF' },
  headerTintColor: '#4B2C85',
  headerTitleStyle: { fontWeight: 'bold' as const },
  headerBackTitle: ' ',
};

// Nested stack running inside the "Loans" Tab
const LoansStack = () => (
  <Stack.Navigator initialRouteName="BasicDetails" screenOptions={stackScreenOptions}>
    <Stack.Screen name="BasicDetails" component={BasicDetailsScreen} options={{ title: 'Personal Details' }} />
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

// Nested stack running inside the "Documents" Tab
const DocumentsStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
    <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ title: 'Terms of Service' }} />
  </Stack.Navigator>
);

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#94A3B8',
        
        // FIX part 1: Explicitly instruct React Navigation how to handle the safe zone calculation
        safeAreaInsets: {
          bottom: insets.bottom,
        },
        
        // FIX part 2: Adaptive style parameters that adapt gracefully to hardware buttons
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          
          // Dynamically compute the bottom space requirement
          // If a hardware/software bar exists, use its height + padding; otherwise use a fallback 60px height.
          height: insets.bottom > 0 ? 60 + insets.bottom : 65,
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
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
      <Tab.Screen name="Home" component={ProfileScreen} />
      <Tab.Screen name="Loans" component={LoansStack} />
      <Tab.Screen name="Documents" component={DocumentsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
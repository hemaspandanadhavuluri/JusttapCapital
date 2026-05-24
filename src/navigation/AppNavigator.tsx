import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Root Auth Stack Screens
import LandingScreen from '../screens/LandingScreen';
import SignupScreen from '../screens/SignupScreen';
import OTPVerifyScreen from '../screens/OTPVerifyScreen';
import SupportScreen from '../screens/SupportScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

// Core Application Navigation Shell
import { MainTabNavigator } from './MainTabNavigator';
import { WizardContainer } from '../screens/WizardContainer';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
      {/* Pre-auth Pipeline Stack */}
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />

      {/* Support & Legal Stack */}
      <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: true, title: 'Support' }} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ headerShown: true, title: 'Terms of Service' }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: true, title: 'Privacy Policy' }} />

      {/* Main Tabbed Home Interface */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
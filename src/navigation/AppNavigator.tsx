import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';

// Import Entrance Context Screens
import LandingScreen from '../screens/LandingScreen';
import SignupScreen from '../screens/SignupScreen';
import OTPVerifyScreen from '../screens/OTPVerifyScreen';
import SupportScreen from '../screens/SupportScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Landing"
        screenOptions={{
          headerStyle: { backgroundColor: '#FFF' },
          headerTintColor: '#4B2C85',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: ' ',
        }}
      >
        {/* Core Auth Screens */}
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} options={{ title: 'Verification' }} />
        
        {/* Helper Legal and Support Utility Screens */}
        <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Help & Support' }} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ title: 'Terms of Service' }} />

        {/* Core Secure System Entrance (INCLUDES FIXED FOOTER BAR) */}
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
          options={{ headerShown: false, gestureEnabled: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
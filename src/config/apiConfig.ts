/**
 * central API configuration
 * Replace this IP with your current machine IP or '10.0.2.2' if using Android Emulator
 */
export const API_BASE_URL = 'http://10.130.71.17:5000'; // Example: 'http://

export const ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/api/app-onboarding/register`,
  VERIFY_OTP: `${API_BASE_URL}/api/app-onboarding/verify-otp`,
  RESEND_OTP: `${API_BASE_URL}/api/app-onboarding/resend-otp`,
  SYNC: (leadId: string) => `${API_BASE_URL}/api/app-onboarding/sync/${leadId}`,
  STATUS: (leadId: string) => `${API_BASE_URL}/api/app-onboarding/status/${leadId}`,
  UPLOAD_DOCUMENT: (leadId: string) => `${API_BASE_URL}/api/app-onboarding/upload-document/${leadId}`,
};
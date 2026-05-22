import axios from 'axios';

// Replace with your local machine IP if testing on a real phone
const BASE_URL = 'https://api.justtapcapital.com'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const createLead = async (leadData: any) => {
  try {
    // In a real app, this sends data to your Node.js backend
    const response = await api.post('/leads', {
      ...leadData,
      source: 'JusttapCapital App',
    });
    return response.data; 
  } catch (error) {
    // For now, if the API isn't live, we return a mock FO so you can keep testing
    console.warn('API not found, using mock FO data');
    return {
      assignedFO: {
        name: 'Vikram Singh',
        phone: '+919876543210',
        role: 'Specialist: Overseas Education'
      }
    };
  }
};
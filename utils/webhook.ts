import axios from 'axios';

export const callWebhookAPI = async () => {
  try {
    const response = await axios.post('/api/clerk/webhooks');
    console.log('Webhook API response:', response.data);
  } catch (error) {
    console.error('Error calling Webhook API:', error);
  }
};
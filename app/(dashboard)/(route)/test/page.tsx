'use client'

import { callWebhookAPI } from '@/utils/webhook';

const TestPage = () => {
  const handleCallWebhook = async () => {
    await callWebhookAPI();
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleCallWebhook}>Call Webhook API</button>
    </div>
  );
};

export default TestPage;
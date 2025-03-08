const jwt = require('jsonwebtoken');

// Get these values from https://app.videosdk.live/settings/api-keys
const API_KEY = 'd42ae13d-414f-4636-8c38-6818d51113ec'; // This appears to be the API key from the other token

// WARNING: NEVER commit this secret key to version control
// If you don't have the secret key, you'll need to get it from your VideoSDK dashboard
const SECRET_KEY = '7YWCEh3A1vQcnTh0zwAEXrndtwlQNmRKdgtKBLPj1qQ'; // Replace this with your actual key if needed

const payload = {
  apikey: API_KEY,
  permissions: ["allow_join"], // Add other permissions as needed
  version: 2,
  roles: ["CRAWLER"],
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
};

const token = jwt.sign(payload, SECRET_KEY);
console.log("Your new token:");
console.log(token);
console.log("\nAdd this token to your .env.local file as NEXT_PUBLIC_VIDEOSDK_TOKEN");
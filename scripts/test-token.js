const jwt = require('jsonwebtoken');
const https = require('https');

// Define static tokens to try
const STATIC_TOKENS = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJkNDJhZTEzZC00MTRmLTQ2MzYtOGMzOC02ODE4ZDUxMTEzZWMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sInZlcnNpb24iOjIsInJvbGVzIjpbIkNSQVdMRVIiXSwiaWF0IjoxNzQxMzIyMjUxLCJleHAiOjE3NDM5MTQyNTF9.r0fpmmhTgOPLYI3-afm72AuCD47MW0Yp7-IrHrJkVq4",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI1MDVhMmUwZC1mMDIwLTQzNDktOWJlYS0xODAwMTJiMzExMDkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwOTIxMTkxNywiZXhwIjoxNzQwNzQ3OTE3fQ.jMepBdGN9OEcT3KQc4HBSi5KWt5TV3QKgYc9SLQS_q8"
];

async function validateToken(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.videosdk.live',
      path: '/v2/rooms/validate-token',
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ valid: true, data });
        } else {
          resolve({ valid: false, status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function createMeeting(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.videosdk.live',
      path: '/v2/rooms',
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const jsonData = JSON.parse(data);
            resolve({ success: true, roomId: jsonData.roomId });
          } catch (e) {
            resolve({ success: false, error: 'Invalid JSON response', data });
          }
        } else {
          resolve({ success: false, status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify({}));
    req.end();
  });
}

// Try multiple API keys to find which one works
async function tryMultipleKeys() {
  // List of potential API keys and secrets to try
  const apiConfigs = [
    {
      apiKey: 'd42ae13d-414f-4636-8c38-6818d51113ec',
      secretKey: '7YWCEh3A1vQcnTh0zwAEXrndtwlQNmRKdgtKBLPj1qQ'
    },
    { 
      apiKey: '505a2e0d-f020-4349-9bea-180012b31109',
      secretKey: '7YWCEh3A1vQcnTh0zwAEXrndtwlQNmRKdgtKBLPj1qQ'
    },
    // Try with different formats for each API key with various secrets
    {
      apiKey: 'd42ae13d-414f-4636-8c38-6818d51113ec',
      secretKey: 'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhjR2x0'
    },
    { 
      apiKey: '505a2e0d-f020-4349-9bea-180012b31109',
      secretKey: 'your-videosdk-secret'
    }
  ];

  for (const config of apiConfigs) {
    console.log(`\nTrying API Key: ${config.apiKey}`);
    
    const payload = {
      apikey: config.apiKey,
      permissions: ["allow_join", "allow_mod"],
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 1 day
    };

    try {
      const token = jwt.sign(payload, config.secretKey);
      console.log(`Generated token: ${token}`);

      console.log('Validating token...');
      const validationResult = await validateToken(token);
      console.log('Validation result:', validationResult);

      if (validationResult.valid) {
        console.log('Token is valid! Trying to create a meeting...');
        const meetingResult = await createMeeting(token);
        console.log('Meeting creation result:', meetingResult);
        
        if (meetingResult.success) {
          console.log(`SUCCESS! Meeting created with ID: ${meetingResult.roomId}`);
          console.log(`\nUSE THIS CONFIGURATION:`);
          console.log(`API_KEY: ${config.apiKey}`);
          console.log(`SECRET_KEY: ${config.secretKey}`);
          console.log(`TOKEN: ${token}`);
          return true;
        }
      }
    } catch (error) {
      console.error(`Error with API key ${config.apiKey}:`, error);
    }
  }
  
  console.log('\nNone of the API keys worked.');
  return false;
}

async function tryStaticTokens() {
  console.log('\n=== TRYING STATIC TOKENS ===');
  
  for (const token of STATIC_TOKENS) {
    console.log(`\nTrying static token: ${token.substring(0, 20)}...`);
    
    try {
      console.log('Validating token...');
      const validationResult = await validateToken(token);
      console.log('Validation result:', validationResult);

      if (validationResult.valid) {
        console.log('Token is valid! Trying to create a meeting...');
        const meetingResult = await createMeeting(token);
        console.log('Meeting creation result:', meetingResult);
        
        if (meetingResult.success) {
          console.log(`SUCCESS! Meeting created with ID: ${meetingResult.roomId}`);
          console.log(`\nUSE THIS TOKEN: ${token}`);
          return true;
        }
      }
    } catch (error) {
      console.error(`Error with token:`, error);
    }
  }
  
  console.log('\nNone of the static tokens worked. Trying to generate keys...');
  return false;
}

// First try static tokens, then try generating new ones
async function runTests() {
  if (await tryStaticTokens()) {
    return;
  }
  
  await tryMultipleKeys();
}

runTests();
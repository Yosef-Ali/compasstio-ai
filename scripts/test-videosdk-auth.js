// Simple script to test VideoSDK token generation and room creation
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

// Get credentials from environment or hardcode for testing
const API_KEY = '325f588e-f4c0-4570-9af4-f41642cdeab5';
const SECRET_KEY = '67a4e195789d97cca1388069bed382028f92d8459b42c72da554a4b629725dc0';

// Generate a token using the exact format from VideoSDK docs
async function generateToken() {
    const payload = {
        apikey: API_KEY,
        permissions: ["allow_join", "allow_mod", "allow_create"],
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour
    };

    return jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });
}

// Test room creation using the generated token
async function testCreateRoom(token) {
    try {
        console.log('Using token:', token.substring(0, 20) + '...');

        const response = await fetch('https://api.videosdk.live/v2/rooms', {
            method: 'POST',
            headers: {
                'Authorization': token, // No 'Bearer' prefix
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                region: 'sg001',
                template: 'group-call'
            })
        });

        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response body:', responseText);

        try {
            const data = JSON.parse(responseText);
            console.log('Parsed data:', data);
            return data;
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            return null;
        }
    } catch (error) {
        console.error('Error creating room:', error);
        return null;
    }
}

// Execute the test
async function runTest() {
    try {
        console.log('Generating token...');
        const token = await generateToken();
        console.log('Token generated successfully!');

        console.log('Testing room creation...');
        const result = await testCreateRoom(token);

        if (result && result.roomId) {
            console.log('✅ SUCCESS! Room created with ID:', result.roomId);
        } else {
            console.log('❌ FAILED! Could not create room');
        }
    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

runTest();
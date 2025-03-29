import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getToken } from '@/lib/api';

export async function GET() {
    try {
        const API_KEY = process.env.VIDEOSDK_API_KEY;
        const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

        if (!API_KEY || !SECRET_KEY) {
            return NextResponse.json(
                { error: "VideoSDK API key or secret key is missing" },
                { status: 500 }
            );
        }

        // Create payload with permissions and API key
        const apiKey = API_KEY.split(" #")[0];
        const payload = {
            apikey: apiKey,
            permissions: ["allow_join"], // Add more permissions if needed
        };

        // Generate JWT token
        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: "24h", // Token will expire in 24 hours
        });

        // Decode the token and log the payload
        const decoded = jwt.decode(token);
        console.log("Decoded token payload:", decoded);

        // Return the token
        return NextResponse.json({ token });
    } catch (error) {
        console.error("Error generating VideoSDK token:", error);
        return NextResponse.json(
            { error: "Failed to generate token" },
            { status: 500 }
        );
    }
}
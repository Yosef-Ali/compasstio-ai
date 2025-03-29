import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

interface TokenResult {
    token?: string;
    error?: string;
}

export async function GET(): Promise<NextResponse<TokenResult>> {
    try {
        const API_KEY = process.env.VIDEOSDK_API_KEY;
        const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

        if (!API_KEY || !SECRET_KEY) {
            throw new Error("VideoSDK API credentials not configured");
        }

        console.log("Calling VideoSDK token API with keys:", {
            apiKey: API_KEY,
            secretKeyLength: SECRET_KEY?.length
        });

        // Generate JWT token locally
        // Clean keys - remove any comments or whitespace
        const cleanApiKey = API_KEY.split('#')[0].trim();
        const cleanSecretKey = SECRET_KEY.split('#')[0].trim();

        console.log("Using cleaned API key:", cleanApiKey);

        const payload = {
            apikey: cleanApiKey,
            permissions: ["allow_join", "allow_mod", "allow_create_room"],
            version: 2,
            role: "host",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3 // 3 hour expiration
        };

        const token = jwt.sign(
            payload,
            cleanSecretKey,
            {
                algorithm: 'HS256'
            }
        );

        console.log("Successfully generated JWT token");

        // Store the token for other parts of the app
        process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN = token;

        return NextResponse.json({ token });
    } catch (error: any) {
        console.error("Error generating token:", {
            error: error.message,
            stack: error.stack,
            keys: {
                apiKeyExists: !!process.env.VIDEOSDK_API_KEY,
                secretKeyExists: !!process.env.VIDEOSDK_SECRET_KEY
            }
        });

        return NextResponse.json(
            {
                error: error.message || "Failed to generate token",
                details: error.stack
            },
            { status: 500 }
        );
    }
}

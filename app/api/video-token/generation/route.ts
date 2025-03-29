import { NextResponse } from "next/server";

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

        // Call VideoSDK's token generation API
        const response = await fetch("https://api.videosdk.live/v2/rooms/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apiKey: API_KEY,
                apiSecret: SECRET_KEY, // Note: Changed from secretKey to apiSecret
                // Optionally configure token settings
                permissions: ["allow_join", "allow_mod"], // Basic permissions
            }),
        });

        console.log("VideoSDK API Response Status:", response.status);

        const responseText = await response.text();
        console.log("VideoSDK API Response Text:", responseText);

        if (!response.ok) {
            throw new Error(`VideoSDK token generation failed: ${response.status} - ${responseText}`);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse response as JSON:", responseText);
            throw new Error("Invalid JSON response from VideoSDK");
        }

        const token = data.token || data.authToken; // Try both possible token field names

        if (!token) {
            console.error("Response data:", data);
            throw new Error("No token found in VideoSDK response");
        }

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
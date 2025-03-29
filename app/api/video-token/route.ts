import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// import { API_KEY, SECRET_KEY } from '@/lib/constants'; // Remove this line

export async function GET(req: NextRequest) {
  try {
    console.log("Token generation endpoint called");

    const API_KEY = process.env.API_KEY;
    const VIDEOSDK_SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

    if (!API_KEY || !VIDEOSDK_SECRET_KEY) {
      console.error("Missing API_KEY or VIDEOSDK_SECRET_KEY");
      return NextResponse.json(
        { error: "API key or Secret key not configured" },
        { status: 500 }
      );
    }

    // Validate that API_KEY is a string to prevent instanceof errors
    if (typeof API_KEY !== 'string' || typeof VIDEOSDK_SECRET_KEY !== 'string') {
      console.error("API_KEY or VIDEOSDK_SECRET_KEY is not a string");
      return NextResponse.json(
        { error: "Invalid API key or Secret key format" },
        { status: 500 }
      );
    }

    const payload = {
      apikey: API_KEY,
      permissions: ["allow_join", "allow_mod"], // Include both permissions
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days expiration
    };

    console.log("Token payload:", payload);
    // Use try-catch specifically for the JWT signing to catch any potential errors
    let token;
    try {
      token = jwt.sign(payload, VIDEOSDK_SECRET_KEY as string);
      console.log("Generated token:", token);
    } catch (signError) {
      console.error("Error signing JWT:", signError);
      return NextResponse.json(
        { error: "Failed to sign token" },
        { status: 500 }
      );
    }

    // Validate the token immediately to ensure it works
    try {
      const validationResponse = await fetch('https://api.videosdk.live/v2/rooms/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (validationResponse.ok) {
        console.log("Token validated successfully");
      } else {
        const errorText = await validationResponse.text();
        console.error("Token validation failed:", validationResponse.status, errorText);
        return NextResponse.json(
          { error: "Generated token failed validation" },
          { status: 500 }
        );
      }
    } catch (validationError) {
      console.error("Error validating token:", validationError);
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
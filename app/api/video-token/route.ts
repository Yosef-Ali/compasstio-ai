import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    console.log("Starting token generation...");
    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;
    
    if (!API_KEY || !SECRET_KEY) {
      throw new Error("Missing VideoSDK credentials - need both API_KEY and SECRET_KEY");
    }
    
    // Generate token with proper payload structure for VideoSDK v2
    const payload = {
      apikey: API_KEY,
      permissions: ["allow_join", "allow_mod", "allow_create"],
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour expiration
    };
    
    const token = jwt.sign(
      payload,
      SECRET_KEY,
      {
        algorithm: 'HS256'
      }
    );
    
    console.log("Successfully generated dynamic token");
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("Error getting token:", {
      message: error.message,
      stack: error.stack,
      credentials: {
        apiKeyExists: !!process.env.VIDEOSDK_API_KEY,
        apiKeyLength: process.env.VIDEOSDK_API_KEY?.length,
        secretKeyExists: !!process.env.VIDEOSDK_SECRET_KEY,
        secretKeyLength: process.env.VIDEOSDK_SECRET_KEY?.length
      },
      originalError: error
    });

    return NextResponse.json(
      {
        error: error.message || "Failed to get video token",
        details: {
          stack: error.stack,
          type: error.constructor.name,
          cause: error.cause
        }
      },
      { status: 500 }
    );
  }
}

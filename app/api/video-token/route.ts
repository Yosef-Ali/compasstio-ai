import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) { // Accept request object
  try {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId"); // Get roomId from query params

    console.log(`Starting token generation... ${roomId ? `for room: ${roomId}` : '(no specific room)'}`);
    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

    if (!API_KEY || !SECRET_KEY) {
      throw new Error("Missing VideoSDK credentials - need both API_KEY and SECRET_KEY");
    }

    // Clean secret key - remove any comments or whitespace
    const cleanSecretKey = SECRET_KEY.split('#')[0].trim();

    // Clean API key - remove any comments or whitespace
    const cleanApiKey = API_KEY.split('#')[0].trim();

    console.log("Using cleaned API key:", cleanApiKey);

    // Generate token payload
    const payload: any = { // Use 'any' for flexibility or define a proper type
      apikey: cleanApiKey,
      permissions: ["allow_join", "allow_mod"], // Default permissions
      version: 2,
      role: "participant", // Default role for joining
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3 // 3 hour expiration
    };

    // If roomId is provided, add it to the payload and adjust permissions/role if necessary
    if (roomId) {
      payload.roomId = roomId;
      payload.permissions = ["allow_join"]; // Only join permission needed for a specific room
      // Keep role as participant unless specific logic requires host/mod for joining
    } else {
      // If no roomId, grant create room permission (for creating new meetings)
      payload.permissions.push("allow_create_room");
      payload.role = "host"; // Typically, creator is host
    }

    console.log("Generated token payload:", payload);

    const token = jwt.sign(
      payload,
      cleanSecretKey,
      {
        algorithm: 'HS256'
      }
    );

    console.log(`Successfully generated dynamic token ${roomId ? `for room ${roomId}` : ''}`);
    return NextResponse.json({ token });

  } catch (error: any) {
    console.error("Error generating token:", {
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

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Mock implementation since VideoSDK tokens aren't working
export async function GET(req: NextRequest) {
  try {
    // Generate a mock token that doesn't need validation
    const mockToken = "mock-token-" + crypto.randomBytes(16).toString('hex');
    
    return NextResponse.json({ token: mockToken });
  } catch (error) {
    console.error('Error generating mock token:', error);
    return NextResponse.json(
      { error: "Failed to generate mock token" },
      { status: 500 }
    );
  }
}

// Mock endpoint to create a meeting
export async function POST(req: NextRequest) {
  try {
    // Generate a random meeting ID
    const meetingId = "mock-meeting-" + crypto.randomBytes(8).toString('hex');
    
    return NextResponse.json({ roomId: meetingId });
  } catch (error) {
    console.error('Error creating mock meeting:', error);
    return NextResponse.json(
      { error: "Failed to create mock meeting" },
      { status: 500 }
    );
  }
}
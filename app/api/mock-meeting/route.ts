import { NextRequest, NextResponse } from "next/server";

const MOCK_ROOM_ID_PREFIX = "mock-meeting-";

export async function POST(request: NextRequest) {
  try {
    // Generate a random mock room ID
    const randomId = Math.random().toString(36).substring(2, 10);
    const roomId = `${MOCK_ROOM_ID_PREFIX}${randomId}`;

    console.log("Created mock meeting room:", roomId);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      roomId,
      message: "Mock meeting room created successfully",
      success: true
    });
  } catch (error: any) {
    console.error("Error creating mock meeting:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create mock meeting",
        success: false
      },
      { status: 500 }
    );
  }
}

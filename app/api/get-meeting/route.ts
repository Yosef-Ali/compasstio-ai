import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Get meetingId from query parameter
    const url = new URL(request.url);
    const meetingId = url.searchParams.get("meetingId");

    if (!meetingId) {
        return NextResponse.json(
            {
                error: "meetingId is required",
                success: false
            },
            { status: 400 }
        );
    }

    // For mock meetings, we'll return dummy data
    if (meetingId.startsWith("mock-meeting-")) {
        return NextResponse.json({
            id: meetingId,
            totalActiveParticipants: 1,
            participants: [
                {
                    id: "mock-participant-1",
                    name: "You",
                    isLocal: true,
                    isActiveSpeaker: false,
                    isMainParticipant: true,
                    webcamOn: false,
                    micOn: false,
                    screenShareOn: false,
                    mode: "CONFERENCE",
                    quality: "high"
                }
            ],
            activeSpeakerId: null,
            pinnedParticipants: [],
            hlsState: null,
            streamState: null,
            recordingState: null,
            chatEnabled: true,
            pollsEnabled: true,
            whiteboardEnabled: true,
            hlsPlaylistUrl: null,
            success: true
        });
    }

    // For non-mock meetings, we would normally fetch from VideoSDK API
    // But since we're only using mock meetings, return a not found error
    return NextResponse.json(
        {
            error: "Meeting not found",
            success: false
        },
        { status: 404 }
    );
}

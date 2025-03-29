import React, { useEffect, useState, useRef } from 'react';
import { useMeeting as originalUseMeeting, usePubSub as originalUsePubSub } from "@videosdk.live/react-sdk";
import { CONSTANTS, safeUseMeeting, safePubSub, initializeVideoSDKConstants } from "@/lib/video-sdk-wrapper";
import { useRouter } from 'next/navigation';

// Create safe versions of the hooks
const useMeeting = (config) => safeUseMeeting(originalUseMeeting, config);
const usePubSub = (topic, options) => safePubSub(originalUsePubSub, topic, options);

// Import necessary UI components
import { Box, Typography, Button, CircularProgress } from "@material-ui/core";

/**
 * Main VideoConference component that handles the meeting UI and functionality
 */
const VideoConference = ({
    meetingId,
    participantName,
    micEnabled = true,
    webcamEnabled = true,
    onMeetingLeave = () => { },
}) => {
    const router = useRouter();
    const [isMeetingJoined, setIsMeetingJoined] = useState(false);
    const [isMeetingLeft, setIsMeetingLeft] = useState(false);
    const [participants, setParticipants] = useState([]);
    const mMeetingRef = useRef();

    // Initialize VideoSDK constants
    useEffect(() => {
        initializeVideoSDKConstants();
    }, []);

    // Event handlers for the meeting
    function onParticipantJoined(participant) {
        console.log("Participant joined:", participant.displayName);
        setParticipants(prevParticipants => [...prevParticipants, participant.id]);
    }

    function onParticipantLeft(participant) {
        console.log("Participant left:", participant.displayName);
        setParticipants(prevParticipants =>
            prevParticipants.filter(pId => pId !== participant.id)
        );
    }

    function onMeetingJoined() {
        console.log("Meeting joined!");
        setIsMeetingJoined(true);
    }

    function onMeetingLeft() {
        console.log("Meeting left!");
        setIsMeetingLeft(true);
        onMeetingLeave();
    }

    // Initialize meeting with our safe wrapper
    const mMeeting = useMeeting({
        onParticipantJoined,
        onParticipantLeft,
        onMeetingJoined,
        onMeetingLeft,
    });

    // Store meeting reference for later use
    useEffect(() => {
        mMeetingRef.current = mMeeting;
    }, [mMeeting]);

    // Render waiting state if not joined yet
    if (!isMeetingJoined) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                padding={4}
            >
                <CircularProgress size={48} />
                <Typography variant="h6" style={{ marginTop: 16 }}>
                    Joining meeting...
                </Typography>
            </Box>
        );
    }

    // Render meeting left state
    if (isMeetingLeft) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                padding={4}
            >
                <Typography variant="h5" gutterBottom>
                    You have left the meeting
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/dashboard')}
                >
                    Back to Dashboard
                </Button>
            </Box>
        );
    }

    // Main meeting UI
    return (
        <Box className="video-conference-container" height="100%">
            <Box className="participants-area" display="flex" flexWrap="wrap" flex={1}>
                {participants.length === 0 ? (
                    <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                        <Typography>No other participants yet</Typography>
                    </Box>
                ) : (
                    participants.map((participantId) => (
                        <Box
                            key={participantId}
                            className="participant-tile"
                            width={participants.length === 1 ? "100%" : "50%"}
                            height={participants.length <= 2 ? "100%" : "50%"}
                            padding={1}
                        >
                            <Box
                                className="participant-video"
                                width="100%"
                                height="100%"
                                bgcolor="rgba(0,0,0,0.2)"
                                borderRadius={4}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Typography>
                                    {participantId === mMeeting?.localParticipant?.id ? "You" : `Participant ${participantId}`}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            {/* Meeting controls */}
            <Box
                className="meeting-controls"
                padding={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgcolor="rgba(0,0,0,0.1)"
            >
                <Button
                    variant="contained"
                    color={mMeeting?.localMicOn ? "default" : "secondary"}
                    style={{ margin: '0 8px' }}
                    onClick={() => mMeeting?.toggleMic()}
                >
                    {mMeeting?.localMicOn ? "Mute" : "Unmute"}
                </Button>

                <Button
                    variant="contained"
                    color={mMeeting?.localWebcamOn ? "default" : "secondary"}
                    style={{ margin: '0 8px' }}
                    onClick={() => mMeeting?.toggleWebcam()}
                >
                    {mMeeting?.localWebcamOn ? "Stop Camera" : "Start Camera"}
                </Button>

                <Button
                    variant="contained"
                    style={{ margin: '0 8px', backgroundColor: '#f44336', color: 'white' }}
                    onClick={() => mMeeting?.leave()}
                >
                    Leave
                </Button>
            </Box>
        </Box>
    );
};

export default VideoConference;
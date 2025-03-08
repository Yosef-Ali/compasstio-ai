import React, { useEffect, useState, useRef } from 'react';
// Use safe wrappers from our video-sdk-wrapper
import { useMeeting as originalUseMeeting, usePubSub as originalUsePubSub } from "@videosdk.live/react-sdk";
import { CONSTANTS, safeUseMeeting, safePubSub } from "@/lib/video-sdk-wrapper";
import { useRouter } from 'next/navigation';

// Create safe versions of the hooks
const useMeeting = (config) => safeUseMeeting(originalUseMeeting, config);
const usePubSub = (topic, options) => safePubSub(originalUsePubSub, topic, options);

// Import necessary components
import { Box, Typography, Button, CircularProgress } from "@material-ui/core";
import SelfView from './MeetingContainer/SelfView';

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
    const [activeSpeakerId, setActiveSpeakerId] = useState(null);
    const [raisedHandsParticipants, setRaisedHandsParticipants] = useState([]);
    const mMeetingRef = useRef();

    // Function to track participants who raised their hands
    const useRaisedHandParticipants = () => {
        return {
            participantRaisedHand: (participantId) => {
                setRaisedHandsParticipants((prev) => {
                    if (!prev.includes(participantId)) {
                        return [...prev, participantId];
                    }
                    return prev;
                });

                // Auto-remove raised hand after 5 seconds
                setTimeout(() => {
                    setRaisedHandsParticipants((prev) =>
                        prev.filter(id => id !== participantId)
                    );
                }, 5000);
            },
        };
    };

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

    const onSpeakerChanged = (activeSpeakerId) => {
        setActiveSpeakerId(activeSpeakerId);
    };

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
        onSpeakerChanged,
        onMeetingJoined,
        onMeetingLeft,
    });

    // Store meeting reference for later use
    useEffect(() => {
        mMeetingRef.current = mMeeting;

        // Log available constants for debugging
        console.log("Available Constants:", CONSTANTS);
        console.log("PARTICIPANTS value:", CONSTANTS.PARTICIPANTS);
    }, [mMeeting]);

    // Handle participant events based on their mode
    const handleParticipantEvent = (participant) => {
        // Using our safe CONSTANTS wrapper
        switch (participant.mode) {
            case CONSTANTS.PARTICIPANTS.MODERATOR:
                console.log(`${participant.displayName} is a moderator`);
                break;
            case CONSTANTS.PARTICIPANTS.VIEWER:
                console.log(`${participant.displayName} is a viewer`);
                break;
            default:
                console.log(`${participant.displayName} has role: ${participant.mode}`);
                break;
        }
    };

    // Setup PubSub for chat messages and raised hands
    const { raisedHandsParticipants: raiseHandParticipants } = useRaisedHandParticipants();

    usePubSub("CHAT", {
        onMessageReceived: (data) => {
            const { senderId, senderName, message } = data;
            console.log(`Chat message from ${senderName}: ${message}`);
        },
    });

    usePubSub("RAISE_HAND", {
        onMessageReceived: (data) => {
            const { senderId, senderName } = data;
            console.log(`${senderName} raised hand`);
            raiseHandParticipants(senderId);
        },
    });

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
                        <SelfView />
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
                            {/* This would be your ParticipantView component */}
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
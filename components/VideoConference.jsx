import React, { useEffect, useState } from 'react';
import { ParticipantView } from "@videosdk.live/react-sdk";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import necessary UI components
import { Box, Typography, Button, CircularProgress } from "@material-ui/core";

// Define the same storage keys as in MeetingContext
const STORAGE_MEETING_ID = 'meeting_active_id';
const STORAGE_MEETING_ACTIVE = 'meeting_is_active';

// Helper function to check localStorage directly
const checkMeetingActiveInStorage = () => {
    // Only run in browser
    if (typeof window === 'undefined') return { isActive: false, id: null };

    try {
        const storedId = localStorage.getItem(STORAGE_MEETING_ID);
        const isActive = localStorage.getItem(STORAGE_MEETING_ACTIVE) === 'true';
        return { isActive: isActive && !!storedId, id: storedId };
    } catch (e) {
        console.error("Error reading meeting state from localStorage:", e);
        return { isActive: false, id: null };
    }
};

// Dynamically import the context hook to ensure it runs client-side
const useMeetingContext = dynamic(
    () => import('@/app/context/MeetingContext').then(mod => mod.useMeetingContext),
    { ssr: false }
);
// Consider replacing Material UI with Shadcn UI components if used elsewhere for consistency
// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/spinner";

/**
 * Main VideoConference component that handles the meeting UI and functionality
 */
const VideoConference = ({
    // Only prop needed is onMeetingLeave callback from layout/context
    onMeetingLeave,
}) => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [storageMeetingActive, setStorageMeetingActive] = useState(false);

    // Set client flag and check localStorage on mount
    useEffect(() => {
        setIsClient(true);

        // Check localStorage when component mounts
        const storageState = checkMeetingActiveInStorage();
        setStorageMeetingActive(storageState.isActive);

        console.log("[VideoConference] Initial localStorage check:", storageState);

        // Set up listener for localStorage changes
        const handleStorageChange = () => {
            const storageState = checkMeetingActiveInStorage();
            setStorageMeetingActive(storageState.isActive);
            console.log("[VideoConference] Storage changed:", storageState);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // --- Client-side only rendering ---
    // Render placeholder during SSR or before client mount
    if (!isClient) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <CircularProgress size={48} />
                <Typography style={{ marginLeft: 8 }}>Loading Video...</Typography>
            </Box>
        );
    }

    // Now that we are on the client, we can safely use the hook
    // But also reference localStorage state as a backup
    let contextMeetingActive = false;
    let mMeeting = null;

    try {
        const context = useMeetingContext();
        contextMeetingActive = context.isMeetingActive;
        mMeeting = context.mMeeting;
        console.log("[VideoConference] Context State:", {
            contextMeetingActive,
            storageMeetingActive
        });
    } catch (err) {
        console.error("Error accessing meeting context in VideoConference:", err);
    }

    // Combined state - active if either source says so
    const isMeetingActive = contextMeetingActive || storageMeetingActive;

    // Continue with the same logic, but be defensive about mMeeting being null
    const participants = mMeeting?.participants ? [...mMeeting.participants.keys()] : [];
    const localParticipantId = mMeeting?.localParticipant?.id;

    // Derived state
    const isMeetingJoined = mMeeting?.isMeetingJoined || false;
    const isMeetingLeft = !isMeetingActive || (mMeeting && !isMeetingJoined);

    // Render loading/joining state with more complete checks
    if (!isMeetingActive || !mMeeting || !isMeetingJoined) {
        if (!isMeetingActive) {
            return (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" padding={4}>
                    <Typography variant="h5" gutterBottom>Meeting ended or inactive</Typography>
                </Box>
            );
        }
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
    if (isMeetingLeft && !isMeetingActive) { // Refined condition: Show only if context confirms inactive
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
        <Box className="video-conference-container" height="100%" display="flex" flexDirection="column"> {/* Ensure flex column */}
            {/* Participant Grid */}
            <Box className="participants-area" display="flex" flexWrap="wrap" flex={1} overflow="auto" bgcolor="rgba(0,0,0,0.1)"> {/* Added background */}
                {/* Local Participant (Self View) */}
                {localParticipantId && (
                    <Box
                        key={localParticipantId}
                        className="participant-tile"
                        width={participants.length === 0 ? "100%" : "50%"} // Adjust layout based on participant count
                        height={participants.length === 0 ? "100%" : "50%"}
                        padding={1}
                        position="relative" // For potential overlay elements
                        bgcolor="black" // Background for video area
                    >
                        <ParticipantView participantId={localParticipantId} quality="high" />
                        <Typography style={{ position: 'absolute', bottom: 8, left: 8, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px', fontSize: '0.8rem' }}>
                            You ({mMeeting?.localParticipant?.displayName})
                        </Typography>
                    </Box>
                )}
                {/* Remote Participants */}
                {participants
                    .filter(id => id !== localParticipantId) // Exclude local participant
                    .map((participantId) => (
                        <Box
                            key={participantId}
                            className="participant-tile"
                            width="50%" // Adjust layout as needed
                            height="50%"
                            padding={1}
                            position="relative"
                            bgcolor="black" // Background for video area
                        >
                            <ParticipantView participantId={participantId} quality="high" />
                            {/* Display participant name (optional) */}
                            <Typography style={{ position: 'absolute', bottom: 8, left: 8, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {mMeeting?.participants?.get(participantId)?.displayName || `Participant ${participantId.slice(-4)}`}
                            </Typography>
                        </Box>
                    ))
                }
            </Box>

            {/* Meeting controls */}
            <Box
                className="meeting-controls"
                padding={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgcolor="rgba(0,0,0,0.3)" // Darker background for controls
                flexShrink={0} // Prevent controls from shrinking
            >
                {/* Use mMeeting object from context for controls */}
                <Button
                    variant="contained"
                    color={mMeeting?.localMicOn ? "default" : "secondary"} // Use mMeeting from context
                    style={{ margin: '0 8px' }}
                    onClick={() => mMeeting?.toggleMic()} // Use mMeeting from context
                >
                    {mMeeting?.localMicOn ? "Mute" : "Unmute"} {/* Use mMeeting from context */}
                </Button>

                <Button
                    variant="contained"
                    color={mMeeting?.localWebcamOn ? "default" : "secondary"} // Use mMeeting from context
                    style={{ margin: '0 8px' }}
                    onClick={() => mMeeting?.toggleWebcam()} // Use mMeeting from context
                >
                    {mMeeting?.localWebcamOn ? "Stop Camera" : "Start Camera"} {/* Use mMeeting from context */}
                </Button>

                <Button
                    variant="contained"
                    style={{ margin: '0 8px', backgroundColor: '#f44336', color: 'white' }}
                    onClick={() => {
                        mMeeting?.leave(); // Use mMeeting from context
                        // onMeetingLeave callback (passed from layout) will trigger context update
                        // No need to call onMeetingLeave() directly here if hook callback works
                    }}
                >
                    Leave
                </Button>
            </Box>
        </Box>
    );
};

// Remove React.memo if it was added previously
export default VideoConference;

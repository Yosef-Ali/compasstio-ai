"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create mock contexts to simulate VideoSDK behavior
export const MeetingContext = createContext<any>({});
export const ParticipantContext = createContext<any>({});

interface MockMeetingProviderProps {
    config: {
        meetingId: string;
        micEnabled: boolean;
        webcamEnabled: boolean;
        name: string;
    };
    token: string;
    joinWithoutUserInteraction?: boolean;
    reinitialiseMeetingOnConfigChange?: boolean;
    children: React.ReactNode;
}

export const MockMeetingProvider: React.FC<MockMeetingProviderProps> = ({
    config,
    token,
    children,
}) => {
    const [mockMeeting, setMockMeeting] = useState({
        meetingId: config.meetingId,
        localParticipant: {
            id: 'local-participant-id',
            displayName: config.name,
            webcamOn: config.webcamEnabled,
            micOn: config.micEnabled,
            isLocal: true,
            pinState: null,
            screenShareEnabled: false,
            mode: 'CONFERENCE',
        },
        participants: new Map(),
        presenterId: null as string | null,
        pinnedParticipants: [],
        localMicOn: config.micEnabled,
        localWebcamOn: config.webcamEnabled,
        toggleMic: () => {
            setMockMeeting(prev => ({
                ...prev,
                localMicOn: !prev.localMicOn,
                localParticipant: {
                    ...prev.localParticipant,
                    micOn: !prev.localMicOn
                }
            }));
        },
        toggleWebcam: () => {
            setMockMeeting(prev => ({
                ...prev,
                localWebcamOn: !prev.localWebcamOn,
                localParticipant: {
                    ...prev.localParticipant,
                    webcamOn: !prev.localWebcamOn
                }
            }));
        },
        startScreenShare: () => {
            setMockMeeting(prev => ({
                ...prev,
                presenterId: 'local-participant-id',
                localParticipant: {
                    ...prev.localParticipant,
                    screenShareEnabled: true
                }
            }));
        },
        stopScreenShare: () => {
            setMockMeeting(prev => ({
                ...prev,
                presenterId: null,
                localParticipant: {
                    ...prev.localParticipant,
                    screenShareEnabled: false
                }
            }));
        },
        join: () => {
            console.log("Joining mock meeting:", config.meetingId);
            // Already "joined" by rendering
        },
        leave: () => {
            console.log("Leaving mock meeting:", config.meetingId);
            // Cleanup would happen here in a real implementation
        },
        end: () => {
            console.log("Ending mock meeting:", config.meetingId);
            // Cleanup would happen here in a real implementation
        },
        changeWebcam: (deviceId: string) => {
            console.log("Changing webcam to:", deviceId);
        },
        changeMic: (deviceId: string) => {
            console.log("Changing mic to:", deviceId);
        },
        enableMic: () => {
            setMockMeeting(prev => ({
                ...prev,
                localMicOn: true,
                localParticipant: {
                    ...prev.localParticipant,
                    micOn: true
                }
            }));
        },
        disableMic: () => {
            setMockMeeting(prev => ({
                ...prev,
                localMicOn: false,
                localParticipant: {
                    ...prev.localParticipant,
                    micOn: false
                }
            }));
        },
        enableWebcam: () => {
            setMockMeeting(prev => ({
                ...prev,
                localWebcamOn: true,
                localParticipant: {
                    ...prev.localParticipant,
                    webcamOn: true
                }
            }));
        },
        disableWebcam: () => {
            setMockMeeting(prev => ({
                ...prev,
                localWebcamOn: false,
                localParticipant: {
                    ...prev.localParticipant,
                    webcamOn: false
                }
            }));
        },
    });

    // Simulate initializing a meeting
    useEffect(() => {
        console.log("Mock meeting initialized with ID:", config.meetingId);
        // Simulate "joining" with a small delay to mimic real behavior
        const timer = setTimeout(() => {
            console.log("Mock participant joined the meeting");
        }, 1000);
        return () => {
            clearTimeout(timer);
            console.log("Mock meeting cleanup");
        };
    }, [config.meetingId]);

    // Define a mock participant
    const mockParticipant = {
        id: mockMeeting.localParticipant.id,
        displayName: config.name,
        webcamOn: mockMeeting.localWebcamOn,
        micOn: mockMeeting.localMicOn,
        isLocal: true,
        screenShareStream: mockMeeting.localParticipant.screenShareEnabled ? { track: null } : null,
        screenShareOn: mockMeeting.localParticipant.screenShareEnabled,
        pinState: mockMeeting.localParticipant.pinState,
        setQuality: () => { },
        setViewPort: () => { },
        pin: () => { },
        unpin: () => { },
    };

    return (
        <MeetingContext.Provider value={mockMeeting}>
            <ParticipantContext.Provider value={mockParticipant}>
                {children}
            </ParticipantContext.Provider>
        </MeetingContext.Provider>
    );
};

// Hook to use meeting context
export const useMockMeeting = () => {
    const context = useContext(MeetingContext);
    if (context === undefined) {
        throw new Error('useMockMeeting must be used within a MockMeetingProvider');
    }
    return context;
};

// Hook to use participant context
export const useMockParticipant = (participantId: string) => {
    const context = useContext(ParticipantContext);
    if (context === undefined) {
        throw new Error('useMockParticipant must be used within a MockMeetingProvider');
    }
    return context;
};

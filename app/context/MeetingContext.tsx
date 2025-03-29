"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react'; // To get user name

// Dynamically import VideoSDK components to prevent SSR issues
import dynamic from 'next/dynamic';

// Define types for VideoSDK components we'll import dynamically
type MeetingProviderProps = {
    config: {
        meetingId: string;
        micEnabled: boolean;
        webcamEnabled: boolean;
        name: string;
        debugMode: boolean;
    };
    token: string;
    children: React.ReactNode;
};

// Create placeholders for dynamically imported components
let VideoSDKMeetingProvider: React.FC<MeetingProviderProps> | null = null;
let originalUseMeeting: any = null;
let safeUseMeeting: any = null;
let initializeVideoSDKConstants: any = null;

// Flag to track if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Storage keys for persisting meeting state
const STORAGE_MEETING_ID = 'meeting_active_id';
const STORAGE_MEETING_ACTIVE = 'meeting_is_active';

// Function to safely use the meeting hook
const useMeeting = (config: any) => {
    if (!isBrowser || !safeUseMeeting || !originalUseMeeting) return null;
    return safeUseMeeting(originalUseMeeting, config);
};

// Helper functions for localStorage
const getMeetingStateFromStorage = () => {
    if (!isBrowser) return { meetingId: null, isMeetingActive: false };

    try {
        const storedMeetingId = localStorage.getItem(STORAGE_MEETING_ID);
        const storedMeetingActive = localStorage.getItem(STORAGE_MEETING_ACTIVE) === 'true';

        return {
            meetingId: storedMeetingId,
            isMeetingActive: storedMeetingActive && !!storedMeetingId
        };
    } catch (e) {
        console.error("Error reading meeting state from localStorage:", e);
        return { meetingId: null, isMeetingActive: false };
    }
};

const setMeetingStateInStorage = (meetingId: string | null, isMeetingActive: boolean) => {
    if (!isBrowser) return;

    try {
        if (meetingId && isMeetingActive) {
            localStorage.setItem(STORAGE_MEETING_ID, meetingId);
            localStorage.setItem(STORAGE_MEETING_ACTIVE, 'true');
        } else {
            localStorage.removeItem(STORAGE_MEETING_ID);
            localStorage.removeItem(STORAGE_MEETING_ACTIVE);
        }
    } catch (e) {
        console.error("Error setting meeting state in localStorage:", e);
    }
};

// Import SDK components only on client side
if (isBrowser) {
    // Import VideoSDK components
    import("@videosdk.live/react-sdk").then((module) => {
        originalUseMeeting = module.useMeeting;
        VideoSDKMeetingProvider = module.MeetingProvider;
    });

    // Import wrapper functions
    import("@/lib/video-sdk-wrapper").then((module) => {
        safeUseMeeting = module.safeUseMeeting;
        initializeVideoSDKConstants = module.initializeVideoSDKConstants;

        // Initialize constants once imported
        if (initializeVideoSDKConstants) {
            initializeVideoSDKConstants();
        }
    });
}

interface MeetingContextProps {
    meetingId: string | null;
    isMeetingActive: boolean;
    mMeeting: any; // Store the meeting object from the hook
    startMeeting: (id: string) => void;
    endMeeting: () => void;
}

const MeetingContext = createContext<MeetingContextProps | undefined>(undefined);

// Component to manage the actual VideoSDK hook logic
const MeetingSDKManager = ({ meetingId, participantName, onMeetingLeftContext, setMMeetingContext }: {
    meetingId: string,
    participantName: string,
    onMeetingLeftContext: () => void,
    setMMeetingContext: (meeting: any) => void
}) => {
    const mMeetingRef = useRef<any>(null);

    function onMeetingJoined() {
        console.log("Hook: onMeetingJoined");
        // Potentially update context state if needed, but mMeeting object should suffice
    }

    function onMeetingLeft() {
        console.log("Hook: onMeetingLeft");
        setMMeetingContext(null); // Clear the meeting object in context
        onMeetingLeftContext(); // Notify the outer provider to set inactive
    }

    // Initialize meeting hook
    const mMeeting = useMeeting({
        onMeetingJoined,
        onMeetingLeft,
    });

    // Update context with the mMeeting object whenever it changes
    useEffect(() => {
        setMMeetingContext(mMeeting);
        mMeetingRef.current = mMeeting; // Keep local ref if needed
    }, [mMeeting, setMMeetingContext]);

    // Effect to join the meeting
    useEffect(() => {
        if (mMeetingRef.current && meetingId && !mMeetingRef.current.isMeetingJoined) {
            console.log("Attempting to join meeting via context hook:", meetingId);
            mMeetingRef.current.join();
        }
        // Cleanup: Leave meeting if the component unmounts while active
        return () => {
            if (mMeetingRef.current && mMeetingRef.current.isMeetingJoined) {
                console.log("Leaving meeting on SDK Manager unmount");
                mMeetingRef.current.leave();
            }
        }
    }, [meetingId]); // Only depends on meetingId

    // This component doesn't render anything itself, it just manages the hook
    return null;
};

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state from localStorage if available
    const initialState = getMeetingStateFromStorage();
    const [meetingId, setMeetingIdState] = useState<string | null>(initialState.meetingId);
    const [isMeetingActive, setIsMeetingActiveState] = useState<boolean>(initialState.isMeetingActive);
    const [mMeeting, setMMeeting] = useState<any>(null); // State to hold the meeting object from the hook
    const { user } = useUser();

    // Log provider state on render/mount
    console.log("[MeetingProvider] Render/Mount - State:", { meetingId, isMeetingActive });

    // Custom setters that update both React state and localStorage
    const setMeetingId = useCallback((id: string | null) => {
        setMeetingIdState(id);
        setMeetingStateInStorage(id, id ? true : false);
    }, []);

    const setIsMeetingActive = useCallback((active: boolean) => {
        setIsMeetingActiveState(active);
        setMeetingStateInStorage(meetingId, active);
    }, [meetingId]);

    // Initialize VideoSDK constants once on client
    useEffect(() => {
        if (isBrowser && initializeVideoSDKConstants) {
            initializeVideoSDKConstants();
        }
    }, []);

    const startMeeting = useCallback((id: string) => {
        if (isMeetingActive || !isBrowser) return;
        console.log("MeetingProvider: Starting meeting with ID:", id);
        setMeetingId(id);
        setIsMeetingActive(true);
        // Additional direct localStorage update for redundancy
        setMeetingStateInStorage(id, true);
    }, [isMeetingActive, setMeetingId, setIsMeetingActive]);

    // This function will be called by MeetingSDKManager when the meeting actually ends
    const handleMeetingLeft = useCallback(() => {
        console.log("MeetingProvider: handleMeetingLeft called");
        setMeetingId(null);
        setIsMeetingActive(false);
        setMMeeting(null);
        // Additional direct localStorage update for redundancy
        setMeetingStateInStorage(null, false);
    }, [setMeetingId, setIsMeetingActive]);

    // This function is called by UI elements (like Leave button) to initiate leaving
    const endMeeting = useCallback(() => {
        console.log("MeetingProvider: endMeeting called (intent to leave)");
        if (mMeeting && typeof mMeeting.leave === 'function') {
            console.log("MeetingProvider: Calling mMeeting.leave()");
            mMeeting.leave(); // Trigger the leave process
        } else {
            // If no meeting object, just reset state
            console.log("MeetingProvider: No mMeeting object, forcing state reset");
            handleMeetingLeft();
        }
    }, [mMeeting, handleMeetingLeft]); // Depend on mMeeting and the actual cleanup function

    const participantName = user?.fullName || user?.username || "Guest";

    // Single Context Provider wrapping everything
    return (
        <MeetingContext.Provider value={{ meetingId, isMeetingActive, mMeeting, startMeeting, endMeeting }}>
            {/* Conditionally render the SDK Provider and Manager *within* the main context */}
            {/* These components do not render UI themselves */}
            {isBrowser && isMeetingActive && meetingId && VideoSDKMeetingProvider && (
                <VideoSDKMeetingProvider
                    config={{
                        meetingId: meetingId,
                        micEnabled: true,
                        webcamEnabled: true,
                        name: participantName,
                        debugMode: false,
                    }}
                    token={process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN || ""}
                >
                    {/* MeetingSDKManager manages the hook and updates the mMeeting state */}
                    <MeetingSDKManager
                        meetingId={meetingId}
                        participantName={participantName}
                        onMeetingLeftContext={handleMeetingLeft} // Pass the actual cleanup function
                        setMMeetingContext={setMMeeting} // Pass the state setter
                    />
                </VideoSDKMeetingProvider>
            )}
            {/* Render the actual application children */}
            {children}
        </MeetingContext.Provider>
    );
};

export const useMeetingContext = () => {
    const context = useContext(MeetingContext);
    if (context === undefined) {
        throw new Error('useMeetingContext must be used within a MeetingProvider');
    }
    return context;
};

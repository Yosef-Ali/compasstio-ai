"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMeetingContext } from '@/app/context/MeetingContext';
import { Typography, Box } from "@material-ui/core";
import { ErrorBoundary } from "react-error-boundary";

// Define the same storage keys as in MeetingContext
const STORAGE_MEETING_ID = 'meeting_active_id';
const STORAGE_MEETING_ACTIVE = 'meeting_is_active';

// Dynamically import components that use VideoSDK to prevent SSR issues
const DynamicVideoChatWrapper = dynamic(
    () => import("@/app/(dashboard)/_components/video-chat/VideoChatWrapper"),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center w-full h-full min-h-[500px] bg-gray-800 text-white">
                Loading video chat...
            </div>
        ),
    }
);

// Keep DynamicThemeProvider if needed by DynamicVideoChatWrapper
const DynamicThemeProvider = dynamic(
    () => import("@/app/context/ThemeProvider").then((mod) => mod.default),
    { ssr: false }
);

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

// Keep ErrorFallback definition
interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
    console.error("[LiveSessionsPage] Rendering ErrorFallback:", error);
    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800 text-white p-4">
            <h2 className="text-xl font-semibold mb-4">Video Chat Error</h2>
            <p className="mb-4">There was an error loading the video chat:</p>
            <pre className="bg-gray-900 p-4 rounded mb-4 max-w-full overflow-auto">
                {error.message}
            </pre>
            <button
                onClick={resetErrorBoundary}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
                Try Again
            </button>
        </div>
    );
};

// Helper component for the active meeting message
const ActiveMeetingMessage = ({ meetingId }: { meetingId: string | null }) => (
    <Box className="flex flex-col items-center justify-center w-full h-full min-h-[calc(100vh-6rem)] bg-gray-800 text-white p-6 rounded-lg shadow-inner">
        <Typography variant="h5" component="h2" className="font-semibold mb-4">
            Meeting in Progress
        </Typography>
        <Typography variant="body1" className="mb-2">
            The active meeting is displayed in the overlay.
        </Typography>
        <Typography variant="caption" className="text-gray-400">
            Meeting ID: {meetingId}
        </Typography>
    </Box>
);

const LiveSessionsClientContent = () => {
    // Use state to track client-side mounting
    const [isClient, setIsClient] = useState(false);

    // Get meeting state from context
    const contextValues = useMeetingContext();
    const { isMeetingActive: contextMeetingActive, meetingId: contextMeetingId } = contextValues;

    // Also set up state for localStorage check
    const [storageMeetingActive, setStorageMeetingActive] = useState(false);
    const [storageMeetingId, setStorageMeetingId] = useState<string | null>(null);

    // Log the values for debugging
    console.log("[LiveSessionsClientContent] Context State:", {
        contextMeetingActive,
        contextMeetingId,
        storageMeetingActive,
        storageMeetingId
    });

    // Combined state - meeting is active if either context OR localStorage says so
    const isMeetingActive = isClient && (contextMeetingActive || storageMeetingActive);
    const meetingId = contextMeetingId || storageMeetingId;

    // Effect to check localStorage directly on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true);
            const storageState = checkMeetingActiveInStorage();
            setStorageMeetingActive(storageState.isActive);
            setStorageMeetingId(storageState.id);

            console.log("[LiveSessionsClientContent] Initial localStorage check:", storageState);
        }
    }, []);

    // Set up a listener to check storage changes (in case another tab changes it)
    useEffect(() => {
        const handleStorageChange = () => {
            const storageState = checkMeetingActiveInStorage();
            setStorageMeetingActive(storageState.isActive);
            setStorageMeetingId(storageState.id);
            console.log("[LiveSessionsClientContent] Storage changed:", storageState);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        }
    }, []);

    // Render based on combined state
    return (
        <>
            {/* Conditionally render based on meeting state */}
            {isMeetingActive ? (
                <ActiveMeetingMessage meetingId={meetingId} />
            ) : (
                // Render the original video chat wrapper when no meeting is active
                <div className="relative w-full h-full min-h-[calc(100vh-6rem)] bg-gray-800 overflow-hidden">
                    <DynamicThemeProvider>
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                            <DynamicVideoChatWrapper controlsVisible={true} />
                        </ErrorBoundary>
                    </DynamicThemeProvider>
                </div>
            )}
        </>
    );
};

export default LiveSessionsClientContent;

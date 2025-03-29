"use client";

import React, { useEffect, useState } from 'react';
import { useMeetingContext } from "@/app/context/MeetingContext";
import dynamic from 'next/dynamic';
import { useUser } from "@clerk/clerk-react";
import SideMenu from "../_components/sidebar-menu";

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

// Dynamically import VideoConference to avoid SSR issues
const VideoConference = dynamic(
    () => import("@/components/VideoConference"),
    { ssr: false }
);

const ClientMeetingContent = ({ children }) => {
    const [isClient, setIsClient] = useState(false);
    const { user } = useUser();

    // State to store localStorage check results
    const [storageMeetingActive, setStorageMeetingActive] = useState(false);
    const [storageMeetingId, setStorageMeetingId] = useState(null);

    // Client-side initialization
    useEffect(() => {
        setIsClient(true);

        // Check localStorage on mount
        const storageState = checkMeetingActiveInStorage();
        setStorageMeetingActive(storageState.isActive);
        setStorageMeetingId(storageState.id);

        console.log("[ClientMeetingContent] Initial localStorage check:", storageState);

        // Set up listener for localStorage changes
        const handleStorageChange = () => {
            const storageState = checkMeetingActiveInStorage();
            setStorageMeetingActive(storageState.isActive);
            setStorageMeetingId(storageState.id);
            console.log("[ClientMeetingContent] Storage changed:", storageState);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Render placeholder during SSR
    if (!isClient) {
        return (
            <div className="flex relative min-h-screen">
                <SideMenu />
                <main className="flex flex-col flex-grow min-h-screen w-full self-start">{children}</main>
            </div>
        );
    }

    // --- Client-side only rendering ---
    // Get context values, but have localStorage as backup
    let contextMeetingActive = false;
    let contextMeetingId = null;
    let endMeeting = () => { }; // Default function

    try {
        const context = useMeetingContext();
        contextMeetingActive = context.isMeetingActive;
        contextMeetingId = context.meetingId;
        endMeeting = context.endMeeting;
        console.log("[ClientMeetingContent] Context State:", {
            contextMeetingActive,
            contextMeetingId,
            storageMeetingActive,
            storageMeetingId
        });
    } catch (err) {
        console.error("Error accessing meeting context:", err);
    }

    // Combined state - active if either context or localStorage says so
    const isMeetingActive = contextMeetingActive || storageMeetingActive;
    const meetingId = contextMeetingId || storageMeetingId;

    return (
        <div className="flex relative min-h-screen">
            <SideMenu />
            <main className="flex flex-col flex-grow min-h-screen w-full self-start">{children}</main>

            {/* Conditionally render VideoConference based on combined state */}
            {isMeetingActive && meetingId && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
                    <div className="bg-background border rounded-lg shadow-xl w-full max-w-4xl h-[85vh] overflow-auto relative flex flex-col">
                        <VideoConference
                            participantName={user?.fullName || user?.username || "Guest"}
                            onMeetingLeave={endMeeting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientMeetingContent;

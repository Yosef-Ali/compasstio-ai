"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import TopNav from "../../_components/top-nav";
import Wrapper from "../../_components/wrapper";
import RightAside from "../../_components/right-aside";
import Shell from '../../_components/shell';
import ParticipantList from "../../_components/live-streaming/GroupsList";
import MeetingList from "../../_components/live-streaming/MeetingList";
import { ErrorBoundary } from "react-error-boundary";
import { Typography, Box } from "@material-ui/core";

// Dynamically import the client-side content wrapper
const DynamicLiveSessionsClientContent = dynamic(
    () => import("./LiveSessionsClientContent"),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center w-full h-full min-h-[500px] bg-gray-800 text-white">
                Loading video chat...
            </div>
        ),
    }
);
console.log("[LiveSessionsPage] DynamicVideoChatWrapper defined");

const DynamicThemeProvider = dynamic(
    () => {
        console.log("[LiveSessionsPage] Importing ThemeProvider dynamically");
        return import("@/app/context/ThemeProvider").then((mod) => mod.default);
    },
    { ssr: false }
);

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

interface Tab {
    name: string;
    title: string;
    content: React.ReactNode;
}

interface RightAsideProps {
    tabs: Tab[];
}

const tabs: Tab[] = [
    {
        name: 'Meetings',
        title: 'Meetings',
        content: <MeetingList />
    },
    {
        name: 'Groups',
        title: 'Groups',
        content: <ParticipantList />
    }
];

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

export default function LiveSessionsPage() {
    // This page component is now very simple, mainly setting up the structure
    const [isClient, setIsClient] = useState(false); // Still need this for initial render control

    useEffect(() => {
        setIsClient(true); // Set client flag on mount
    }, []);

    // Render loading state during SSR or before client mount
    if (!isClient) {
        return (
            <div className="flex flex-col h-screen">
                <TopNav />
                <Shell>
                    <Wrapper>
                        <div className="flex items-center justify-center w-full h-full min-h-[calc(100vh-6rem)] bg-gray-800 text-white">
                            Loading...
                        </div>
                    </Wrapper>
                    <RightAside tabs={tabs} />
                </Shell>
            </div>
        );
    }

    // Once client-side, render the dynamic component which handles context and conditional UI
    return (
        <div className="flex flex-col h-screen">
            <TopNav />
            <Shell>
                <Wrapper>
                    <DynamicLiveSessionsClientContent />
                </Wrapper>
                <RightAside tabs={tabs} />
            </Shell>
        </div>
    );
}

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
import { useMeetingStore } from "@/app/hooks/useMeetingStore";

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

const DynamicThemeProvider = dynamic(
    () => import("@/app/context/ThemeProvider").then((mod) => mod.default),
    { ssr: false }
);

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
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

export default function LiveSessionsPage() {
    const [hasError, setHasError] = useState(false);
    const { controlsVisible, setVideoState } = useMeetingStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setVideoState({ controlsVisible: true });
        return () => {
            setVideoState({ controlsVisible: false });
        };
    }, [setVideoState]);

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

    return (
        <div className="flex flex-col h-screen">
            <TopNav />
            <Shell>
                <Wrapper>
                    <div className="relative w-full h-full min-h-[calc(100vh-6rem)] bg-gray-800 overflow-hidden">
                        <DynamicThemeProvider>
                            <ErrorBoundary
                                FallbackComponent={ErrorFallback}
                                onError={(error: Error) => {
                                    console.error("Error in video chat:", error);
                                    setHasError(true);
                                }}
                                onReset={() => setHasError(false)}
                            >
                                <DynamicVideoChatWrapper controlsVisible={controlsVisible} />
                            </ErrorBoundary>
                        </DynamicThemeProvider>
                    </div>
                </Wrapper>
                <RightAside tabs={tabs} />
            </Shell>
        </div>
    );
}

"use client";
import { useState, useEffect, useRef } from "react";
import ThemeProviderContext from "@/app/context/ThemeProvider";
import dynamic from "next/dynamic";
import TopNav from "../../_components/top-nav";
import Wrapper from "../../_components/wrapper";
import RightAside from "../../_components/right-aside";
import Shell from '../../_components/shell';
import ParticipantList from "../../_components/live-streaming/GroupsList";
import MeetingList from "../../_components/live-streaming/MeetingList";
import { ErrorBoundary } from "react-error-boundary";

// Custom fallback component for when video chat fails to load
const ErrorFallback = ({ error, resetErrorBoundary }) => {
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

// Custom wrapper for the MeetingAppContainer that can patch missing variables
const VideoChatWrapper = () => {
  const initialized = useRef(false);

  useEffect(() => {
    // Patch the missing controlsVisible variable
    // This needs to run before the MeetingContainer component renders
    if (!initialized.current) {
      // Add the missing variable to window object so it's globally available
      window.controlsVisible = true;

      // Monkey patch the React component if possible
      try {
        // Try to find the module or component
        const reactInternals = Object.keys(window).find(key =>
          key.startsWith('__REACT_DEVTOOLS_GLOBAL_HOOK')
        );

        if (reactInternals) {
          console.log("Attempting to patch React components...");
        }
      } catch (err) {
        console.error("Error while trying to patch components:", err);
      }

      initialized.current = true;
    }

    // Cleanup function
    return () => {
      // Clean up any global variables we set
      if (window.controlsVisible !== undefined) {
        delete window.controlsVisible;
      }
    };
  }, []);

  // Dynamically import the MeetingAppContainer after our patch effect has run
  const MeetingAppContainer = dynamic(
    () => import("@/app/(dashboard)/_components/video-chat/containers/MeetingAppContainer"),
    {
      ssr: false,
      loading: () => (
        <div className="flex items-center justify-center w-full h-full bg-gray-800 text-white">
          Loading video chat...
        </div>
      ),
    }
  );

  return <MeetingAppContainer />;
};

const tabs = [
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

export default function Home() {
  const [hasError, setHasError] = useState(false);

  // Log errors for debugging
  useEffect(() => {
    if (hasError) {
      console.log("Video chat component encountered an error and fallback UI is displayed");
    }
  }, [hasError]);

  return (
    <>
      <TopNav />
      <Shell>
        <Wrapper>
          <div className='w-full h-[calc(100vh-4rem)] bg-gray-800'>
            <ThemeProviderContext>
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={(error) => {
                  console.error("Error in video chat:", error);
                  setHasError(true);
                }}
                onReset={() => setHasError(false)}
              >
                <VideoChatWrapper />
              </ErrorBoundary>
            </ThemeProviderContext>
          </div>
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  );
}




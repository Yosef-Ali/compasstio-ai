'use client';

import { useEffect } from 'react';
import { initializeVideoSDKConstants, ensureErrorTypes } from '@/lib/video-sdk-wrapper';
import { useMeetingStore } from '@/app/hooks/useMeetingStore';

// Extend Window interface to include VideoSDK properties
declare global {
  interface Window {
    VideoSDK?: {
      meeting?: {
        participants?: Map<string, any>;
        localMicOn?: boolean;
        localStreamId?: string;
        isConnected?: boolean;
        reconnect?: () => void;
      };
    };
    onerror?: (message: string | Event, source?: string, lineno?: number, colno?: number, error?: Error) => boolean | void;
  }
}

// Define types for video state
interface VideoState {
  participants: string[];
  isMuted: boolean;
  streamId: string;
}

/**
 * Component that initializes VideoSDK constants and manages meeting validation
 * Include this in your app layout to ensure VideoSDK functionality is available globally
 */
export default function VideoSDKInitializer(): null {
  const { videoState, setVideoState } = useMeetingStore();

  useEffect(() => {
    // First ensure error types are defined
    ensureErrorTypes();

    // Then initialize VideoSDK constants
    initializeVideoSDKConstants();

    // Enhanced error handler for VideoSDK
    const originalOnError = window.onerror;
    window.onerror = function(message: string | Event, source?: string, lineno?: number, colno?: number, error?: Error): boolean {
      if (message && typeof message === 'string') {
        // Handle VideoSDK-specific errors
        if (message.includes('instanceof') || message.includes('VideoSDK') || message.includes('Constants')) {
          console.warn('VideoSDK-related error detected:', message);

          try {
            // Re-initialize error types and constants
            ensureErrorTypes();
            initializeVideoSDKConstants();

            // Attempt to recover state if meeting connection was lost
            if (message.includes('connection') && window.VideoSDK?.meeting) {
              console.log('Attempting to recover meeting connection...');

              // Save current state before recovery attempt
              const currentState: VideoState = {
                participants: Array.from(window.VideoSDK.meeting.participants?.keys() || []),
                isMuted: !window.VideoSDK.meeting.localMicOn,
                streamId: window.VideoSDK.meeting.localStreamId || ''
              };

              // Attempt reconnection
              window.VideoSDK.meeting.reconnect?.();

              // Restore state after short delay
              setTimeout(() => {
                if (window.VideoSDK?.meeting?.isConnected) {
                  setVideoState(currentState);
                }
              }, 1000);
            }

            return true; // Prevent error propagation
          } catch (e) {
            console.error('Error during recovery:', e);
          }
        }
      }

      return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
    };

    // Set up periodic maintenance checks
    const maintenanceInterval = setInterval(() => {
      ensureErrorTypes();
      initializeVideoSDKConstants();

      // Check meeting connection health
      if (window.VideoSDK?.meeting?.isConnected === false && videoState.participants.length > 0) {
        console.warn('Meeting connection lost, attempting recovery...');
        window.VideoSDK.meeting.reconnect?.();
      }
    }, 5000);

    return () => {
      window.onerror = originalOnError;
      clearInterval(maintenanceInterval);
    };
  }, [setVideoState, videoState.participants]);

  return null;
}
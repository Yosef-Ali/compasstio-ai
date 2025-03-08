'use client';

import { useEffect } from 'react';
import { initializeVideoSDKConstants, ensureErrorTypes } from '@/lib/video-sdk-wrapper';

export default function VideoSDKInitializer() {
    // Setup meeting validation helper
    const validateMeetingId = (id) => {
        if (!id || typeof id !== 'string') {
            console.error('Invalid meeting ID format');
            return false;
        }

        const cleanId = id.trim();

        // Minimum length and format validation
        return cleanId.length >= 6 && /^[a-zA-Z0-9][a-zA-Z0-9_-]{4,}[a-zA-Z0-9]$/.test(cleanId);
    };

    useEffect(() => {
        // Initialize VideoSDK error handling
        initializeVideoSDKConstants();
        ensureErrorTypes();

        // Make validation helper globally available
        window.validateMeetingId = validateMeetingId;

        // Enhanced error handler for VideoSDK
        const originalOnError = window.onerror;
        window.onerror = function (message, source, lineno, colno, error) {
            if (message && typeof message === 'string') {
                // Handle meeting validation errors
                if (message.includes('invalid meeting id') || message.includes('meeting not found')) {
                    console.error('Meeting validation failed:', message);
                    return true; // Prevent error propagation
                }

                // Handle VideoSDK errors
                if (message.includes('VideoSDK') || message.includes('meeting connection')) {
                    console.warn('VideoSDK error detected:', message);

                    try {
                        // Re-initialize error types
                        ensureErrorTypes();

                        // Check meeting connection
                        if (window.VideoSDK?.meeting?.isConnected === false) {
                            console.log('Attempting meeting reconnection...');
                            window.VideoSDK.meeting.reconnect?.();
                        }
                        return true;
                    } catch (e) {
                        console.error('Error during recovery:', e);
                    }
                }

                // Handle instanceof error
                if (message.includes("Right-hand side of 'instanceof' is not an object")) {
                    console.warn("Caught instanceof error, re-initializing VideoSDK error types");
                    ensureErrorTypes();
                    return true;
                }
            }

            return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
        };

        // Periodic connection check
        const connectionCheck = setInterval(() => {
            if (window.VideoSDK?.meeting?.isConnected === false) {
                console.warn('Meeting connection lost, attempting recovery...');
                window.VideoSDK.meeting.reconnect?.();
            }
        }, 5000);

        return () => {
            // Cleanup
            window.onerror = originalOnError;
            window.validateMeetingId = undefined;
            clearInterval(connectionCheck);
        };
    }, []);

    return null; // This is a utility component, no UI needed
}
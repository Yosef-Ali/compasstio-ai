'use client';

import { useEffect } from 'react';
import { initializeVideoSDKConstants, ensureErrorTypes } from '@/lib/video-sdk-wrapper';

/**
 * Component that initializes VideoSDK constants and manages meeting validation
 * Include this in your app layout to ensure VideoSDK functionality is available globally
 */
export default function VideoSDKInitializer() {
    useEffect(() => {
        // First ensure error types are defined
        ensureErrorTypes();

        // Then initialize VideoSDK constants
        initializeVideoSDKConstants();

        // Set up periodic check to ensure classes stay defined
        const maintenanceInterval = setInterval(() => {
            ensureErrorTypes();
            initializeVideoSDKConstants();
        }, 5000);

        // Enhanced error handler for VideoSDK
        const originalOnError = window.onerror;
        window.onerror = function (message, source, lineno, colno, error) {
            if (message && typeof message === 'string') {
                // Handle VideoSDK-specific errors
                if (message.includes('instanceof') || message.includes('VideoSDK') || message.includes('Constants')) {
                    console.warn('VideoSDK-related error detected:', message);

                    try {
                        // Re-initialize error types and constants
                        ensureErrorTypes();
                        initializeVideoSDKConstants();
                        return true; // Prevent error propagation
                    } catch (e) {
                        console.error('Error during recovery:', e);
                    }
                }
            }

            return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
        };

        return () => {
            // Cleanup
            window.onerror = originalOnError;
            clearInterval(maintenanceInterval);
        };
    }, []);

    return null; // This is a utility component, no UI needed
}

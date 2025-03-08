// Global error handler for VideoSDK errors

// This will be called from components to add our error handler 
export const setupVideoSDKErrorHandler = () => {
  // Original error handler
  const originalErrorHandler = window.onerror;

  // Our custom error handler
  window.onerror = function(message, source, lineno, colno, error) {
    // Check if this is the specific PARTICIPANTS error
    if (message && message.includes("Cannot read properties of undefined (reading 'PARTICIPANTS')")) {
      console.log("Intercepted PARTICIPANTS error, applying fix...");
      
      // Ensure the VideoSDK.Constants.PARTICIPANTS exists by creating it ourselves
      if (typeof window !== 'undefined') {
        // Define VideoSDK global if needed
        if (!window.VideoSDK) {
          window.VideoSDK = {};
        }
        
        // Define Constants if needed
        if (!window.VideoSDK.Constants) {
          window.VideoSDK.Constants = {};
        }
        
        // Define PARTICIPANTS if needed
        if (!window.VideoSDK.Constants.PARTICIPANTS) {
          window.VideoSDK.Constants.PARTICIPANTS = {
            MODERATOR: "MODERATOR",
            VIEWER: "VIEWER"
          };
        }
        
        console.log("Applied PARTICIPANTS fix");
        
        // Don't pass to the original handler since we fixed it
        return true;
      }
    }
    
    // For all other errors, call the original handler if it exists
    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error);
    }
    
    // Return false to allow the error to propagate
    return false;
  };
  
  // Return a function to restore the original error handler
  return () => {
    window.onerror = originalErrorHandler;
  };
};

// Function to ensure VideoSDK constants exist
export const ensureVideoSDKConstants = () => {
  if (typeof window !== 'undefined') {
    // Create a global VideoSDK object with Constants
    window.VideoSDK = window.VideoSDK || {};
    window.VideoSDK.Constants = window.VideoSDK.Constants || {};
    window.VideoSDK.Constants.PARTICIPANTS = window.VideoSDK.Constants.PARTICIPANTS || {
      MODERATOR: "MODERATOR",
      VIEWER: "VIEWER"
    };
    
    // Ensure other common constants exist
    window.VideoSDK.Constants.MEETING_JOINED = window.VideoSDK.Constants.MEETING_JOINED || "MEETING_JOINED";
    window.VideoSDK.Constants.MEETING_LEFT = window.VideoSDK.Constants.MEETING_LEFT || "MEETING_LEFT";
    
    console.log("VideoSDK Constants initialized");
  }
};
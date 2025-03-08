// This file provides a safe wrapper around VideoSDK to prevent undefined errors
export const CONSTANTS = {
  // These are the actual constants from VideoSDK that might be accessed
  MEETING_JOINED: "MEETING_JOINED",
  MEETING_LEFT: "MEETING_LEFT",
  RECORDING_STARTING: "RECORDING_STARTING",
  RECORDING_STARTED: "RECORDING_STARTED",
  RECORDING_STOPPING: "RECORDING_STOPPING",
  RECORDING_STOPPED: "RECORDING_STOPPED",
  LIVE_STREAM_STARTING: "LIVE_STREAM_STARTING",
  LIVE_STREAM_STARTED: "LIVE_STREAM_STARTED",
  LIVE_STREAM_STOPPING: "LIVE_STREAM_STOPPING",
  LIVE_STREAM_STOPPED: "LIVE_STREAM_STOPPED",
  PRESENTER_CHANGED: "PRESENTER_CHANGED",
  PIN_STATE_CHANGED: "PIN_STATE_CHANGED",
  PARTICIPANT_JOINED: "PARTICIPANT_JOINED",
  PARTICIPANT_LEFT: "PARTICIPANT_LEFT",
  // Audio/Video modes
  CONFERENCE: "CONFERENCE",
  VIEWER: "VIEWER",
  // Views
  GRID: "GRID",
  SIDEBAR: "SIDEBAR",
  SPOTLIGHT: "SPOTLIGHT",
  // Participants
  PARTICIPANTS: {
    MODERATOR: "MODERATOR",
    VIEWER: "VIEWER",
    ACTIVE: "ACTIVE", // Added for compatibility with some components
    PINNED: "PINNED"  // Added for compatibility with some components
  },
  // Recording events
  recordingEvents: {
    RECORDING_STARTED: "RECORDING_STARTED",
    RECORDING_STOPPED: "RECORDING_STOPPED",
    RECORDING_STARTING: "RECORDING_STARTING",
    RECORDING_STOPPING: "RECORDING_STOPPING"
  }
};

/**
 * Safely wrap VideoSDK's useMeeting hook to prevent errors
 * @param {Function} originalHook - The original useMeeting hook
 * @param {Object} config - Configuration for the meeting
 * @returns {Object} Safe meeting object with fallbacks
 */
export const safeUseMeeting = (originalHook, config) => {
  if (!originalHook || typeof originalHook !== 'function') {
    console.error("safeUseMeeting: originalHook is not a function");
    return createFallbackMeetingObject();
  }

  try {
    return originalHook(config);
  } catch (error) {
    console.error("Error in useMeeting:", error);
    return createFallbackMeetingObject();
  }
};

// Create a fallback meeting object that provides safe defaults
const createFallbackMeetingObject = () => {
  return {
    localParticipant: null,
    participants: new Map(),
    pinnedParticipants: new Map(),
    activeSpeakerId: null,
    presenterId: null,
    mainParticipantId: null,
    meeting: null,
    isMeetingJoined: false,
    // Add any other properties that might be accessed
    end: () => console.warn("Meeting end called on fallback object"),
    leave: () => console.warn("Meeting leave called on fallback object"),
    toggleMic: () => console.warn("toggleMic called on fallback object"),
    toggleWebcam: () => console.warn("toggleWebcam called on fallback object"),
    getMics: () => [],
    getWebcams: () => [],
    changeWebcam: () => console.warn("changeWebcam called on fallback object"),
    changeMic: () => console.warn("changeMic called on fallback object"),
    startRecording: () => console.warn("startRecording called on fallback object"),
    stopRecording: () => console.warn("stopRecording called on fallback object"),
    muteMic: () => console.warn("muteMic called on fallback object"),
    unmuteMic: () => console.warn("unmuteMic called on fallback object"),
    disableWebcam: () => console.warn("disableWebcam called on fallback object"),
    enableWebcam: () => console.warn("enableWebcam called on fallback object"),
    startVideo: () => console.warn("startVideo called on fallback object"),
    stopVideo: () => console.warn("stopVideo called on fallback object"),
    startLivestream: () => console.warn("startLivestream called on fallback object"),
    stopLivestream: () => console.warn("stopLivestream called on fallback object"),
    micStream: null,
    webcamOn: false,
    micOn: false,
    isLocal: false,
    isActiveSpeaker: false,
    isMainParticipant: false,
    mode: CONSTANTS.PARTICIPANTS.VIEWER
  };
};

/**
 * Safely wrap VideoSDK's useParticipant hook to prevent errors
 * @param {Function} originalHook - The original useParticipant hook
 * @param {string} participantId - ID of the participant
 * @returns {Object} Safe participant object with fallbacks
 */
export const safeUseParticipant = (originalHook, participantId) => {
  try {
    return originalHook(participantId);
  } catch (error) {
    console.error(`Error in useParticipant(${participantId}):`, error);
    // Return a safe default object
    return {
      displayName: "Participant",
      webcamStream: null,
      micStream: null,
      webcamOn: false,
      micOn: false,
      isLocal: false,
      isActiveSpeaker: false,
      isMainParticipant: false,
      mode: CONSTANTS.PARTICIPANTS.VIEWER
    };
  }
};

/**
 * Safely wrap VideoSDK's usePubSub hook to prevent errors
 * @param {Function} originalHook - The original usePubSub hook
 * @param {string} topic - Topic for pub/sub
 * @param {Object} options - Options for pub/sub
 * @returns {Object} Safe pub/sub object with fallbacks
 */
export const safePubSub = (originalHook, topic, options) => {
  if (!originalHook || typeof originalHook !== 'function') {
    console.error("safePubSub: originalHook is not a function");
    return {
      publish: () => console.warn(`publish to ${topic} called on fallback object`),
      messages: []
    };
  }

  try {
    return originalHook(topic, options);
  } catch (error) {
    console.error(`Error in usePubSub(${topic}):`, error);
    // Return dummy functions
    return {
      publish: () => console.warn(`publish to ${topic} called on fallback object`),
      messages: []
    };
  }
};

/**
 * Initialize VideoSDK global constants for browser environments
 * Call this function early in your app to ensure constants are available
 */
export const initializeVideoSDKConstants = () => {
  if (typeof window !== 'undefined') {
    // Define VideoSDK global if needed
    window.VideoSDK = window.VideoSDK || {};

    // Define base Error classes
    const BaseError = Error;

    // Define custom error classes with proper prototype chain
    window.VideoSDK.ValidationError = class ValidationError extends BaseError {
      constructor(message) {
        super(message);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
      }
    };

    window.VideoSDK.AuthError = class AuthError extends BaseError {
      constructor(message) {
        super(message);
        this.name = 'AuthError';
        Object.setPrototypeOf(this, AuthError.prototype);
      }
    };

    window.VideoSDK.MeetingError = class MeetingError extends BaseError {
      constructor(message) {
        super(message);
        this.name = 'MeetingError';
        Object.setPrototypeOf(this, MeetingError.prototype);
      }
    };

    // Define Constants if needed
    window.VideoSDK.Constants = window.VideoSDK.Constants || {};

    // Ensure all required properties exist
    Object.entries(CONSTANTS).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // For nested objects like PARTICIPANTS
        window.VideoSDK.Constants[key] = {
          ...(window.VideoSDK.Constants[key] || {}),
          ...value
        };
      } else if (window.VideoSDK.Constants[key] === undefined) {
        window.VideoSDK.Constants[key] = value;
      }
    });

    // Additional constants that might be needed
    window.VideoSDK.Constants.PARTICIPANTS = window.VideoSDK.Constants.PARTICIPANTS || {
      JOINED: "PARTICIPANT_JOINED",
      LEFT: "PARTICIPANT_LEFT",
      PINNED: "PARTICIPANT_PINNED",
      UNPINNED: "PARTICIPANT_UNPINNED"
    };

    console.log("VideoSDK Constants initialized successfully");
  }
};

// Make sure proper error classes are defined
export const ensureErrorTypes = () => {
  if (typeof window !== 'undefined') {
    const BaseError = Error;

    // Create proper error classes with correct prototype chain
    if (!window.VideoSDK) {
      window.VideoSDK = {};
    }

    if (!window.VideoSDK.ValidationError || !(window.VideoSDK.ValidationError.prototype instanceof Error)) {
      window.VideoSDK.ValidationError = class ValidationError extends BaseError {
        constructor(message) {
          super(message);
          this.name = 'ValidationError';
          Object.setPrototypeOf(this, ValidationError.prototype);
        }
      };
    }

    if (!window.VideoSDK.AuthError || !(window.VideoSDK.AuthError.prototype instanceof Error)) {
      window.VideoSDK.AuthError = class AuthError extends BaseError {
        constructor(message) {
          super(message);
          this.name = 'AuthError';
          Object.setPrototypeOf(this, AuthError.prototype);
        }
      };
    }

    if (!window.VideoSDK.MeetingError || !(window.VideoSDK.MeetingError.prototype instanceof Error)) {
      window.VideoSDK.MeetingError = class MeetingError extends BaseError {
        constructor(message) {
          super(message);
          this.name = 'MeetingError';
          Object.setPrototypeOf(this, MeetingError.prototype);
        }
      };
    }
  }
};
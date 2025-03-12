import { createContext, useContext, useState, useEffect, useRef } from 'react';

const MeetingAppContext = createContext();

export const useMeetingAppContext = () => {
  const context = useContext(MeetingAppContext);
  if (!context) {
    throw new Error('useMeetingAppContext must be used within a MeetingAppProvider');
  }
  return context;
};

export const MeetingAppProvider = ({ children }) => {
  // Persistent meeting state
  const [meetingId, setMeetingId] = useState(null);
  const [micDeviceId, setMicDeviceId] = useState(null);
  const [webcamDeviceId, setWebcamDeviceId] = useState(null);

  // UI states
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState([]);
  const [sideBarMode, setSideBarMode] = useState(null);
  const [pipMode, setPipMode] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('meetingState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setMeetingId(state.meetingId);
        setMicDeviceId(state.micId);
        setWebcamDeviceId(state.webcamId);
      } catch (error) {
        console.error('Failed to load meeting state:', error);
      }
    }
  }, []);

  // Save state before unload
  useEffect(() => {
    const saveState = () => {
      if (meetingId) {
        localStorage.setItem('meetingState', JSON.stringify({
          meetingId,
          micId: micDeviceId,
          webcamId: webcamDeviceId
        }));
      }
    };

    window.addEventListener('beforeunload', saveState);
    return () => window.removeEventListener('beforeunload', saveState);
  }, [meetingId, micDeviceId, webcamDeviceId]);

  // Raised hands functionality
  const useRaisedHandParticipants = () => {
    const participantsRef = useRef(raisedHandsParticipants);

    const participantRaisedHand = (participantId) => {
      const newParticipants = [...participantsRef.current];
      const newEntry = { participantId, raisedHandOn: Date.now() };

      const existingIndex = newParticipants.findIndex(p => p.participantId === participantId);
      if (existingIndex > -1) {
        newParticipants[existingIndex] = newEntry;
      } else {
        newParticipants.push(newEntry);
      }

      setRaisedHandsParticipants(newParticipants);
    };

    // Sync ref with state
    useEffect(() => {
      participantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    // Cleanup old entries
    useEffect(() => {
      const interval = setInterval(() => {
        const cutoff = Date.now() - 15000;
        const filtered = raisedHandsParticipants.filter(p => p.raisedHandOn > cutoff);
        if (filtered.length !== raisedHandsParticipants.length) {
          setRaisedHandsParticipants(filtered);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [raisedHandsParticipants]);

    return { participantRaisedHand };
  };

  return (
    <MeetingAppContext.Provider
      value={{
        // Persistent state
        meetingId,
        micDeviceId,
        webcamDeviceId,

        // UI state
        raisedHandsParticipants,
        sideBarMode,
        pipMode,

        // Setters
        setMeetingId,
        setMicDeviceId,
        setWebcamDeviceId,
        setRaisedHandsParticipants,
        setSideBarMode,
        setPipMode,

        // Handlers
        useRaisedHandParticipants
      }}
    >
      {children}
    </MeetingAppContext.Provider>
  );
};

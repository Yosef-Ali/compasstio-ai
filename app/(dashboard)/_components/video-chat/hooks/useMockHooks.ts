import { MeetingContext, ParticipantContext } from '../components/MockMeetingProvider';
import { useContext } from 'react';

// This file provides mock implementations of the VideoSDK hooks 
// to avoid relying on their servers

export const useMeeting = (options?: any) => {
    const context = useContext(MeetingContext);
    if (context === undefined) {
        throw new Error('useMeeting must be used within a MeetingProvider');
    }
    return context;
};

export const useParticipant = (participantId: string) => {
    // For simplicity, we always return the local participant
    const context = useContext(ParticipantContext);
    if (context === undefined) {
        throw new Error('useParticipant must be used within a MeetingProvider');
    }
    return context;
};

export const usePubSub = (topic: string, options?: any) => {
    return {
        publish: (message: string, options?: any) => {
            console.log(`[Mock PubSub] Publishing to ${topic}:`, message);
        },
        messages: [],
    };
};

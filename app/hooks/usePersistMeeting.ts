import { useEffect } from 'react';
import { useMeetingStore } from './useMeetingStore';

export const usePersistMeeting = (sdkInstance: any) => {
    const { videoState, setVideoState } = useMeetingStore();

    useEffect(() => {
        if (!sdkInstance) return;

        // Initialize from stored state
        if (videoState.isMuted) {
            sdkInstance.muteMic?.();
        }
        if (videoState.streamId) {
            sdkInstance.enableWebcam?.();
        }
        if (videoState.participants?.length) {
            // Sync participants if stored
            const participantSet = new Set(videoState.participants);
            sdkInstance.participants?.forEach((p: { id: string }) => {
                if (!participantSet.has(p.id)) {
                    participantSet.add(p.id);
                }
            });
            setVideoState({ participants: Array.from(participantSet) });
        }

        // Update store on SDK state changes
        const handleMuteChange = () => {
            setVideoState({ isMuted: sdkInstance.localMicOn === false });
        };

        const handleParticipantChange = () => {
            const participantIds = Array.from(sdkInstance.participants?.keys() || []).map((id: unknown) => String(id));
            setVideoState({ participants: participantIds });
        };

        const handleStreamChange = (streamId: string) => {
            setVideoState({ streamId });
        };

        const handleControls = (visible: boolean) => {
            setVideoState({ controlsVisible: visible });
        };

        // Attach event listeners
        sdkInstance.on?.('mic-changed', handleMuteChange);
        sdkInstance.on?.('participant-joined', handleParticipantChange);
        sdkInstance.on?.('participant-left', handleParticipantChange);
        sdkInstance.on?.('stream-enabled', handleStreamChange);
        sdkInstance.on?.('controls-visibility', handleControls);

        // Cleanup
        return () => {
            sdkInstance.off?.('mic-changed', handleMuteChange);
            sdkInstance.off?.('participant-joined', handleParticipantChange);
            sdkInstance.off?.('participant-left', handleParticipantChange);
            sdkInstance.off?.('stream-enabled', handleStreamChange);
            sdkInstance.off?.('controls-visibility', handleControls);

            // Clear state on unmount
            setVideoState({
                isMuted: false,
                participants: [],
                streamId: null,
                controlsVisible: true
            });
        };
    }, [sdkInstance, videoState.isMuted, videoState.streamId, videoState.participants, setVideoState]);
};

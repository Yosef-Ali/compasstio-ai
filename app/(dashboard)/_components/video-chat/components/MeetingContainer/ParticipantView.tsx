"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { useParticipant, useMeeting } from "@videosdk.live/react-sdk";
import { MicOff } from "@material-ui/icons";
import ReactPlayer from "react-player";
import { nameTructed } from "@/utils/helper";

interface ParticipantViewProps {
  participantId: string;
}

export function ParticipantView({ participantId }: ParticipantViewProps) {
  const {
    displayName,
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
  } = useParticipant(participantId);

  const micRef = useRef<HTMLAudioElement>(null);
  const mMeeting = useMeeting();
  const isPresenting = mMeeting.presenterId ? true : false;

  // Handle audio stream
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("[ParticipantView] Audio playback failed:", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  // Create video media stream
  const webcamMediaStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      try {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);
        return mediaStream;
      } catch (error) {
        console.error("[ParticipantView] Error creating webcam stream:", error);
        return null;
      }
    }
    return null;
  }, [webcamStream, webcamOn]);

  return (
    <div className="h-full w-full bg-gray-800 relative overflow-hidden rounded-lg">
      {/* Participant info overlay */}
      <div
        className="absolute top-2 left-2 rounded-md flex items-center justify-center p-2 z-10"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          transition: "all 200ms",
        }}
      >
        {!micOn && <MicOff fontSize="small" style={{ color: "white" }} />}
        <p className="text-sm text-white ml-1">
          {isPresenting
            ? isLocal
              ? `You are presenting`
              : `${nameTructed(displayName, 15)} is presenting`
            : isLocal
              ? "You"
              : nameTructed(displayName, 26)}
        </p>
      </div>

      {/* Audio element */}
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />

      {/* Video display */}
      <div className="absolute inset-0">
        {webcamOn && webcamMediaStream ? (
          <ReactPlayer
            playsinline
            playIcon={<></>}
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={webcamMediaStream}
            width="100%"
            height="100%"
            style={{
              objectFit: 'cover',
              backgroundColor: '#1a1a1a',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            onError={(err) => {
              console.error("[ParticipantView] Video error:", err);
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-900">
            <div className="flex items-center justify-center rounded-full bg-gray-700 h-24 w-24">
              <p className="text-3xl text-white font-medium">
                {String(displayName || "").charAt(0).toUpperCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export interface ParticipantsViewerProps {
  isPresenting?: boolean;
  sideBarMode?: string | null;
  participants: Map<string, any>;
  localParticipant?: any;
  pinnedParticipant?: string;
}

export function ParticipantsViewer({
  isPresenting = false,
  sideBarMode = null,
  participants,
  localParticipant,
  pinnedParticipant
}: ParticipantsViewerProps) {
  // Get the meeting to access the local participant
  const mMeeting = useMeeting();

  const participantIds = useMemo(() => {
    const ids = Array.from(participants.keys());

    // Always ensure local participant is included, even when alone
    if (mMeeting.localParticipant) {
      if (!ids.includes(mMeeting.localParticipant.id)) {
        ids.unshift(mMeeting.localParticipant.id);
      }
    }

    // Include other participants
    if (localParticipant && !ids.includes(localParticipant.id)) {
      ids.unshift(localParticipant.id);
    }

    if (pinnedParticipant && !ids.includes(pinnedParticipant)) {
      ids.unshift(pinnedParticipant);
    }

    return Array.from(new Set(ids));
  }, [participants, localParticipant, pinnedParticipant, mMeeting.localParticipant]);

  if (participantIds.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <p className="text-white text-lg">Waiting for participants to join...</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-gray-900 ${sideBarMode ? 'pr-[320px]' : ''}`}>
      <div
        className={`grid w-full h-full p-4 gap-4
          ${isPresenting ? 'grid-cols-1' :
            participantIds.length === 1 ? 'grid-cols-1' :
              participantIds.length === 2 ? 'grid-cols-2' :
                participantIds.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
          }
        `}
        style={{
          gridAutoRows: 'minmax(200px, 1fr)',
          alignItems: 'stretch'
        }}
      >
        {participantIds.map((participantId) => (
          <div
            key={`participant_${participantId}`}
            className="relative w-full h-full min-h-[200px] bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          >
            <ParticipantView participantId={participantId} />
          </div>
        ))}
      </div>
    </div>
  );
}

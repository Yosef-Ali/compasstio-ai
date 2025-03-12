"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { MicOff } from "@material-ui/icons";
import { nameTructed } from "@/utils/helper";

interface LocalVideoViewProps { }

export function LocalVideoView() {
  const mMeeting = useMeeting();
  const localParticipant = mMeeting?.localParticipant;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamError, setStreamError] = useState<boolean>(false);

  const { webcamStream, webcamOn, micOn, displayName } = localParticipant || {
    webcamOn: false,
    micOn: false,
    displayName: "You"
  };

  const webcamMediaStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      try {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);
        return mediaStream;
      } catch (error) {
        console.error("[LocalVideoView] Error creating media stream:", error);
        setStreamError(true);
        return null;
      }
    }
    return null;
  }, [webcamStream, webcamOn]);

  return (
    <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
      {/* Video display */}
      <div className="absolute inset-0">
        {webcamOn && webcamMediaStream ? (
          <ReactPlayer
            ref={videoRef as any}
            playsinline
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
              transform: 'rotateY(180deg)', // Mirror effect
              backgroundColor: '#1a1a1a'
            }}
            onError={(err) => {
              console.error("[LocalVideoView] Video error:", err);
              setStreamError(true);
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

      {/* Status overlay */}
      <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-lg flex items-center gap-2">
        {!micOn && <MicOff className="text-white h-4 w-4" />}
        <span className="text-white text-sm">
          {nameTructed(displayName || "You", 15)}
        </span>
      </div>

      {/* Error message */}
      {streamError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75">
          <p className="text-white text-center px-4">
            Failed to load video stream. Please check your camera permissions and try again.
          </p>
        </div>
      )}
    </div>
  );
} 
"use client";
import React, { useEffect, useRef } from "react";
import { MicOff, VideocamOff } from "@material-ui/icons";
import ReactPlayer from "react-player";

interface SelfViewProps {
  videoTrack?: MediaStreamTrack | null;
  audioTrack?: MediaStreamTrack | null;
  isVideoMuted?: boolean;
  isAudioMuted?: boolean;
  participantName?: string;
}

export function SelfView({
  videoTrack,
  audioTrack,
  isVideoMuted = false,
  isAudioMuted = false,
  participantName = "You",
}: SelfViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoTrack) {
      try {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(videoTrack);
        videoRef.current.srcObject = mediaStream;
      } catch (error) {
        console.error("[SelfView] Error setting up video:", error);
      }
    }
  }, [videoTrack]);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-lg overflow-hidden bg-gray-800">
      {videoTrack && !isVideoMuted ? (
        <ReactPlayer
          ref={videoRef as any}
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          width="100%"
          height="100%"
          style={{
            transform: 'rotateY(180deg)',
            objectFit: 'cover',
            borderRadius: 'inherit',
            overflow: 'hidden'
          }}
          onError={(err) => {
            console.error("[SelfView] Video error:", err);
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-700">
          <div className="h-24 w-24 rounded-full bg-gray-600 flex items-center justify-center text-white text-3xl">
            {participantName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Status overlay */}
      <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-lg flex items-center gap-2">
        {isAudioMuted && <MicOff className="text-white h-4 w-4" />}
        {isVideoMuted && <VideocamOff className="text-white h-4 w-4" />}
        <span className="text-white text-sm">{participantName}</span>
      </div>
    </div>
  );
} 
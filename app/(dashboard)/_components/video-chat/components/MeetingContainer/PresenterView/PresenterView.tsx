"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { useParticipant, useMeeting } from "@videosdk.live/react-sdk";
import { useTheme } from "@material-ui/core";
import { MicOff } from "@material-ui/icons";
import ScreenShare from "@material-ui/icons/ScreenShare";
import { nameTructed } from "@/utils/helper";
import ReactPlayer from "react-player";

interface PresenterViewProps {
  height?: string | number;
}

export function PresenterView({ height }: PresenterViewProps) {
  const mMeeting = useMeeting();
  const presenterId = mMeeting?.presenterId;
  const theme = useTheme();

  // Refs for media elements
  const videoPlayer = useRef<ReactPlayer>(null);
  const audioPlayer = useRef<HTMLAudioElement>(null);

  // Get presenter participant information - handle the case when presenterId is undefined
  const {
    micOn = false,
    isLocal = false,
    screenShareStream = null,
    screenShareAudioStream = null,
    screenShareOn = false,
    displayName = "",
  } = presenterId ? useParticipant(presenterId) : {};

  // Create media stream for screen sharing
  const mediaStream = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      try {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(screenShareStream.track);
        return mediaStream;
      } catch (error) {
        console.error("[PresenterView] Error creating screen share stream:", error);
        return null;
      }
    }
    return null;
  }, [screenShareStream, screenShareOn]);

  // Handle screen share audio stream
  useEffect(() => {
    if (!isLocal && audioPlayer.current && screenShareOn && screenShareAudioStream) {
      try {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(screenShareAudioStream.track);
        audioPlayer.current.srcObject = mediaStream;
        audioPlayer.current.play().catch((err) => {
          console.error("[PresenterView] Error playing audio:", err);
        });
      } catch (err) {
        console.error("[PresenterView] Error setting audio source:", err);
      }
    }
  }, [screenShareAudioStream, isLocal, screenShareOn]);

  return (
    <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
      {/* Screen share video */}
      <div className="absolute inset-0">
        {screenShareOn && mediaStream ? (
          <ReactPlayer
            ref={videoPlayer}
            playsinline
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={mediaStream}
            width="100%"
            height={height || "100%"}
            style={{
              backgroundColor: '#1a1a1a',
              objectFit: 'contain'
            }}
            onError={(err) => {
              console.error("[PresenterView] Video error:", err);
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center gap-4">
              <ScreenShare className="text-gray-400 h-16 w-16" />
              <p className="text-gray-400 text-lg">No screen share active</p>
            </div>
          </div>
        )}
      </div>
      {/* Audio element for screen share audio */}
      <audio ref={audioPlayer} autoPlay playsInline />
      {/* Presenter info overlay */}
      <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-lg flex items-center gap-2">
        {!micOn && <MicOff className="text-white h-4 w-4" />}
        <ScreenShare className="text-white h-4 w-4" />
        <span className="text-white text-sm">
          {isLocal ? "You are presenting" : `${nameTructed(displayName, 15)} is presenting`}
        </span>
      </div>
    </div>
  );
}

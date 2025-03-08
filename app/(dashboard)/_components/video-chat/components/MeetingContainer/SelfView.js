"use client";
import React, { useEffect, useRef } from "react";
import { MicOff, VideocamOff } from "@material-ui/icons";
import ReactPlayer from "react-player";

const SelfView = ({
    videoTrack,
    audioTrack,
    isVideoMuted = false,
    isAudioMuted = false,
    participantName = "You",
}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && videoTrack) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(videoTrack);
            videoRef.current.srcObject = mediaStream;
        }
    }, [videoTrack]);

    return (
        <div className="relative w-full h-full min-h-[360px] rounded-lg overflow-hidden bg-gray-800">
            {videoTrack && !isVideoMuted ? (
                <ReactPlayer
                    ref={videoRef}
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
                        console.error("SelfView video error:", err);
                    }}
                />
            ) : (
                <div className="flex items-center justify-center h-full bg-gray-700">
                    <div className="h-24 w-24 rounded-full bg-gray-600 flex items-center justify-center text-white text-3xl">
                        {participantName.charAt(0).toUpperCase()}
                    </div>
                </div>
            )}

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-white text-sm bg-black bg-opacity-50 px-3 py-1.5 rounded-md">
                    {participantName}
                </span>
                <div className="flex space-x-2">
                    {isAudioMuted && (
                        <div className="bg-red-500 rounded-full p-1.5">
                            <MicOff style={{ fontSize: '1.25rem', color: 'white' }} />
                        </div>
                    )}
                    {isVideoMuted && (
                        <div className="bg-red-500 rounded-full p-1.5">
                            <VideocamOff style={{ fontSize: '1.25rem', color: 'white' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelfView;

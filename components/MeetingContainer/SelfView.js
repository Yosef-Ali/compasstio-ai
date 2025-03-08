import React, { useEffect, useState, useRef } from "react";
import { Box } from "@material-ui/core";
import { MicOff } from "@material-ui/icons";
import ReactPlayer from "react-player";

/**
 * Component that shows your video feed using the browser's MediaDevices API directly
 * This provides a fallback view when the VideoSDK isn't providing your video feed
 */
function SelfView() {
    const [mediaStream, setMediaStream] = useState(null);
    const [micEnabled, setMicEnabled] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const videoRef = useRef(null);
    const requestRef = useRef(null);

    useEffect(() => {
        // Get user's camera and microphone
        async function setupMediaDevices() {
            try {
                // Request access to camera and microphone
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 1280,
                        height: 720
                    },
                    audio: true
                });

                setMediaStream(stream);
                setCameraEnabled(true);

                // Check if microphone is enabled
                const audioTracks = stream.getAudioTracks();
                setMicEnabled(audioTracks.length > 0 && audioTracks[0].enabled);

                console.log("SelfView: Direct camera access successful");
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        }

        // Only request camera access once
        if (!requestRef.current) {
            requestRef.current = true;
            setupMediaDevices();
        }

        // Cleanup function to stop all tracks when component unmounts
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        };
    }, []);

    return (
        <div className="h-full w-full bg-gray-750 relative overflow-hidden rounded-lg video-cover">
            <div
                className="absolute bottom-2 left-2 rounded-md flex items-center justify-center p-2"
                style={{
                    backgroundColor: "#00000066",
                    transition: "all 200ms",
                    transitionTimingFunction: "linear",
                    zIndex: 10
                }}
            >
                {!micEnabled && <MicOff fontSize="small" style={{ color: "white" }} />}
                <p className="text-sm text-white">You (Direct View)</p>
            </div>

            {mediaStream ? (
                <ReactPlayer
                    playsinline
                    playIcon={<></>}
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    url={mediaStream}
                    height={"100%"}
                    width={"100%"}
                    style={{
                        transform: "scaleX(-1)" // Mirror the video horizontally
                    }}
                    onError={(err) => {
                        console.log(err, "SelfView video error");
                    }}
                />
            ) : (
                <div className="h-full w-full flex items-center justify-center">
                    <div className="z-10 flex items-center justify-center rounded-full bg-gray-800 2xl:h-[92px] h-[52px] 2xl:w-[92px] w-[52px]">
                        <p className="text-2xl text-white">Y</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SelfView;
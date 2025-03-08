import React, { useEffect, useMemo, useRef } from "react";
import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { MicOff } from "@material-ui/icons";
import { nameTructed } from "../../utils/helper";

/**
 * Component that shows the local participant's video stream
 * Used when there are no other participants in the meeting
 */
function LocalVideoView() {
    const mMeeting = useMeeting();
    const localParticipant = mMeeting?.localParticipant;
    const videoRef = useRef(null);

    const { webcamStream, webcamOn, micOn, displayName } = localParticipant || {
        webcamOn: false,
        micOn: false,
        displayName: "You"
    };

    const micRef = useRef(null);

    const webcamMediaStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
        return null;
    }, [webcamStream, webcamOn]);

    // Handle video element lifecycle and stream management
    useEffect(() => {
        let videoElement = null;

        if (webcamMediaStream && videoRef.current) {
            videoElement = videoRef.current.getInternalPlayer();
            if (videoElement) {
                videoElement.srcObject = webcamMediaStream;
                videoElement.play().catch(error => {
                    console.warn("Error auto-playing video:", error);
                });
            }
        }

        return () => {
            if (videoElement && videoElement.srcObject) {
                const tracks = videoElement.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoElement.srcObject = null;
            }
        };
    }, [webcamMediaStream]);

    // Monitor and log stream state for debugging
    useEffect(() => {
        console.log("Local stream state:", {
            hasStream: !!webcamMediaStream,
            webcamOn,
            streamActive: webcamMediaStream?.active,
            streamId: webcamMediaStream?.id
        });

        if (!webcamMediaStream && webcamOn) {
            console.warn("Webcam enabled but no stream available");
        }
    }, [webcamMediaStream, webcamOn]);

    return (
        <div className="h-full w-full bg-gray-750 relative overflow-hidden rounded-lg video-cover">
            <div
                className="absolute bottom-2 left-2 rounded-md flex items-center justify-center p-2"
                style={{
                    backgroundColor: "#00000066",
                    transition: "all 200ms",
                    transitionTimingFunction: "linear",
                }}
            >
                {!micOn && <MicOff fontSize="small" style={{ color: "white" }} />}
                <p className="text-sm text-white">You</p>
            </div>

            {webcamOn && webcamMediaStream ? (
                <ReactPlayer
                    ref={videoRef}
                    playsinline
                    playIcon={<></>}
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    url={webcamMediaStream}
                    height={"100%"}
                    width={"100%"}
                    onError={(err) => {
                        console.error("Local video error:", err);
                        // Attempt recovery by reinitializing stream
                        if (mMeeting?.toggleWebcam) {
                            mMeeting.toggleWebcam();
                            setTimeout(() => mMeeting.toggleWebcam(), 1000);
                        }
                    }}
                />
            ) : (
                <div className="h-full w-full flex items-center justify-center">
                    <div className="z-10 flex items-center justify-center rounded-full bg-gray-800 2xl:h-[92px] h-[52px] 2xl:w-[92px] w-[52px]">
                        <p className="text-2xl text-white">
                            {String(displayName || "You").charAt(0).toUpperCase()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LocalVideoView;

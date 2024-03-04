import { Avatar } from "@/components/ui/avatar";
import { MicIcon, MicOffIcon, Video, VideoOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface VideoComponentProps {

}

interface Mic {
  deviceId: string;
  label: string;
}

const VideoComponent: React.FC<VideoComponentProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true); // Track camera state

  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true); // Track microphone state

  const [mics, setMics] = useState<Mic[]>([]);
  const [selectedMic, setSelectedMic] = useState("");



  useEffect(() => {
    try {
      if (isCameraOn) {
        startVideo();
      } else {
        stopVideo();
      }

    } catch (error) {
      console.error('Error accessing media:', error);
    }
  }, [isCameraOn, isMicrophoneOn]);

  // ... (rest of your code for video handling)

  const handleToggleMicrophone = useCallback(() => {

  }, [isMicrophoneOn]);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    // Disable webcam within the meeting using SDK

  };

  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  return (
    <div className="md:col-span-7 2xl:col-span-6 col-span-12">
      <div className="flex items-center justify-center p-1.5 sm:p-4 lg:p-6">
        <div className="relative w-full md:pl-4 sm:pl-10 pl-5  md:pr-4 sm:pr-10 pr-5">

          <div className="w-full relative" style={{ height: "45vh" }}>
            <video ref={videoRef} playsInline muted className={
              "rounded-[10px] h-full w-full object-cover flex items-center justify-center flip"
            } />
            {/* <button onClick={startVideo}>Start Video</button>
            <button onClick={stopVideo}>Stop Video</button> */}
            <div className="absolute xl:bottom-6 bottom-4 left-0 right-0">
              <div className="container grid grid-flow-col space-x-4 items-center justify-center md:-m-2">
                <Avatar onClick={handleToggleMicrophone} className="bg-purple-100 flex justify-center items-center cursor-pointer hover:scale-90">
                  {isMicrophoneOn ?
                    <MicIcon className="text-purple-500 h-6 w-6" /> :
                    <MicOffIcon className="text-purple-500 h-6 w-6" />}
                </Avatar>
                <Avatar onClick={handleToggleCamera} className="bg-purple-100 flex justify-center items-center cursor-pointer hover:scale-90">
                  {isCameraOn ? <Video className="text-purple-500 h-6 w-6" /> :
                    <VideoOff className="text-purple-500 h-6 w-6" />}
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoComponent
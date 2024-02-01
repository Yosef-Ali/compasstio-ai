import { Avatar } from "@/components/ui/avatar";
import { useMeeting } from "@videosdk.live/react-sdk";
import { MicIcon, MicOffIcon, PhoneOffIcon, Video, VideoOff } from "lucide-react";

function Controls() {
  const { leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn,
  } = useMeeting();

  return (
    <div className=" flex justify-center items-center space-x-2 py-4">
      <Avatar onClick={() => toggleMic()} className="bg-purple-100 flex justify-center items-center cursor-pointer hover:scale-90">
        {localMicOn ?
          <MicIcon className="text-purple-500 h-6 w-6" /> :
          <MicOffIcon className="text-purple-500 h-6 w-6" />}
      </Avatar>
      <Avatar onClick={() => toggleWebcam()} className="bg-purple-100 flex justify-center items-center cursor-pointer hover:scale-90">
        {localWebcamOn ? <Video className="text-purple-500 h-6 w-6" /> :
          <VideoOff className="text-purple-500 h-6 w-6" />}
      </Avatar>
      &emsp;|&emsp;
      <Avatar onClick={() => leave()} className="bg-purple-500 flex justify-center items-center cursor-pointer hover:scale-90">
        <PhoneOffIcon className=" h-5 w-5" />
      </Avatar>
    </div>

  );
}

export default Controls
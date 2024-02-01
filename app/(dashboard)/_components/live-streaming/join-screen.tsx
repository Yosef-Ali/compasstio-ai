import { useSlideState } from "@/app/hooks/useSlideState";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VideoComponent from "./video-component";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRightIcon } from "lucide-react";


type JoinScreenProps = {
  getMeetingAndToken: (meetingId: string) => Promise<void>;
  setMode: React.Dispatch<React.SetStateAction<"CONFERENCE" | "VIEWER" | undefined>>;
}

function JoinScreen({ getMeetingAndToken, setMode }: JoinScreenProps) {
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const [localMode, setLocalMode] = useState<"CONFERENCE" | "VIEWER" | undefined>("CONFERENCE");
  const { isSlideOut, toggleSlide } = useSlideState();
  


  // Function to handle click events for creating or joining a meeting
  const onClick = async (selectedMode: "CONFERENCE" | "VIEWER") => {
    setLocalMode(selectedMode);
    // Call getMeetingAndToken only if meetingId is defined
    if (meetingId) {
      await getMeetingAndToken(meetingId);
    } else {
      // If no meetingId is provided, create a new meeting
      //@ts-ignore
      await getMeetingAndToken();
    }
  };

  // Render the JoinScreen component 
  return (
    <div key="1" className="min-h-screen flex flex-col md:flex-row bg-gray-800">
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center md:m-[72px] m-16">
        <div className="container grid  md:grid-flow-col grid-flow-row ">
          <div className="grid grid-cols-12">
            <VideoComponent />
            <div className="md:col-span-5 2xl:col-span-6 col-span-12 md:relative">
              <div className="flex flex-1 flex-col items-center justify-center xl:m-16 lg:m-6 md:mt-9 lg:mt-14 xl:mt-20 mt-3 md:absolute md:left-0 md:right-0 md:top-0 md:bottom-0">
                <div className={`w-full text-white flex flex-col gap-4 flex-1 items-center justify-center xl:m-10  md:mt-11  ${isSlideOut ? "md:mx-48" : ""} `}>
                  <Button onClick={() => onClick("CONFERENCE")} className="w-full bg-purple-500  whitespace-nowrap">
                    Create a Meeting
                  </Button>
                  <Button className=" rounded-md px-4 py-2 flex items-center justify-center w-full whitespace-nowrap cursor-default text-gray-400">
                    Join the Meeting from the List
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default JoinScreen
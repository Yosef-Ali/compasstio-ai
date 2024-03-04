"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";

const MeetingIdCopyBTN = ({ meetingId }: { meetingId: string }) => {
  //const mMeeting = useMeeting();

  const [isCopied, setIsCopied] = useState(false);
  return (
    <div className="flex items-center justify-center lg:ml-0 ml-4 mt-4 xl:mt-0">
      <div className="flex border-2 border-gray-300 py-1 px-2 rounded-md items-center justify-center">
        <h1 className=" text-base text-gray-600 whitespace-nowrap ">{meetingId}</h1>
        <button
          className="ml-2"
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(meetingId);
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 3000);
          }}
        >
          {isCopied ? (
            <CheckIcon className="h-5 w-5 text-purple-500" />
          ) : (
            <ClipboardIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* <div className="flex border-2 border-gray-850 p-2 ml-4 rounded-md items-center justify-center">
          <h1 className="text-white">00:30</h1>
        </div> */}
    </div>
  );
};

export default MeetingIdCopyBTN;
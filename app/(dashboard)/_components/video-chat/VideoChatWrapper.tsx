import React from 'react';
import dynamic from 'next/dynamic';

interface VideoChatWrapperProps {
  controlsVisible: boolean;
}

const MeetingAppContainer = dynamic(
  () => import("./containers/MeetingAppContainer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full min-h-[500px] bg-gray-800 text-white">
        Loading video chat...
      </div>
    ),
  }
);

const VideoChatWrapper: React.FC<VideoChatWrapperProps> = ({ controlsVisible }) => {
  return (
    <div className="relative w-full h-full min-h-[500px]">
      <MeetingAppContainer controlsVisible={controlsVisible} />
    </div>
  );
};

export default VideoChatWrapper; 
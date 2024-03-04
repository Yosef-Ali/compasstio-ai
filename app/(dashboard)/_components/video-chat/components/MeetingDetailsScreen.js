"use client";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import useResponsiveSize from "@/utils/useResponsiveSize";

export function MeetingDetailsScreen({
  onClickJoin,
  onClickCreateMeeting,
  participantName,
  setParticipantName,
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
}) {
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);
  const padding = useResponsiveSize({
    xl: 6,
    lg: 6,
    md: 6,
    sm: 4,
    xs: 1.5,
  });

  // meetingId is avalable only when createMeeting is clicked

  // crete uesEffect here
  // useEffect(() => {
  //   if (meetingId) {
  //     setIscreateMeetingClicked(true);
  //     setIsJoinMeetingClicked(false);
  //   }
  //     // Add your useEffect logic here
  // }, [meetingId]);

  return (
    <div
      className={`flex flex-1 flex-col w-full `}
      style={{
        padding: padding,
      }}
    >
      {iscreateMeetingClicked ? (
        <div className="border border-solid border-gray-400 rounded-xl px-4 py-3  flex items-center justify-center">
          <p className="text-white text-base">Meeting code: {meetingId}</p>
          <button
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(meetingId);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      ) : isJoinMeetingClicked ? (
        <>
          <input
            defaultValue={meetingId}
            onChange={(e) => {
              setMeetingId(e.target.value);
            }}
            placeholder="Enter meeting Id"
            className="px-4 py-3 bg-gray-650 rounded-xl text-white w-full text-center"
          />
          {meetingIdError && (
            <p className="text-xs text-red-600">Please enter valid meetingId</p>
          )}
        </>
      ) : null}

      {(iscreateMeetingClicked || isJoinMeetingClicked) && (
        <>
          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 bg-gray-650 rounded-xl text-white w-full text-center"
          />

          {/* <p className="text-xs text-white mt-1 text-center">
            Your name will help everyone identify you in the meeting.
          </p> */}
          <button
            disabled={participantName.length < 3}
            className={`w-full ${participantName.length < 3 ? "bg-gray-650" : "bg-purple-500"
              }  text-white px-2 py-3 rounded-xl mt-5`}
            onClick={(e) => {
              if (iscreateMeetingClicked) {
                if (videoTrack) {
                  videoTrack.stop();
                  setVideoTrack(null);
                }
                onClickStartMeeting();
              } else {
                if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                  onClickJoin(meetingId);
                } else setMeetingIdError(true);
              }
            }}
          >
            {iscreateMeetingClicked ? "Start a meeting" : "Join a meeting"}
          </button>
        </>
      )}

      {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex items-center justify-center flex-col">
          <button
            className="w-full bg-purple-500 hover:bg-purple-800 text-white px-2 py-3 rounded-xl"
            onClick={async (e) => {
              const meetingId = await onClickCreateMeeting();
              setMeetingId(meetingId);
              setIscreateMeetingClicked(true);
            }}
          >
            Create a meeting
          </button>
          <button
            className="w-full bg-gray-650 text-white px-2 py-3 rounded-xl mt-5"
            onClick={(e) => {
              setIsJoinMeetingClicked(true);
            }}
          >
            Join a meeting
          </button>
        </div>
      )}
    </div>
  );
}

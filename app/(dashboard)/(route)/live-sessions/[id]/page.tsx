"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "@/lib/api";
import ReactPlayer from "react-player";
import { redirect, useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Controls from "@/app/(dashboard)/_components/live-streaming/controls";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";

type ParticipantsViewer = {
  participantId: string;
  videoHeight: string;
}


function JoinScreen({
  getMeetingAndToken,
}: {
  getMeetingAndToken: (meeting?: string) => void,
}) {
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const onClick = async () => {
    getMeetingAndToken(meetingId);
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={onClick}>Join</button>
      {" or "}
      <button onClick={onClick}>Create Meeting</button>
    </div>
  );
}

function ParticipantView({ participantId, videoHeight }: ParticipantsViewer) {

  const micRef = useRef<HTMLAudioElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (

    <div
      key={participantId}
      // onMouseEnter={() => {
      //   setMouseOver(true);
      // }}
      // onMouseLeave={() => {
      //   setMouseOver(false);
      // }}
      className={`h-full w-full  bg-gray-750 relative overflow-hidden rounded-lg video-cover`}
    >

      {/* <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p> */}
      <audio ref={micRef} autoPlay muted={isLocal} />
      {webcamOn ? (
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={videoHeight}
          width={"100%"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div
            className={`z-10 flex items-center justify-center rounded-full bg-gray-700 2xl:h-[92px] h-[52px] 2xl:w-[92px] w-[52px]`}
          >
            <p className="text-2xl text-white">
              {String(displayName).charAt(0).toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </div>

  );
}


function MeetingView({
  onMeetingLeave,
  meetingId,
}: {
  onMeetingLeave: () => void,
  meetingId: string | null,
}) {
  const [joined, setJoined] = useState<string | null>(null);
  const [columns, setColumns] = useState(1); // Initial layout
  const [videoHeight, setVideoHeight] = useState('100%');

  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };
  const isPresenting = participants.size > 1

  useEffect(() => {
    const updateLayout = () => {
      const participantCount = participants.size;
      setColumns(participantCount >= 2 && participantCount <= 4 ? 2 : 3); // Adjust columns based on participant count

      // Calculate video height percentages
      let videoHeight;
      if (participantCount > 4) {
        videoHeight = '28vh';
      } else if (participantCount > 2) {
        videoHeight = '38vh';
      } else {
        videoHeight = '80vh';
      }
      setVideoHeight(videoHeight);
    };

    updateLayout();

  }, [participants]);

  console.log("participants", participants.size);
  console.log("columns", columns);
  return (

    <div className="w-full h-full object-contain p-12 bg-gray-800">
      {/* <h3>Meeting Id: {meetingId}</h3> */}
      {joined && joined == "JOINED" ? (

        <>
          <div className={`grid grid-cols-${columns} gap-4 justify-center items-center`}>
            {
              //@ts-ignore
              [...participants.keys()].map((participantId) => (
                <ParticipantView
                  participantId={participantId}
                  key={participantId}
                  videoHeight={videoHeight}
                />
              ))}
          </div>
          <div className="-mt-1">
            <Controls />
          </div>
        </>


      ) : joined && joined == "JOINING" ? (
        <div className="flex justify-center items-center h-full text-gray-400">
          <Spinner size="lg" />
          <p className="ml-4">Joining the meeting...</p>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Button onClick={joinMeeting} className=" py-3 px-6 bg-purple-500">Join the meeting</Button>
        </div>
      )
      }
    </div >
  );

}

function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [meetingId, setMeetingId] = useState<string | null>(id);
  const { user } = useUser();
  const userIfo = useQuery(api.users.getUser, { id: user?.id as string });

  //Getting the meeting id by calling the api we just wrote
  const getMeetingAndToken = async (id?: string | null) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken as string }) : id;
    setMeetingId(meetingId);
  };

  //This will set Meeting Id to null when meeting is left or ended
  const onMeetingLeave = () => {
    setMeetingId(null);
    router.push('/live-sessions');
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: userIfo?.name as string,
      }}
      token={authToken}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    // <JoinScreen getMeetingAndToken={getMeetingAndToken} />
    <p>Loading...</p>
  );
}

export default Page;
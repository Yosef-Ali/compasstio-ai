"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "@/lib/api";
import ReactPlayer from "react-player";
import { redirect, useParams, useRouter } from "next/navigation";
import Controls from "@/app/(dashboard)/_components/live-streaming/controls";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";


type ParticipantsViewer = {
  participantId: string;
  videoHeight: string;
  meetingId: string
}

export const dynamic = 'force-dynamic'
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


function ParticipantView({ participantId, videoHeight, meetingId }: ParticipantsViewer) {
  const { user } = useUser();
  const router = useRouter();
  const userId = user?.id as string;
  const micRef = useRef<HTMLAudioElement>(null);


  // Destructuring participantId for clarity


  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName, } = useParticipant(participantId, { onStreamDisabled: onStreamDisabled });

  const saveParticipants = useMutation(api.meetings.saveParticipant);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      return new MediaStream([webcamStream.track]); // Simplified MediaStream creation
    }
  }, [webcamStream, webcamOn]);

  function onStreamDisabled() {
    console.log(" onStreamEnabled for ", participantId);
    router.push('/live-sessions');
  }

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        micRef.current.srcObject = new MediaStream([micStream.track]);
        micRef.current.play().catch((error) => console.error("micRef.play() failed", error));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);


  useEffect(() => {
    if (participantId && isLocal) {
      saveParticipants({
        meetingId,
        participant: { userId, participantId }, // Align with mutation field name
      });
    }
  }, [participantId]); // Include extracted properties

  const handleMeetingLeft = () => {
    // Do some action here
    console.log("Meeting left");
  };


  return (

    <div
      key={participantId}
      className={`h-full w-full  bg-gray-750 relative overflow-hidden rounded-lg video-cover -my-10`}
    >
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
      //router.push('/live-sessions');
      // console.log("left");
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };
  
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


  return (

    <div className="container w-full h-full object-contain bg-gray-800 ">
      {/* <h3>Meeting Id: {meetingId}</h3> */}
      {joined && joined == "JOINED" ? (

        <div className="w-full h-full py-12 ">
          <div className={`grid grid-cols-${columns} gap-4 justify-center items-center `}>
            {
              //@ts-ignore
              [...participants.keys()].map((participantId) => (
                <ParticipantView
                  participantId={participantId}
                  key={participantId}
                  videoHeight={videoHeight}
                  meetingId={meetingId || ""}
                />
              ))}
          </div>

          <Controls />

        </div>


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
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
    // <p>Loading...</p>
  );
}

export default Page;
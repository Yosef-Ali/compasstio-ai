"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  Constants,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "@/lib/api";
import ReactPlayer from "react-player";
import Hls from "hls.js";
import { Participant } from "@videosdk.live/react-sdk/dist/types/participant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import dynamic from "next/dynamic";

// Define the prop types using an interface
interface JoinScreenProps {
  getMeetingAndToken: (meetingId: string) => Promise<void>;
  setMode: React.Dispatch<React.SetStateAction<"CONFERENCE" | "VIEWER" | undefined>>;
}
interface ContainerProps {
  meetingId: string;
  onMeetingLeave: () => void;
}

interface ParticipantViewProps {
  participantId: string;
}

interface MeetingState {
  participants: Map<string, Participant>;
  hlsState: string;
  hlsUrls: {
    downstreamUrl: string;
  };
}

// JoinScreen component
function JoinScreen({ getMeetingAndToken, setMode }: JoinScreenProps) {
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const [localMode, setLocalMode] = useState<"CONFERENCE" | "VIEWER" | undefined>("CONFERENCE");

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
    console.log("localMode:", localMode, "selectedMode:", selectedMode, "meetingId:", meetingId);
  };

  // Render the JoinScreen component 
  return (
    <div className="container border border-green-300 p-4">
      <Button onClick={() => onClick("CONFERENCE")}>Create Meeting</Button>
      <br />
      <br />
      {" or "}
      <br />
      <br />
      <Input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => setMeetingId(e.target.value)}
      />
      <br />
      <br />
      <Button onClick={() => onClick("CONFERENCE")}>Join as Host</Button>
      {" | "}
      <Button onClick={() => onClick("VIEWER")}>Join as Viewer</Button>
    </div>
  );
}



// Use the interface to type the props parameter
function ParticipantView({ participantId }: ParticipantViewProps) {
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

  // Playing the audio in the <audio>
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current.play().catch((error) =>
          console.error("micRef.current.play() failed", error)
        );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="border p-4">
      <p className="border p-4">
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          height={"300px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam, startHls, stopHls } = useMeeting();

  return (
    <div className="border border-purple-500 p-4 flex space-x-2 ">
      <Button onClick={() => leave()}>Leave</Button>
      &emsp;|&emsp;
      <Button onClick={() => toggleMic()}>toggleMic</Button>
      <Button onClick={() => toggleWebcam()}>toggleWebcam</Button>
      &emsp;|&emsp;
      <Button
        onClick={() => {
          //We will start the HLS in SPOTLIGHT mode and PIN as
          //priority so only speakers are visible in the HLS stream
          startHls({
            layout: {
              type: "SPOTLIGHT",
              priority: "PIN",
              gridSize: 20,
            },
            theme: "LIGHT",
            mode: "video-and-audio",
            quality: "high",
            orientation: "landscape",
          });
        }}
      >
        Start HLS
      </Button>
      <Button onClick={() => stopHls()}>Stop HLS</Button>
    </div>
  );
}

function SpeakerView() {
  //Get the participants and hlsState from useMeeting
  const { participants, hlsState } = useMeeting();

  //Filtering the host/speakers from all the participants
  const speakers = useMemo(() => {
    const speakerParticipants = Array.from(participants.values()).filter(
      (participant) => {
        return participant.mode == Constants.modes.CONFERENCE;
      }
    );
    return speakerParticipants;
  }, [participants]);
  return (
    <div className="border border-blue-500 p-4 ">
      <p>Current HLS State: {hlsState}</p>
      {/* Controls for the meeting */}
      <Controls />

      {/* Rendring all the HOST participants */}
      {speakers.map((participant) => (
        <ParticipantView participantId={participant.id} key={participant.id} />
      ))}
    </div>
  );
}

// Use the interface to type the object destructuring from useMeeting
function ViewerView() {
  const playerRef = useRef<HTMLVideoElement>(null);
  const { hlsUrls, hlsState }: MeetingState = useMeeting();

  useEffect(() => {
    if (hlsUrls.downstreamUrl && hlsState === 'HLS_PLAYABLE') {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxLoadingDelay: 1, // max video loading delay used in automatic start level selection
          defaultAudioCodec: "mp4a.40.2", // default audio codec
          maxBufferLength: 0, // If buffer length is/become less than this value, a new fragment will be loaded
          maxMaxBufferLength: 1, // Hls.js will never exceed this value
          startLevel: 0, // Start playback at the lowest quality level
          startPosition: -1, // set -1 playback will start from intialtime = 0
          maxBufferHole: 0.001, // 'Maximum' inter-fragment buffer hole tolerance that hls.js can cope with when searching for the next fragment to load.
          highBufferWatchdogPeriod: 0, // if media element is expected to play and if currentTime has not moved for more than highBufferWatchdogPeriod and if there are more than maxBufferHole seconds buffered upfront, hls.js will jump buffer gaps, or try to nudge playhead to recover playback.
          nudgeOffset: 0.05, // In case playback continues to stall after first playhead nudging, currentTime will be nudged evenmore following nudgeOffset to try to restore playback. media.currentTime += (nb nudge retry -1)*nudgeOffset
          nudgeMaxRetry: 1, // Max nb of nudge retries before hls.js raise a fatal BUFFER_STALLED_ERROR
          maxFragLookUpTolerance: .1, // This tolerance factor is used during fragment lookup. 
          liveSyncDurationCount: 1, // if set to 3, playback will start from fragment N-3, N being the last fragment of the live playlist
          abrEwmaFastLive: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
          abrEwmaSlowLive: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
          abrEwmaFastVoD: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
          abrEwmaSlowVoD: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
          maxStarvationDelay: 1, // ABR algorithm will always try to choose a quality level that should avoid rebuffering
        });

        const player = playerRef.current;
        if (player) {
          hls.loadSource(hlsUrls.downstreamUrl);
          hls.attachMedia(player);
        }
      } else {
        const player = playerRef.current;
        if (player && typeof player.play === 'function') {
          player.src = hlsUrls.downstreamUrl;
          player.play().catch((error) =>
            console.error('player.play() failed', error)
          );
        }
      }
    }
  }, [hlsUrls, hlsState]);

  return (
    <div className="border border-y-fuchsia-950 p-4 bg-slate-400 ">
      {hlsState !== 'HLS_PLAYABLE' ? (
        <p>HLS has not started yet or is stopped</p>
      ) : (
        <video
          ref={playerRef}
          id="hlsPlayer"
          autoPlay
          controls
          style={{ width: '100%', height: '100%' }}
          playsInline
          muted
          onError={(err) => {
            console.error('hls video error', err);
          }}
        ></video>
      )}
    </div>
  );
}

function Container(props: ContainerProps) {
  const [joined, setJoined] = useState<null | string>(null);

  //Get the method which will be used to join the meeting.
  const { join } = useMeeting();
  const mMeeting = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      if (mMeetingRef.current.localParticipant.mode == "CONFERENCE") {
        // Choose the appropriate type based on your requirements
        const type: "SHARE_AND_CAM" | "CAM" | "SHARE" = "CAM"; // Example: Pinning only the camera
        mMeetingRef.current.localParticipant.pin(type);
      }
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
    //callback for when there is error in meeting
    onError: (error) => {
      alert(error.message);
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  const mMeetingRef = useRef(mMeeting);
  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  return (
    <div className="container border border-red-400 p-4">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        mMeeting.localParticipant.mode == Constants.modes.CONFERENCE ? (
          <SpeakerView />
        ) : mMeeting.localParticipant.mode == Constants.modes.VIEWER ? (
          <ViewerView />
        ) : null
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <Button onClick={joinMeeting}>Join</Button>
      )}
    </div>
  );
}
// LiveStreamPage component
const LiveStreamPage = () => {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"CONFERENCE" | "VIEWER" | undefined>("CONFERENCE");

  // Function to get the meeting ID and token
  const getMeetingAndToken = async (id?: string) => {
    try {
      // If no ID is provided, create a new meeting
      const newMeetingId = id == null ? await createMeeting({ token: authToken as string }) : id;
      setMeetingId(newMeetingId);
      console.log("meetingId:", newMeetingId);
    } catch (error) {
      console.error("Error creating or joining meeting:", error);
    }
  };

  // Function to handle leaving the meeting
  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  // Render the appropriate component based on the authToken and meetingId
  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",
        mode: mode,
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <Container meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} setMode={setMode} />
  );
};

export default LiveStreamPage;



import React, { useEffect, useMemo, useRef } from "react";
import { useParticipant, useMeeting } from "@videosdk.live/react-sdk";
import { MicOff } from "@material-ui/icons";
import ReactPlayer from "react-player";

export function ParticipantView({ participantId }) {
  const { displayName, webcamStream, micStream, webcamOn, micOn, isLocal } =
    useParticipant(participantId);
  const micRef = useRef(null);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current.play().catch((error) =>
          console.error("videoElem.current.play() failed", error)
        );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  const webcamMediaStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  return (
    <div className="relative w-full h-full">
      <audio ref={micRef} autoPlay muted={isLocal} />
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        {webcamOn && webcamMediaStream ? (
          <ReactPlayer
            playsinline
            playIcon={<></>}
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={webcamMediaStream}
            width="100%"
            height="100%"
            style={{
              objectFit: 'cover'
            }}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-800">
            <div className="h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center">
              <p className="text-3xl text-white">{displayName?.charAt(0)?.toUpperCase()}</p>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-lg flex items-center gap-2">
        {!micOn && <MicOff className="text-white" />}
        <span className="text-white text-sm">{isLocal ? "You" : displayName}</span>
      </div>
    </div>
  );
}

export function ParticipantsViewer({ isPresenting, sideBarMode }) {
  const mMeeting = useMeeting();
  const participants = [...mMeeting?.participants.keys()];

  return (
    <div className="h-full w-full p-4">
      <div className={`grid h-full gap-4 ${participants.length === 1 ? 'grid-cols-1' :
          participants.length === 2 ? 'grid-cols-2' :
            participants.length === 3 ? 'grid-cols-2' :
              participants.length === 4 ? 'grid-cols-2' :
                'grid-cols-3'
        } ${participants.length === 1 ? 'grid-rows-1' :
          participants.length === 2 ? 'grid-rows-1' :
            participants.length === 3 ? 'grid-rows-2' :
              participants.length === 4 ? 'grid-rows-2' :
                'grid-rows-2'
        }`}>
        {participants.map((participantId) => (
          <div key={participantId} className={`relative ${participants.length === 1 ? 'col-span-1 row-span-1' :
              participants.length === 2 ? 'col-span-1' :
                participants.length === 3 && participants.indexOf(participantId) === 0 ? 'col-span-2' :
                  ''
            }`}>
            <ParticipantView participantId={participantId} />
          </div>
        ))}
      </div>
    </div>
  );
}

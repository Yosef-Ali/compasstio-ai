import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";

type ParticipantViewProps = {
  participantId: string;
  videoHeight: string
};

function ParticipantView({ participantId, videoHeight }: ParticipantViewProps) {
  const micRef = useRef<HTMLAudioElement>(null);
  const {
    displayName,
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    mode,
    isActiveSpeaker,
  } = useParticipant(participantId);

  const [mouseOver, setMouseOver] = useState(false);


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



  const webcamMediaStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);


  return mode === "CONFERENCE" ? (
    <div
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
      className={`h-full w-full  bg-gray-750 relative overflow-hidden rounded-lg video-cover -my-10`}

    >
      <audio ref={micRef} autoPlay muted={isLocal} />
      {
        webcamOn ? (
          <ReactPlayer
            //
            playsinline // very very imp prop
            playIcon={<></>}
            //
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            //
            url={webcamMediaStream}
            //
            height={videoHeight}
            width={"100%"}
            onError={(err) => {
              console.log(err, "participant video error");

            }}

          />
        ) : (
          <div className="h-[80vh] w-full flex items-center justify-center">
            <div
              className={`z-10 flex items-center justify-center rounded-full bg-gray-700 2xl:h-[92px] h-[52px] 2xl:w-[92px] w-[52px]`}
            >
              <p className="text-2xl text-white">
                {String(displayName).charAt(0).toUpperCase()}
              </p>
            </div>
          </div>
        )
      }
      {/* <CornerDisplayName
        {...{
          isLocal,
          displayName,
          micOn,
          webcamOn,
          isPresenting: false,
          participantId,
          mouseOver,
          isActiveSpeaker,
        }}
      /> */}
    </div >
  ) : null;
}

export default ParticipantView
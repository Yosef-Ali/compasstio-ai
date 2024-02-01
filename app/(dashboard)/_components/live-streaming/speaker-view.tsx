import { Constants, useMeeting } from "@videosdk.live/react-sdk";
import { useMemo } from "react";
import Controls from "./controls";
import ParticipantViewer from "./participant-view";

function SpeakerView() {
  //Get the participants and hlsState from useMeeting
  const { participants, hlsState } = useMeeting();

  //Filtering the host/speakers from all the participants
  const speakers = useMemo(() => {
    const speakerParticipants = Array.from(participants.values()).filter(
      (participant) => {
        return participant.mode == Constants.modes.CONFERENCE || participant.mode == Constants.modes.VIEWER;
      }
    );
    return speakerParticipants;
  }, [participants]);

  return (
    <div className={` flex flex-1 flex-row bg-gray-800 `}>
      <div className="flex w-full flex-col">
        {speakers.map((participant) => (
          <ParticipantViewer participantId={participant.id} key={participant.id} />
        ))}
        {/* <p>Current HLS State: {hlsState}</p> */}
        {/* Controls for the meeting */}
        <Controls />

        {/* Rendring all the HOST participants */}

      </div>
    </div>
  );
}

export default SpeakerView
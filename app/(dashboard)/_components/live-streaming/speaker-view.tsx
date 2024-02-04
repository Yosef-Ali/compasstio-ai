import { Constants, useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useState } from "react";
import Controls from "./controls";
import ParticipantViewer from "./participant-view";

interface ParticipantViewProps {
  participantId: string;
  videoHeight: string;
}

function SpeakerView() {
  const [columns, setColumns] = useState(1); // Initial layout
  const [videoHeight, setVideoHeight] = useState<string>('100%');
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


  useEffect(() => {
    const updateLayout = () => {
      const participantCount = participants.size;
      // Set columns to 1 if there is only one participant, otherwise use the previous logic
      setColumns(participantCount === 1 ? 1 : (participantCount >= 2 && participantCount <= 4 ? 2 : 3));
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
    <div className="w-full h-full py-12">
      <div className={`grid grid-cols-${columns} gap-4 justify-center items-center`}>
        {speakers.map((participant) => (
          <ParticipantViewer participantId={participant.id} videoHeight={videoHeight} key={participant.id} />
        ))}
      </div>
      <Controls />
    </div>

  );
}

export default SpeakerView
import { useContext, createContext, useState, useEffect, useRef, FC, ReactNode } from "react";

interface Participant {
  participantId: string;
  raisedHandOn: number;
}

interface MeetingAppContextData {
  raisedHandsParticipants: Participant[];
  setRaisedHandsParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  sideBarMode: string | null;
  setSideBarMode: React.Dispatch<React.SetStateAction<string | null>>;
  pipMode: boolean;
  setPipMode: React.Dispatch<React.SetStateAction<boolean>>;
  useRaisedHandParticipants: () => { participantRaisedHand: (participantId: string) => void };
}

export const MeetingAppContext = createContext<MeetingAppContextData | null>(null);

export const useMeetingAppContext = () => {
  const context = useContext(MeetingAppContext);
  if (!context) {
    throw new Error('useMeetingAppContext must be used within a MeetingAppContextProvider');
  }
  return context;
};

const useRaisedHandParticipants = () => {
  const raisedHandsParticipantsRef = useRef<Participant[]>([]);

  const participantRaisedHand = (participantId: string) => {
    const raisedHandsParticipantsCopy = [...raisedHandsParticipantsRef.current];

    const newItem = { participantId, raisedHandOn: new Date().getTime() };

    const participantFound = raisedHandsParticipantsCopy.findIndex(
      (item) => item.participantId === participantId
    );

    if (participantFound === -1) {
      raisedHandsParticipantsCopy.push(newItem);
    } else {
      raisedHandsParticipantsCopy[participantFound] = newItem;
    }

    raisedHandsParticipantsRef.current = raisedHandsParticipantsCopy;
  };

  useEffect(() => {
    const _handleRemoveOld = () => {
      const now = new Date().getTime();
      const persisted = raisedHandsParticipantsRef.current.filter(({ raisedHandOn }) => {
        return raisedHandOn + 15000 > now;
      });

      if (raisedHandsParticipantsRef.current.length !== persisted.length) {
        raisedHandsParticipantsRef.current = persisted;
      }
    };

    const interval = setInterval(_handleRemoveOld, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { participantRaisedHand };
};

export const MeetingAppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<Participant[]>([]);
  const [sideBarMode, setSideBarMode] = useState<string | null>(null);
  const [pipMode, setPipMode] = useState<boolean>(false);

  const { participantRaisedHand } = useRaisedHandParticipants();

  return (
    <MeetingAppContext.Provider value={{
      raisedHandsParticipants,
      setRaisedHandsParticipants,
      sideBarMode,
      setSideBarMode,
      pipMode,
      setPipMode,
      useRaisedHandParticipants
    }}>
      {children}
    </MeetingAppContext.Provider>
  );
};

import { useMeeting } from "@videosdk.live/react-sdk";

/**
 * Custom hook to check if recording is active in a meeting
 * @returns boolean indicating if recording is active
 */
const useIsRecording = (): boolean => {
  const { recordingState } = useMeeting();
  const isRecording = recordingState === "RECORDING";
  return isRecording;
};

export default useIsRecording;
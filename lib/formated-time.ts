import { useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function useFormattedTime(timestamp: number): string {
  return useMemo(() => {
    const now = dayjs();
    const messageTime = dayjs(timestamp);

    const diff = now.diff(messageTime, "hour");

    let formattedTime: string;

    if (diff < 24) {
      formattedTime = messageTime.fromNow();
    } else if (diff < 168) {
      formattedTime = messageTime.format("ddd");
    } else {
      formattedTime = messageTime.format("D/M/YYYY");
    }

    return formattedTime;
  }, [timestamp]);
}
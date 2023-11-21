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
      formattedTime = messageTime.format("HH:mm");
    } else if (diff < 168) {
      formattedTime = messageTime.format("ddd HH:mm");
    } else {
      formattedTime = messageTime.format("D/M/YYYY HH:mm");
    }

    return formattedTime;
  }, [timestamp]);
}

export function useFormatOnlyTime(timestamp: number): string {
  return useMemo(() => {
    const messageTime = dayjs(timestamp);
    const formattedTime = messageTime.format("HH:mm");
    return formattedTime;
  }, [timestamp]);
}

export function useFormattedMonthYear(timestamp: number): string {
  return useMemo(() => {
    const now = dayjs();
    const messageTime = dayjs(timestamp);

    const diff = now.diff(messageTime, "hour");

    let formattedTime: string;

    if (diff < 168) {
      formattedTime = messageTime.format("ddd HH:mm");
    } else if (diff >= 720) {
      // Check if the difference is greater than or equal to a month (720 hours)
      formattedTime = messageTime.format("D/M/YYYY HH:mm");
    } else {
      formattedTime = ""; // Set formattedTime to an empty string if the condition is not met
    }

    return formattedTime;
  }, [timestamp]);
}

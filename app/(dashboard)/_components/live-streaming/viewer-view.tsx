import { useMeeting } from "@videosdk.live/react-sdk";
import { Participant } from "@videosdk.live/react-sdk/dist/types/participant";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface MeetingState {
  participants: Map<string, Participant>;
  hlsState: string;
  hlsUrls: {
    downstreamUrl: string;
  };
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

export default ViewerView;
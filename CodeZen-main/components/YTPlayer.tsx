"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubeProgressPlayer({
  videoId,
  on75Percent,
}: {
  videoId: string;
  on75Percent: () => void;
}) {
  const playerRef = useRef<any>(null);
  const triggeredRef = useRef(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const createPlayer = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        events: {
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              if (intervalRef.current) return;

              intervalRef.current = setInterval(() => {
                const player = playerRef.current;
                if (!player || triggeredRef.current) return;

                const current = player.getCurrentTime();
                const duration = player.getDuration();
                console.log(current, duration,current / duration >= 0.75);

                if (duration > 0 && current / duration >= 0.75) {
                  triggeredRef.current = true;
                  clearInterval(intervalRef.current);
                  on75Percent();
                }
              }, 1000);
            }

            if (
              e.data === window.YT.PlayerState.PAUSED ||
              e.data === window.YT.PlayerState.ENDED
            ) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      clearInterval(intervalRef.current);
      playerRef.current?.destroy?.();
    };
  }, [videoId, on75Percent]);

  return (
    <div className="w-full aspect-video">
      <div id="yt-player" className="w-full h-full" />
    </div>
  );
}

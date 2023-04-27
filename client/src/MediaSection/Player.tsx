import { useEffect, useCallback, useRef } from 'react';
import { socket } from '../socket';

import styles from './MediaSection.module.css';

function Player({ src, isPlaying, currentTime, lastEvent, finishEvtProcessing, setIsPlaying, subtitle }: PlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function handlePlay() {
      if (!playerRef.current) {
        return;
      }

      try {
        if (isPlaying) {
          await playerRef.current.play();
        } else {
          playerRef.current.pause();
        }
      } catch (err) {
        console.log('err', err);
      }
    }

    handlePlay();
  }, [isPlaying]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.currentTime = currentTime;
  }, [currentTime]);

  const onPlay = useCallback(() => {
    setIsPlaying(true);
    if (lastEvent === 'videoPlayed') {
      return finishEvtProcessing();
    }
    socket.emit('videoPlayed', {
      time: playerRef.current?.currentTime,
    });
  }, [finishEvtProcessing, lastEvent, setIsPlaying]);

  const onPause = useCallback(() => {
    setIsPlaying(false);
    if (lastEvent === 'videoPaused') {
      return finishEvtProcessing();
    }
    socket.emit('videoPaused');
  }, [finishEvtProcessing, lastEvent, setIsPlaying]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video ref={playerRef} className={styles.playerVideo} onPlay={onPlay} onPause={onPause} controls>
      <source src={src} />
      {subtitle && <track label="English" kind="subtitles" src={subtitle} default />}
    </video>
  );
}

type PlayerProps = {
  src: string;
  subtitle: string | undefined;
  isPlaying: boolean;
  currentTime: number;
  lastEvent: string | null;
  finishEvtProcessing: () => void;
  setIsPlaying: (_s: boolean) => void;
};

export default Player;

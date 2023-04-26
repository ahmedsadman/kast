import { useEffect, useCallback, useRef } from 'react';
import { socket } from '../socket';

import styles from './MediaSection.module.css';

function Player({ src, isPlaying, currentTime, lastEvent, finishEvtProcessing }: PlayerProps) {
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
    if (lastEvent === 'videoPlayed') {
      return finishEvtProcessing();
    }
    socket.emit('videoPlayed', {
      time: playerRef.current?.currentTime,
    });
  }, [finishEvtProcessing, lastEvent]);

  const onPause = useCallback(() => {
    if (lastEvent === 'videoPaused') {
      return finishEvtProcessing();
    }
    socket.emit('videoPaused');
  }, [finishEvtProcessing, lastEvent]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video ref={playerRef} className={styles.playerVideo} onPlay={onPlay} onPause={onPause} controls src={src} />
  );
}

type PlayerProps = {
  src: string;
  isPlaying: boolean;
  currentTime: number;
  lastEvent: string | null;
  finishEvtProcessing: () => void;
};

export default Player;

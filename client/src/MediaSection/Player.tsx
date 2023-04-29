import { useEffect, useCallback, useRef } from 'react';
import { socket } from '../socket';

import styles from './MediaSection.module.css';

function Player({ src, isPlaying, currentTime, lastEventTime, subtitle, borderColor }: PlayerProps) {
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

  const shouldEmitEvent = useCallback(() => {
    return Date.now() - lastEventTime >= 1000;
  }, [lastEventTime]);

  const onPlay = useCallback(() => {
    console.log('called onPlay');

    if (shouldEmitEvent()) {
      socket.emit('videoPlayed', {
        time: playerRef.current?.currentTime,
      });
    }
  }, [shouldEmitEvent]);

  const onPause = useCallback(() => {
    console.log('called onPause');

    if (shouldEmitEvent()) {
      socket.emit('videoPaused');
    }
  }, [shouldEmitEvent]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={playerRef}
      className={styles.playerVideo}
      style={{ border: `3px solid ${borderColor}`, transition: 'border 2s' }}
      onPlay={onPlay}
      onPause={onPause}
      controls
    >
      <source src={src} />
      {subtitle && <track label="English" kind="subtitles" src={subtitle} default />}
    </video>
  );
}

type PlayerProps = {
  src: string;
  subtitle: string | undefined;
  isPlaying: boolean | null;
  currentTime: number;
  lastEventTime: number;
  borderColor: string;
};

export default Player;

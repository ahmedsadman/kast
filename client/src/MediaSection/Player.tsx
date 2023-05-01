import { useEffect, useCallback, useRef } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { socket } from '../socket';

import styles from './MediaSection.module.css';

function Player({ src, lastEventTime, subtitle, borderColor }: PlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const playerState = usePlayer();

  useEffect(() => {
    async function handlePlay() {
      if (!playerRef.current) {
        return;
      }

      try {
        if (playerState?.isPlaying) {
          await playerRef.current.play();
        } else {
          playerRef.current.pause();
        }
      } catch (err) {
        console.log('err', err);
      }
    }

    handlePlay();
  }, [playerState?.isPlaying]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.currentTime = playerState?.currentTime || 0;
  }, [playerState?.currentTime]);

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
  lastEventTime: number;
  borderColor: string;
};

export default Player;

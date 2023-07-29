import { useEffect, useCallback, useRef } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { socket } from '../socket';

import styles from './MediaSection.module.css';

function Player({ src, borderColor }: PlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const playerState = usePlayer();

  useEffect(() => {
    async function handlePlay() {
      if (!playerRef.current || !playerState) {
        return;
      }

      try {
        if (playerState.isPlaying) {
          playerRef.current.currentTime = playerState.currentTime || 0;
          await playerRef.current.play();
        } else {
          playerRef.current.pause();
        }
      } catch (err) {
        console.log('err', err);
      }
    }

    handlePlay();
  }, [playerState]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.load();
  }, [src]);

  const shouldEmitEvent = useCallback(() => {
    if (!playerState?.lastEventTime) {
      return true;
    }
    return Date.now() - playerState.lastEventTime >= 1000;
  }, [playerState]);

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
      controlsList="nofullscreen"
    >
      <source src={src} />
      {playerState?.subtitleFile && <track label="English" kind="subtitles" src={playerState.subtitleFile} default />}
    </video>
  );
}

type PlayerProps = {
  src: string;
  borderColor: string;
};

export default Player;

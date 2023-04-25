import { useEffect, useCallback, useRef } from 'react';
import { socket } from '../socket';

import styles from './MediaSection.module.css';

function Player({ src, isPlaying, currentTime }: PlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const lastEventTime = useRef(Date.now());

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    if (isPlaying) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.currentTime = currentTime;
  }, [currentTime]);

  const eventEmitter = useCallback((func: () => void) => {
    const currTime = Date.now();
    if (currTime - lastEventTime.current > 200) {
      console.log('delayed run');
      func();
      lastEventTime.current = currTime;
    }
  }, []);

  const onPlay = useCallback(() => {
    socket.emit('videoPlayed', {
      time: playerRef.current?.currentTime,
    });
  }, []);

  const onPause = useCallback(() => {
    socket.emit('videoPaused');
  }, []);

  const onSeeked = useCallback(() => {
    eventEmitter(() => {
      socket.emit('videoSeeked', {
        time: playerRef.current?.currentTime,
      });
    });
  }, [eventEmitter]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={playerRef}
      className={styles.playerVideo}
      onPlay={onPlay}
      onPause={onPause}
      onSeeked={onSeeked}
      controls
      src={src}
    />
  );
}

type PlayerProps = {
  src: string;
  isPlaying: boolean;
  currentTime: number;
};

export default Player;

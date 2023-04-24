import { useEffect, useRef } from 'react';
import eventsHandler from '../eventsHandler';

import styles from './MediaSection.module.css';

function Player({ src }: PlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);

  const onVideoPlayed = () => {
    eventsHandler.emitVideoPlayed(playerRef.current?.currentTime || 0);
  };

  const onVideoPaused = () => {
    eventsHandler.emitVideoPause();
  };

  const registerPlayerEvents = () => {
    eventsHandler.registerVideoEvents((name, time) => {
      if (!playerRef.current) {
        return;
      }

      if (name === 'videoPlayed') {
        playerRef.current.currentTime = time || 0;
        playerRef.current.play();
      }

      if (name === 'videoPaused') {
        playerRef.current.pause();
      }
    });
  };

  useEffect(() => {
    registerPlayerEvents();
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={playerRef}
      className={styles.playerVideo}
      onPlay={onVideoPlayed}
      onPause={onVideoPaused}
      controls
      src={src}
    />
  );
}

type PlayerProps = {
  src: string;
};

export default Player;

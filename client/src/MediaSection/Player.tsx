import { useEffect, useRef } from 'react';
import eventsHandler from '../eventsHandler';

import styles from './MediaSection.module.css';

function Player({ src }: PlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);

  const handleVideoPlayed = () => {
    eventsHandler.emitVideoPlayed(playerRef.current?.currentTime || 0);
  };

  useEffect(() => {
    if (playerRef.current) {
      eventsHandler.registerVideoEvents((_name, time) => {
        if (playerRef.current) {
          playerRef.current.currentTime = time;
          playerRef.current.play();
        }
      });
    }
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video ref={playerRef} className={styles.playerVideo} onPlay={handleVideoPlayed} controls src={src} />
  );
}

type PlayerProps = {
  src: string;
};

export default Player;

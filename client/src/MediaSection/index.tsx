import { useState } from 'react';
import SelectionPlaceholder from './SelectionPlaceholder';
import Player from './Player';
import styles from './MediaSection.module.css';

function MediaSection({ isPlaying, currentTime, lastEvent, finishEvtProcessing, setIsPlaying }: MediaSectionProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleVideoSelect = (file: File | undefined) => {
    setVideoSrc(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className={styles.container}>
      {!videoSrc ? (
        <SelectionPlaceholder onChange={handleVideoSelect} />
      ) : (
        <Player
          lastEvent={lastEvent}
          finishEvtProcessing={finishEvtProcessing}
          isPlaying={isPlaying}
          currentTime={currentTime}
          src={videoSrc}
          setIsPlaying={setIsPlaying}
        />
      )}
    </div>
  );
}

type MediaSectionProps = {
  isPlaying: boolean;
  currentTime: number;
  lastEvent: string | null;
  finishEvtProcessing: () => void;
  setIsPlaying: (_s: boolean) => void;
};

export default MediaSection;

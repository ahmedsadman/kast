import { useState } from 'react';
import SelectionPlaceholder from './SelectionPlaceholder';
import Player from './Player';
import styles from './MediaSection.module.css';

function MediaSection({ isPlaying, currentTime, lastEventTime, subtitle, borderColor }: MediaSectionProps) {
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
          lastEventTime={lastEventTime}
          subtitle={subtitle}
          isPlaying={isPlaying}
          currentTime={currentTime}
          src={videoSrc}
          borderColor={borderColor}
        />
      )}
    </div>
  );
}

type MediaSectionProps = {
  isPlaying: boolean | null;
  currentTime: number;
  lastEventTime: number;
  subtitle?: string;
  borderColor: string;
};

export default MediaSection;

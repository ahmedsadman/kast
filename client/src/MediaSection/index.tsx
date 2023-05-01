import { useState } from 'react';
import SelectionPlaceholder from './SelectionPlaceholder';
import Player from './Player';
import styles from './MediaSection.module.css';

function MediaSection({ lastEventTime, subtitle, borderColor }: MediaSectionProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleVideoSelect = (file: File | undefined) => {
    setVideoSrc(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className={styles.container}>
      {!videoSrc ? (
        <SelectionPlaceholder onChange={handleVideoSelect} />
      ) : (
        <Player lastEventTime={lastEventTime} subtitle={subtitle} src={videoSrc} borderColor={borderColor} />
      )}
    </div>
  );
}

type MediaSectionProps = {
  lastEventTime: number;
  subtitle?: string;
  borderColor: string;
};

export default MediaSection;

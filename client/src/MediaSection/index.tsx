import { useState } from 'react';
import SelectionPlaceholder from './SelectionPlaceholder';
import Player from './Player';
import styles from './MediaSection.module.css';

function MediaSection() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleVideoSelect = (file: File | undefined) => {
    setVideoSrc(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className={styles.container}>
      {!videoSrc ? <SelectionPlaceholder onChange={handleVideoSelect} /> : <Player src={videoSrc} />}
    </div>
  );
}

export default MediaSection;

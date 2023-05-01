import React, { useRef } from 'react';
import { Button } from '@chakra-ui/react';
import { usePlayerDispatch } from '../contexts/PlayerContext';
import styles from './MediaSection.module.css';

function SelectionPlaceholder() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const playerDispatch = usePlayerDispatch();

  const handleSelectVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const fileUrl = file ? URL.createObjectURL(file) : undefined;
    playerDispatch?.({ type: 'update_video_file', payload: { file: fileUrl } });
  };

  return (
    <div className={styles.selectionPhContainer}>
      <div>
        <Button colorScheme="blue" onClick={() => inputFileRef.current?.click()}>
          Select Video
        </Button>
        <input
          className={styles.selectionPhFileInput}
          accept="video/*"
          type="file"
          ref={inputFileRef}
          onChange={handleSelectVideo}
        />
      </div>
    </div>
  );
}

export default SelectionPlaceholder;

import React, { useRef } from 'react';
import { Button } from '@chakra-ui/react';
import styles from './MediaSection.module.css';

function SelectionPlaceholder({ onChange }: SelectionPlaceholderProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSelectVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0]);
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

type SelectionPlaceholderProps = {
  onChange: (_f: File | undefined) => void;
};

export default SelectionPlaceholder;

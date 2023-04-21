import { useRef } from 'react';
import { Button } from '@chakra-ui/react';
import styles from './MediaSection.module.css';

function SelectionPlaceholder() {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSelectVideo = () => {
    inputFileRef.current?.click();
  };

  return (
    <div className={styles.selectionPhContainer}>
      <div>
        <Button colorScheme="blue" onClick={handleSelectVideo}>
          Select Video
        </Button>
        <input className={styles.selectionPhFileInput} accept="video/*" type="file" ref={inputFileRef} />
      </div>
    </div>
  );
}

export default SelectionPlaceholder;

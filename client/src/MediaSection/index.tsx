import { usePlayer } from '../contexts/PlayerContext';
import SelectionPlaceholder from './SelectionPlaceholder';
import Player from './Player';
import styles from './MediaSection.module.css';

function MediaSection({ borderColor }: MediaSectionProps) {
  const playerState = usePlayer();

  return (
    <div className={styles.container}>
      {!playerState?.videoFile ? (
        <SelectionPlaceholder />
      ) : (
        <Player src={playerState.videoFile} borderColor={borderColor} />
      )}
    </div>
  );
}

type MediaSectionProps = {
  borderColor: string;
};

export default MediaSection;

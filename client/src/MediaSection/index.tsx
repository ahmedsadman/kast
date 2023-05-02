import { usePlayer } from '../contexts/PlayerContext';
import SelectionPlaceholder from './SelectionPlaceholder';
import Player from './Player';
import ActionsMenu from './ActionsMenu';

import styles from './MediaSection.module.css';

function MediaSection({ borderColor }: MediaSectionProps) {
  const playerState = usePlayer();

  return (
    <div className={styles.container}>
      {!playerState?.videoFile ? (
        <SelectionPlaceholder />
      ) : (
        <div className={styles.mainContainer}>
          <ActionsMenu />
          <Player src={playerState.videoFile} borderColor={borderColor} />
        </div>
      )}
    </div>
  );
}

type MediaSectionProps = {
  borderColor: string;
};

export default MediaSection;

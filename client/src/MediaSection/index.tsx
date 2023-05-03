import React, { useRef, useCallback, useMemo } from 'react';
import { usePlayer, usePlayerDispatch } from '../contexts/PlayerContext';
import SelectionPlaceholder from './SelectionPlaceholder';
import Player from './Player';
import TopBar from './TopBar';

import styles from './MediaSection.module.css';

function MediaSection({ borderColor }: MediaSectionProps) {
  const playerState = usePlayer();
  const playerDispatch = usePlayerDispatch();
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  const onChangeSubtitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const fileUrl = file ? URL.createObjectURL(file) : undefined;
      playerDispatch?.({
        type: 'update_subtitle_file',
        payload: {
          file: fileUrl,
        },
      });
    },
    [playerDispatch],
  );

  const menuItems = useMemo(
    () => [
      {
        label: 'Change Video File',
        action: () => {
          console.log('clicked');
        },
      },
      { label: 'Add/Update Subtitles', action: () => subtitleInputRef.current?.click() },
    ],
    [],
  );

  return (
    <div className={styles.container}>
      {!playerState?.videoFileUrl ? (
        // TODO: Remove this child component and elevate everything
        <SelectionPlaceholder />
      ) : (
        <div className={styles.mainContainer}>
          <TopBar fileName={playerState.videoFileName} menuItems={menuItems} />
          <Player src={playerState.videoFileUrl} borderColor={borderColor} />
        </div>
      )}
      <input
        ref={subtitleInputRef}
        accept="text/vtt"
        type="file"
        style={{ display: 'none' }}
        onChange={onChangeSubtitle}
      />
    </div>
  );
}

type MediaSectionProps = {
  borderColor: string;
};

export default MediaSection;

import React, { useRef, useCallback, useMemo } from 'react';
import { Button } from '@chakra-ui/react';
import { usePlayer, usePlayerDispatch } from '../contexts/PlayerContext';
import Player from './Player';
import TopBar from './TopBar';

import styles from './MediaSection.module.css';

function MediaSection({ borderColor, openInviteModal }: MediaSectionProps) {
  const playerState = usePlayer();
  const playerDispatch = usePlayerDispatch();
  const videoInputRef = useRef<HTMLInputElement>(null);
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

  const onChangeVideo = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      const fileUrl = file ? URL.createObjectURL(file) : undefined;
      playerDispatch?.({ type: 'update_video_file', payload: { file: fileUrl, fileName: file?.name } });
    },
    [playerDispatch],
  );

  const menuItems = useMemo(
    () => [
      {
        label: 'Change Video File',
        action: () => videoInputRef.current?.click(),
      },
      { label: 'Add/Update Subtitles', action: () => subtitleInputRef.current?.click() },
    ],
    [],
  );

  return (
    <div className={styles.container}>
      <TopBar openInviteModal={openInviteModal} fileName={playerState?.videoFileName} menuItems={menuItems} />
      {!playerState?.videoFileUrl ? (
        <div className={styles.selectionPhContainer}>
          <Button colorScheme="blue" onClick={() => videoInputRef.current?.click()}>
            Select Video
          </Button>
        </div>
      ) : (
        <Player src={playerState.videoFileUrl} borderColor={borderColor} />
      )}
      <input
        ref={subtitleInputRef}
        accept="text/vtt"
        type="file"
        style={{ display: 'none' }}
        onChange={onChangeSubtitle}
      />
      <input style={{ display: 'none' }} accept="video/*" type="file" ref={videoInputRef} onChange={onChangeVideo} />
    </div>
  );
}

type MediaSectionProps = {
  borderColor: string;
  openInviteModal: () => void;
};

export default MediaSection;

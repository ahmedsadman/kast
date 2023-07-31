import { Box, HStack } from '@chakra-ui/react';
import { socket } from '../../socket';

import styles from './ReactionBar.module.css';

function ReactionBar() {
  const emojis = ['😆', '😍', '🔥', '🤮', '😭', '🤯', '😠'];

  const handleClick = (emoji: string) => {
    socket.emit('newReaction', {
      emoji,
    });
  };

  return (
    <HStack justifyContent="space-around" spacing={0}>
      {emojis.map((emoji) => (
        <Box
          className={styles.reactionEmoji}
          cursor="pointer"
          key={emoji}
          fontSize={{ base: '1em', lg: '1.2em', '2xl': '1.5em' }}
          onClick={() => handleClick(emoji)}
        >
          {emoji}
        </Box>
      ))}
    </HStack>
  );
}

export default ReactionBar;

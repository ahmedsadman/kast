import { Box, HStack } from '@chakra-ui/react';
import { socket } from '../../socket';

function ReactionBar() {
  const emojis = ['😆', '🤮', '😍', '🔥', '😭'];

  const handleClick = (emoji: string) => {
    socket.emit('newReaction', {
      emoji,
    });
  };

  return (
    <HStack justifyContent="space-around">
      {emojis.map((emoji) => (
        <Box cursor="pointer" key={emoji} fontSize="1.5em" onClick={() => handleClick(emoji)}>
          {emoji}
        </Box>
      ))}
    </HStack>
  );
}

export default ReactionBar;

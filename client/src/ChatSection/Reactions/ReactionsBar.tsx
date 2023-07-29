import { Box, HStack } from '@chakra-ui/react';

function ReactionBar() {
  const emojis = ['😆', '🤮', '😍', '🔥', '😭'];

  return (
    <HStack justifyContent="space-around">
      {emojis.map((emoji) => (
        <Box cursor="pointer" key={emoji} fontSize="1.5em">
          {emoji}
        </Box>
      ))}
    </HStack>
  );
}

export default ReactionBar;

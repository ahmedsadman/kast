import { Flex, Input, HStack, IconButton, Box } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import Message from './Message';

function ChatSection() {
  return (
    <Flex h="100vh" direction="column" p={2}>
      <Box flex={1} overflow="auto" mb={5} p={3}>
        {Array(200)
          .fill(0)
          .map((i, _a) => (
            <Message key={i} name="TA" content="Hello world, how are you doing today? Thanks for asking this" />
          ))}
      </Box>
      <HStack flex={0}>
        <Input variant="outline" />
        <IconButton colorScheme="blue" aria-label="Send message" icon={<CheckIcon />} />
      </HStack>
    </Flex>
  );
}

export default ChatSection;

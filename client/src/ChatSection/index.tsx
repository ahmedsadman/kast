import React, { useState, useCallback } from 'react';
import { Flex, Input, HStack, IconButton, Box } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import Message from './Message';

import { socket } from '../socket';

function ChatSection() {
  const [messageText, setMessageText] = useState('');

  const handleMessageSend = useCallback(() => {
    socket.emit('newMessage', {
      content: messageText,
    });
    setMessageText('');
  }, [messageText]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  }, []);

  return (
    <Flex h="100vh" direction="column" p={2}>
      <Box flex={1} overflow="auto" mb={5} p={3}>
        {Array(50)
          .fill(0)
          .map((i, _a) => (
            <Message key={_a} name="TA" content="Hello world, how are you doing today? Thanks for asking this" />
          ))}
      </Box>
      <HStack flex={0}>
        <Input type="text" variant="outline" value={messageText} onChange={handleInputChange} />
        <IconButton colorScheme="blue" aria-label="Send message" icon={<CheckIcon />} onClick={handleMessageSend} />
      </HStack>
    </Flex>
  );
}

export default ChatSection;

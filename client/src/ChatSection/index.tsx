import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Flex, Input, HStack, IconButton, Box } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import Message from './Message';
import { MessageType } from '../types';

import { socket } from '../socket';

function ChatSection({ messages }: ChatSectionProps) {
  const [messageText, setMessageText] = useState('');
  const messageEnd = useRef<HTMLDivElement>(null);

  const handleMessageSend = useCallback(() => {
    socket.emit('newMessage', {
      content: messageText,
    });
    setMessageText('');
  }, [messageText]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleMessageSend();
      }
    },
    [handleMessageSend],
  );

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Flex h="100vh" direction="column" p={2}>
      <Box flex={1} overflow="auto" mb={5} p={3}>
        {messages.map((message) => (
          <Message key={message.id} name={message.name} content={message.content} />
        ))}
        <div ref={messageEnd}></div>
      </Box>
      <HStack flex={0}>
        <Input
          type="text"
          variant="outline"
          value={messageText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <IconButton colorScheme="blue" aria-label="Send message" icon={<CheckIcon />} onClick={handleMessageSend} />
      </HStack>
    </Flex>
  );
}

type ChatSectionProps = {
  messages: MessageType[];
};

export default ChatSection;

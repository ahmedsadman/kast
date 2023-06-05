import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Input, HStack, IconButton, Box, Flex } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { debounce } from 'lodash';
import Message from './Message';
import { useApp } from '../contexts/AppContext';

import { socket } from '../socket';

function ChatSection({ toggleBorderEffect }: ChatSectionProps) {
  const appState = useApp();
  const messages = useMemo(() => appState?.messages || [], [appState?.messages]);

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

  const notifyNewMessage = useCallback(debounce(toggleBorderEffect, 3000), [toggleBorderEffect]);

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth' });

    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.user.id !== socket.id && !lastMessage?.systemMessage) {
      notifyNewMessage();
    }
  }, [messages, notifyNewMessage]);

  return (
    <Flex direction="column" flex={1} justifyContent="space-between">
      <Box height={{ base: '84vh', xl: '84vh', '2xl': '88vh' }} overflow="auto" mt={5}>
        {messages.map((message) => (
          <Message
            key={message.id}
            name={message.user.name}
            content={message.content}
            systemMessage={message.systemMessage}
          />
        ))}
        <div ref={messageEnd}></div>
      </Box>
      <HStack flex={0} p={1}>
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
  toggleBorderEffect: () => void;
};

export default ChatSection;

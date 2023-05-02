import { useCallback } from 'react';
import { Avatar, HStack, Text, Tooltip } from '@chakra-ui/react';

function Message({ name, content, systemMessage }: AvatarProps) {
  const getInitials = useCallback((name: string) => {
    const parts = name.split(' ');

    if (parts.length > 1) {
      return `${parts[0].charAt(0).toUpperCase()}${parts[1].charAt(0).toUpperCase()}`;
    }

    return parts[0].charAt(0).toUpperCase();
  }, []);

  return (
    <HStack mb={4} pl="4%">
      <Tooltip label={name}>
        <Avatar size="sm" name={name} mr={2} getInitials={getInitials} />
      </Tooltip>

      <Text
        as={systemMessage ? 'samp' : undefined}
        color={systemMessage ? 'blue.300' : 'white'}
        fontSize={systemMessage ? 'sm' : 'md'}
      >
        {content}
      </Text>
    </HStack>
  );
}

type AvatarProps = {
  name: string;
  content: string;
  systemMessage: boolean;
};

export default Message;

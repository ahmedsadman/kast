import { Avatar, HStack, Text, Tooltip } from '@chakra-ui/react';
import { getNameInitials } from '../utils';

function Message({ name, content, systemMessage }: AvatarProps) {
  return (
    <HStack mb={4} pl="4%">
      <Tooltip label={name}>
        <Avatar size="sm" name={name} mr={2} getInitials={getNameInitials} />
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

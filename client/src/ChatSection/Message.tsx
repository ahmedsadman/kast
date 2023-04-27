import { Avatar, HStack, Text } from '@chakra-ui/react';

function Message({ name, content, systemMessage }: AvatarProps) {
  return (
    <HStack mb={5}>
      <Avatar size="sm" name={name} mr={2} />
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

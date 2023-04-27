import { Avatar, HStack } from '@chakra-ui/react';

function Message({ name, content }: AvatarProps) {
  return (
    <HStack mb={5}>
      <Avatar size="sm" name={name} mr={2} />
      <div>{content}</div>
    </HStack>
  );
}

type AvatarProps = {
  name: string;
  content: string;
};

export default Message;

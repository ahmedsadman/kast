import { Avatar, HStack, Text, Tooltip } from '@chakra-ui/react';
import { getNameInitials } from '../utils';

function Message({ name, content, systemMessage }: AvatarProps) {
  return (
    <HStack mb={4} pl="4%" fontSize={{ base: '0.9em', lg: '0.9em', '2xl': '1em' }} alignItems="center">
      <Tooltip label={name}>
        <Avatar size={{ base: 'xs', '2xl': 'sm' }} name={name} mr="1%" getInitials={getNameInitials} />
      </Tooltip>

      <Text as={systemMessage ? 'samp' : undefined} color={systemMessage ? 'blue.300' : 'white'}>
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

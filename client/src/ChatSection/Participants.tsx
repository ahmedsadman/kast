import { AvatarGroup, Avatar, Center, Tooltip } from '@chakra-ui/react';
import { useApp } from '../contexts/AppContext';
import { getNameInitials } from '../utils';

function Participants() {
  const appState = useApp();
  const users = appState?.users;
  const participantsString = users ? `${users.map((user) => user.name).join(', ')} (${users.length})` : '';

  return (
    <Center mt={5}>
      <Tooltip label={participantsString}>
        <AvatarGroup size="xs" max={5}>
          {appState?.users.map((user) => (
            <Avatar getInitials={getNameInitials} key={user.id} cursor="pointer" name={user.name} />
          ))}
        </AvatarGroup>
      </Tooltip>
    </Center>
  );
}

export default Participants;

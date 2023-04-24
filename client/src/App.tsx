import { useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import MediaSection from './MediaSection';
import JoinModal from './JoinModal';
import InviteModal from './InviteModal';
import eventsHandler from './eventsHandler';
import { pollUserDetails } from './services';

import styles from './App.module.css';

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleJoinModalSubmit = async (name: string) => {
    setIsLoading(true);
    const _roomId = window.location?.pathname?.split('/')?.[1];
    const id = await eventsHandler.connect();

    if (!id) {
      return console.log('error occured on first connect');
    }

    eventsHandler.emitJoin(name, _roomId ? _roomId : null); // TODO: Maybe convert to promise?
    const user = await pollUserDetails(id);
    console.log('user is', user);
    setRoomId(user.roomId);
    setIsLoading(false);
    setShowJoinModal(false);

    if (!_roomId) {
      setShowInviteModal(true);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <JoinModal
        loading={isLoading}
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSubmit={handleJoinModalSubmit}
      />
      <InviteModal isOpen={showInviteModal} roomId={roomId} onClose={() => setShowInviteModal(false)} />
      <Grid h="100vh" flex={1} templateColumns="repeat(8, 1fr)" gap={0}>
        <GridItem colSpan={7} bg="#2C3333">
          <MediaSection />
        </GridItem>
        <GridItem colSpan={1} bg="black" />
      </Grid>
    </div>
  );
}

export default App;

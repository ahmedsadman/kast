import { useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import MediaSection from './MediaSection';
import JoinModal from './JoinModal';
import eventsHandler from './eventsHandler';

import styles from './App.module.css';

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(true);

  const handleJoinModalSubmit = async (name: string) => {
    const _roomId = window.location?.pathname?.split('/')?.[1];
    const id = await eventsHandler.connect();
    console.log('id is', id);
    eventsHandler.emitJoin(name, _roomId ? _roomId : null); // TODO: Maybe convert to promise?
    setRoomId(_roomId);
    setShowJoinModal(false);
  };

  return (
    <div className={styles.mainContainer}>
      <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} onSubmit={handleJoinModalSubmit} />
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

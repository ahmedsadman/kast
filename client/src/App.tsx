import { useEffect, useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import MediaSection from './MediaSection';
import JoinModal from './JoinModal';

import styles from './App.module.css';

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const roomId = window.location?.pathname?.split('/')?.[1];
    console.log('id is', roomId);

    // TODO: Improve RoomID validation
    if (!roomId) {
      setShowJoinModal(true);
    }

    setRoomId(roomId);
  }, []);

  return (
    <div className={styles.mainContainer}>
      <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
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

import { useState, useEffect } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import MediaSection from './MediaSection';
import JoinModal from './JoinModal';
import InviteModal from './InviteModal';
import { socket } from './socket';
import { pollUserDetails } from './services';

import styles from './App.module.css';

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleJoinModalSubmit = async (name: string) => {
    setIsLoading(true);
    const _roomId = window.location?.pathname?.split('/')?.[1];

    socket.emit('join', {
      roomId: _roomId || socket.id,
      name,
    });

    const user = await pollUserDetails(socket.id);
    setRoomId(user.roomId);
    setIsLoading(false);
    setShowJoinModal(false);

    if (!_roomId) {
      setShowInviteModal(true);
    }
  };

  useEffect(() => {
    function onConnect() {
      setIsSocketConnected(true);
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    function onVideoPlayed(data: { id: string; time: number }) {
      console.log('onVideoPlayed');
      setIsPlaying(true);
      setCurrentTime(data.time);
    }

    function onVideoPaused() {
      console.log('onVideoPaused');
      setIsPlaying(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('videoPlayed', onVideoPlayed);
    socket.on('videoPaused', onVideoPaused);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('videoPlayed', onVideoPlayed);
      socket.off('videoPaused', onVideoPaused);
    };
  }, []);

  return (
    <div className={styles.mainContainer}>
      <JoinModal
        loading={isLoading}
        isOpen={showJoinModal && isSocketConnected}
        onClose={() => setShowJoinModal(false)}
        onSubmit={handleJoinModalSubmit}
      />
      <InviteModal isOpen={showInviteModal} roomId={roomId} onClose={() => setShowInviteModal(false)} />
      <Grid h="100vh" flex={1} templateColumns="repeat(8, 1fr)" gap={0}>
        <GridItem colSpan={7} bg="#2C3333">
          <MediaSection currentTime={currentTime} isPlaying={isPlaying} />
        </GridItem>
        <GridItem colSpan={1} bg="black" />
      </Grid>
    </div>
  );
}

export default App;

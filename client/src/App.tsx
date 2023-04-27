import { useState, useEffect } from 'react';
import { Grid, GridItem, Box, Flex } from '@chakra-ui/react';
import MediaSection from './MediaSection';
import ChatSection from './ChatSection';
import JoinModal from './JoinModal';
import InviteModal from './InviteModal';
import { socket } from './socket';
import { pollUserDetails } from './services';
import { MessageType } from './types';

import styles from './App.module.css';

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [subtitleFile, setSubtitleFile] = useState<string | undefined>(undefined);

  const [lastEvent, setLastEvent] = useState<string | null>(null);

  // TODO: Do a proper refactor later
  const handleSubtitleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSubtitleFile(file ? URL.createObjectURL(file) : undefined);
  };

  const handleJoinModalSubmit = async (name: string) => {
    setIsLoading(true);
    const roomId = window.location?.pathname?.split('/')?.[1];

    socket.emit('join', {
      roomId,
      name,
    });

    const user = await pollUserDetails(socket.id);
    setRoomId(user.roomId);
    setIsLoading(false);
    setShowJoinModal(false);

    if (!roomId) {
      setShowInviteModal(true);
    }
  };

  const finishEvtProcessing = () => {
    setLastEvent(null);
  };

  useEffect(() => {
    function onConnect() {
      if (socket.recovered) {
        console.log('connection recovered');
      }
      setIsSocketConnected(true);
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    function onVideoPlayed(data: { id: string; time: number }) {
      console.log('onVideoPlayed');
      setLastEvent('videoPlayed');
      setIsPlaying(true);
      setCurrentTime(data.time);
    }

    function onVideoPaused() {
      console.log('onVideoPaused');
      setLastEvent('videoPaused');
      setIsPlaying(false);
    }

    function onNewMessage(data: MessageType) {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log('new message', data);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('videoPlayed', onVideoPlayed);
    socket.on('videoPaused', onVideoPaused);
    socket.on('newMessage', onNewMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('videoPlayed', onVideoPlayed);
      socket.off('videoPaused', onVideoPaused);
      socket.off('newMessage', onNewMessage);
    };
  }, []);

  return (
    <div className={styles.mainContainer}>
      <JoinModal
        loading={isLoading}
        isSocketConnected={isSocketConnected}
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSubmit={handleJoinModalSubmit}
      />
      <InviteModal isOpen={showInviteModal} roomId={roomId} onClose={() => setShowInviteModal(false)} />
      <Grid h="100vh" flex={1} templateColumns="repeat(12, 1fr)" gap={0}>
        <GridItem colSpan={10} bg="#2C3333">
          <MediaSection
            lastEvent={lastEvent}
            setIsPlaying={setIsPlaying}
            finishEvtProcessing={finishEvtProcessing}
            currentTime={currentTime}
            isPlaying={isPlaying}
            subtitle={subtitleFile}
          />
        </GridItem>
        <GridItem colSpan={2} bg="black">
          {/* Refactor later */}
          <Box borderBottom="1px" m={2} p={2}>
            <input type="file" onChange={handleSubtitleSelect} />
          </Box>
          <Flex h="95vh" direction="column" p={2}>
            <ChatSection messages={messages} />
          </Flex>
        </GridItem>
      </Grid>
    </div>
  );
}

export default App;

import { useState, useEffect, useCallback } from 'react';
import { Grid, GridItem, Flex } from '@chakra-ui/react';
import MediaSection from './MediaSection';
import ChatSection from './ChatSection';
import JoinModal from './JoinModal';
import InviteModal from './InviteModal';
import { socket } from './socket';
import { pollUserDetails } from './services';
import { MessageType } from './types';

import styles from './App.module.css';

function App() {
  // TODO: Implement contexts
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);

  /*  
    An explanation why NULL state is needed for isPlaying:

    Let's say two clients, A and B
    Scenario 1 (A to B): isPlaying == false, A -> Play -> B plays -> B pause -> A pause (isPlaying == false)

    Scenario 2 (A to B): isPlaying == null, A -> Play ->  B plays -> B pause -> A pause (isPlaying == false)

    In Scenario 1, isPlaying is always false. But the <video> element is maintained by Refs. Unless the isPlaying changes,
    neither pause nor play will get trigerred. On the other hand, Scenario 2 changes the state from null -> false, which
    triggers the change. Notice that the NULL is required only for the first event, any consecutive events after that
    will properly change player state because of how events are setup
  */
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [subtitleFile, setSubtitleFile] = useState<string | undefined>(undefined);
  const [lastPlayerEvtTime, setLastPlayerEvtTime] = useState<number>(Date.now());
  const [borderColor, setBorderColor] = useState('transparent');

  // TODO: Do a proper refactor later
  const handleSubtitleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSubtitleFile(file ? URL.createObjectURL(file) : undefined);
  };

  const toggleBorderEffect = useCallback(() => {
    setBorderColor((prevColor) => (prevColor === 'red' ? 'transparent' : 'red'));
    setTimeout(() => {
      console.log('resetting');
      setBorderColor('transparent');
    }, 2700);
  }, []);

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
      setLastPlayerEvtTime(Date.now());
      setIsPlaying(true);
      setCurrentTime(data.time);
    }

    function onVideoPaused() {
      console.log('onVideoPaused');
      setLastPlayerEvtTime(Date.now());
      setIsPlaying(false);
    }

    function onNewMessage(data: MessageType) {
      setMessages((prevMessages) => [...prevMessages, data]);
      // console.log('new message', data);
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
      <Grid flex={1} templateColumns="repeat(12, 1fr)" gap={0}>
        <GridItem colSpan={10} bg="#2C3333">
          <MediaSection
            borderColor={borderColor}
            lastEventTime={lastPlayerEvtTime}
            currentTime={currentTime}
            isPlaying={isPlaying}
            subtitle={subtitleFile}
          />
        </GridItem>
        <GridItem colSpan={2} bg="black">
          <Flex direction="column" flex={1} h="100%">
            <input
              type="file"
              onChange={handleSubtitleSelect}
              style={{ margin: 0, padding: '5px 2%', fontSize: '0.9em', borderBottom: '1px solid white' }}
            />
            <ChatSection messages={messages} toggleBorderEffect={toggleBorderEffect} />
          </Flex>
        </GridItem>
      </Grid>
    </div>
  );
}

export default App;

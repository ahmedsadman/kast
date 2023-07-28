import { useState, useEffect } from 'react';
import { Grid, GridItem, Flex } from '@chakra-ui/react';
import MediaSection from './MediaSection';
import ChatSection from './ChatSection';
import JoinModal from './JoinModal';
import InviteModal from './InviteModal';
import { socket } from './socket';
import { pollUserDetails, getRoom, getRoomUsers } from './services';
import { usePlayerDispatch } from './contexts/PlayerContext';
import { useAppDispatch } from './contexts/AppContext';
import { MessageType, User } from './types';

import styles from './App.module.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [joinError, setJoinError] = useState<string | undefined>(undefined);
  const [socketError, setSocketError] = useState<string | undefined>(undefined);

  const playerDispatch = usePlayerDispatch();
  const appDispatch = useAppDispatch();

  // TODO: Refactor
  const handleJoinModalSubmit = async (name: string) => {
    setIsLoading(true);
    setJoinError(undefined);

    const roomId = window.location?.pathname?.split('/')?.[1];

    if (roomId) {
      const roomDetails = await getRoom(roomId);

      if (!roomDetails.found) {
        setJoinError('Room not found');
        setIsLoading(false);
        return;
      }
    }

    socket.emit('join', {
      roomId,
      name,
    });

    const user = await pollUserDetails(socket.id);

    if (!user?.roomId) {
      throw new Error("User object doesn't have room id");
    }

    const roomUsers = await getRoomUsers(user.roomId);
    appDispatch?.({ type: 'update_room_id', payload: { roomId: user.roomId } });
    appDispatch?.({ type: 'update_user_id', payload: { userId: user.id } });
    appDispatch?.({ type: 'update_users_list', payload: { users: roomUsers.users } });

    const newUrl = `${window.location.origin}/${user.roomId}`;
    window.history.replaceState(null, '', newUrl);

    setIsLoading(false);
    setShowJoinModal(false);

    if (!roomId) {
      setShowInviteModal(true);
    }
  };

  useEffect(() => {
    function onConnectFailed() {
      setSocketError('Could not reach server at the moment. It is possible that server is not live to minimize costs');
    }

    function onConnect() {
      if (socket.recovered) {
        console.log('connection recovered');
      }
      appDispatch?.({ type: 'connected' });
    }

    function onDisconnect() {
      appDispatch?.({ type: 'disconnected' });
    }

    function onVideoPlayed(data: { id: string; time: number }) {
      console.log('onVideoPlayed');
      playerDispatch?.({ type: 'played' });
      playerDispatch?.({ type: 'update_time', payload: { time: data.time } });
    }

    function onVideoPaused() {
      console.log('onVideoPaused');
      playerDispatch?.({ type: 'paused' });
    }

    function onNewMessage(data: MessageType) {
      appDispatch?.({ type: 'new_message', payload: { message: data } });
    }

    function onNewUserJoin(user: User) {
      console.log('user join', user);
      appDispatch?.({ type: 'user_join', payload: { user } });
    }

    function onUserLeave(user: User) {
      console.log('user leave', user);
      appDispatch?.({ type: 'user_leave', payload: { user } });
    }

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectFailed);
    socket.on('disconnect', onDisconnect);
    socket.on('videoPlayed', onVideoPlayed);
    socket.on('videoPaused', onVideoPaused);
    socket.on('newMessage', onNewMessage);
    socket.on('roomUserJoin', onNewUserJoin);
    socket.on('roomUserLeave', onUserLeave);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectFailed);
      socket.off('disconnect', onDisconnect);
      socket.off('videoPlayed', onVideoPlayed);
      socket.off('videoPaused', onVideoPaused);
      socket.off('newMessage', onNewMessage);
      socket.off('roomUserJoin', onNewUserJoin);
      socket.off('roomUserLeave', onUserLeave);
    };
  }, [playerDispatch, appDispatch]);

  return (
    <div className={styles.mainContainer}>
      <JoinModal
        loading={isLoading}
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSubmit={handleJoinModalSubmit}
        joinError={joinError}
        socketError={socketError}
      />
      <InviteModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
      <Grid flex={1} minHeight="100vh" templateColumns="repeat(12, 2fr)" gap={0}>
        <GridItem display="flex" colSpan={10} bg="#2C3333">
          <MediaSection openInviteModal={() => setShowInviteModal(true)} />
        </GridItem>
        <GridItem display="flex" colSpan={2} bg="black">
          <Flex direction="column" flex={1}>
            <div style={{ alignSelf: 'center' }}>kast</div>
            <ChatSection />
          </Flex>
        </GridItem>
      </Grid>
    </div>
  );
}

export default App;

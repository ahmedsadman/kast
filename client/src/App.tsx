import { useState, useEffect, useRef } from 'react';
import { Grid, GridItem, Flex } from '@chakra-ui/react';
import { useShepherd } from 'react-shepherd';
import { Tour } from 'shepherd.js';
import MediaSection from './MediaSection';
import ChatSection from './ChatSection';
import JoinModal from './JoinModal';
import InviteModal from './InviteModal';
import { socket, createEventHandlers } from './socket';
import { pollUserDetails, getRoom, getRoomUsers } from './services';
import { usePlayerDispatch } from './contexts/PlayerContext';
import { useAppDispatch } from './contexts/AppContext';
import { MessageType, User, ReactionMessage } from './types';
import { steps } from './tour';

import styles from './App.module.css';
import 'shepherd.js/dist/css/shepherd.css';

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: false,
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [joinError, setJoinError] = useState<string | undefined>(undefined);
  const [socketError, setSocketError] = useState<string | undefined>(undefined);
  const [tourComplete, setTourComplete] = useState(false);
  const tour = useRef<Tour | undefined>();
  const { Tour } = useShepherd();

  const playerDispatch = usePlayerDispatch();
  const appDispatch = useAppDispatch();
  const roomId = window.location?.pathname?.split('/')?.[1];

  // TODO: Refactor
  const handleJoinModalSubmit = async (name: string) => {
    setIsLoading(true);
    setJoinError(undefined);

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
    } else {
      startTour(tour.current);
    }
  };

  const startTour = (tour: Tour | undefined) => {
    if (!tour?.isActive() && !tourComplete) {
      tour?.start();
    }
  };

  useEffect(() => {
    tour.current = new Tour(tourOptions);
    tour.current.addSteps(steps);
    tour.current.on('tourComplete', () => setTourComplete(true));
    const { onConnect, onDisconnect, onVideoPaused, onVideoPlayed, onNewMessage, onNewUserJoin, onUserLeave } =
      createEventHandlers(appDispatch, playerDispatch);

    function onConnectFailed() {
      setSocketError('Could not reach server at the moment. It is possible that server is not live to minimize costs');
    }

    function onNewReaction(reaction: ReactionMessage) {
      appDispatch?.({ type: 'new_reaction', payload: { reaction } });
    }
    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectFailed);
    socket.on('disconnect', onDisconnect);
    socket.on('videoPlayed', onVideoPlayed);
    socket.on('videoPaused', onVideoPaused);
    socket.on('newMessage', onNewMessage);
    socket.on('newReaction', onNewReaction);
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
      socket.off('newReaction', onNewReaction);
    };
  }, [playerDispatch, appDispatch, Tour]);

  return (
    <div className={styles.mainContainer}>
      <JoinModal
        loading={isLoading}
        isOpen={showJoinModal}
        onSubmit={handleJoinModalSubmit}
        joinError={joinError}
        socketError={socketError}
      />
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => {
          startTour(tour.current);
          if (tour.current?.currentStep?.id === 'copyLink') {
            tour.current?.next();
          }
          setShowInviteModal(false);
        }}
      />
      <Grid flex={1} minHeight="100vh" templateColumns="repeat(12, 2fr)" gap={0}>
        <GridItem display="flex" colSpan={10} bg="#2C3333">
          <MediaSection openInviteModal={() => setShowInviteModal(true)} tourRef={tour} />
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

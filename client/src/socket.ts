import { Dispatch } from 'react';
import { io } from 'socket.io-client';
import { MessageType, User } from './types';
import { ActionUnion } from './contexts/AppContext';

export const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { path: '/socket' });

export const createEventHandlers = (
  appDispatch: Dispatch<ActionUnion> | undefined,
  playerDispatch: Dispatch<ActionUnion> | undefined,
) => {
  return {
    onConnect: function () {
      if (socket.recovered) {
        console.log('connection recovered');
      }
      appDispatch?.({ type: 'connected' });
    },
    onDisconnect: function () {
      appDispatch?.({ type: 'disconnected' });
    },

    onVideoPlayed: function (data: { id: string; time: number }) {
      console.log('onVideoPlayed');
      playerDispatch?.({ type: 'played' });
      playerDispatch?.({ type: 'update_time', payload: { time: data.time } });
    },

    onVideoPaused: function () {
      playerDispatch?.({ type: 'paused' });
    },

    onNewMessage: (data: MessageType) => {
      appDispatch?.({ type: 'new_message', payload: { message: data } });
    },

    onNewUserJoin: function (user: User) {
      console.log('user join', user);
      appDispatch?.({ type: 'user_join', payload: { user } });
    },

    onUserLeave: function (user: User) {
      console.log('user leave', user);
      appDispatch?.({ type: 'user_leave', payload: { user } });
    },
  };
};

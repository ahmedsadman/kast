import React, { createContext, useReducer, useContext } from 'react';
import { MessageType, Action, Dispatch } from '../types';

export const AppContext = createContext<AppState | null>(null);
export const AppContextDispatch = createContext<Dispatch | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [app, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={app}>
      <AppContextDispatch.Provider value={dispatch}>{children}</AppContextDispatch.Provider>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export function useAppDispatch() {
  return useContext(AppContextDispatch);
}

function appReducer(state: AppState, action: ActionUnion): AppState {
  switch (action.type) {
    case 'connected':
      return { ...state, isConnected: true };

    case 'disconnected':
      return { ...state, isConnected: false };

    case 'update_room_id':
      return { ...state, roomId: (action as UpdateRoomIdAction).payload?.roomId };

    case 'new_message': {
      const messages = [...state.messages];
      const incomingMessage = (action as NewMessageAction).payload?.message;

      if (incomingMessage) {
        messages.push(incomingMessage);
      }

      return {
        ...state,
        messages,
      };
    }

    default:
      return state;
  }
}

const initialState: AppState = {
  isConnected: false,
  roomId: undefined,
  messages: [],
};

type UpdateRoomIdAction = Action<{ roomId: string }>;
type NewMessageAction = Action<{ message: MessageType }>;
type ActionUnion = Action | UpdateRoomIdAction | NewMessageAction;

type AppState = {
  isConnected: boolean;
  roomId: string | undefined;
  messages: MessageType[];
};

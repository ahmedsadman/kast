import React, { createContext, useReducer, useContext } from 'react';
import { MessageType, ReactionMessage, User, Action, Dispatch } from '../types';

export const AppContext = createContext<AppState | undefined>(undefined);
export const AppContextDispatch = createContext<Dispatch | undefined>(undefined);

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

    case 'update_user_id':
      return { ...state, userId: (action as UpdateUserIdAction).payload?.userId };

    case 'user_join': {
      const newUser = (action as UserStatusAction).payload?.user;

      if (!newUser) {
        return state;
      }

      return {
        ...state,
        users: [...state.users, newUser],
      };
    }

    case 'user_leave': {
      const user = (action as UserStatusAction).payload?.user;

      if (!user) {
        return state;
      }

      return {
        ...state,
        users: state.users.filter((_user) => _user.id !== user.id),
      };
    }

    case 'update_users_list': {
      const users = (action as UserListUpdateAction).payload?.users;
      console.log('new update list', users);

      if (!users) {
        return state;
      }

      return {
        ...state,
        users,
      };
    }

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

    case 'new_reaction': {
      const reactions = [...state.reactions];
      const incomingReaction = (action as NewReactionAction).payload?.reaction;

      if (incomingReaction) {
        reactions.push(incomingReaction);
      }

      return {
        ...state,
        reactions,
      };
    }

    case 'remove_reaction': {
      return {
        ...state,
        reactions: state.reactions.filter((reaction) => reaction.id !== (action as RemoveReactionAction).payload?.id),
      };
    }

    default:
      return state;
  }
}

const initialState: AppState = {
  isConnected: false,
  roomId: undefined,
  userId: undefined,
  messages: [],
  reactions: [],
  users: [],
};

type UpdateRoomIdAction = Action<{ roomId: string }>;
type UpdateUserIdAction = Action<{ userId: string }>;
type NewMessageAction = Action<{ message: MessageType }>;
type NewReactionAction = Action<{ reaction: ReactionMessage }>;
type RemoveReactionAction = Action<{ id: string }>;
type UserStatusAction = Action<{ user: User }>;
type UserListUpdateAction = Action<{ users: User[] }>;
export type ActionUnion = Action | UpdateRoomIdAction | NewMessageAction;

type AppState = {
  isConnected: boolean;
  roomId: string | undefined;
  userId: string | undefined;
  messages: MessageType[];
  reactions: ReactionMessage[];
  users: User[];
};

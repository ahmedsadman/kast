import React, { createContext, useReducer, useContext } from 'react';

export const PlayerContext = createContext<PlayerState | null>(null);
export const PlayerContextDispatch = createContext<Dispatch | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, dispatch] = useReducer(playerReducer, initialState);

  return (
    <PlayerContext.Provider value={player}>
      <PlayerContextDispatch.Provider value={dispatch}>{children}</PlayerContextDispatch.Provider>
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}

export function usePlayerDispatch() {
  return useContext(PlayerContextDispatch);
}

function playerReducer(state: PlayerState, action: Action | UpdateTimeAction): PlayerState {
  switch (action.type) {
    case 'paused': {
      return {
        ...state,
        isPlaying: false,
      };
    }
    case 'played': {
      return {
        ...state,
        isPlaying: true,
      };
    }
    case 'update_time': {
      return {
        ...state,
        currentTime: (action as UpdateTimeAction).payload?.time || 0,
      };
    }
    default:
      return state;
  }
}

const initialState: PlayerState = {
  isPlaying: null,
  currentTime: 0,
};

type PlayerState = {
  isPlaying: boolean | null;
  currentTime: number;
};

type Action<T = object> = {
  type: string;
  payload?: T;
};

export type UpdateTimeAction = Action<{ time: number }>;

type Dispatch = (_action: Action) => void;

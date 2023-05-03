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

function playerReducer(state: PlayerState, action: ActionUnion): PlayerState {
  switch (action.type) {
    case 'paused':
      return {
        ...state,
        isPlaying: false,
        lastEventTime: Date.now(),
      };

    case 'played':
      return {
        ...state,
        isPlaying: true,
        lastEventTime: Date.now(),
      };

    case 'update_time':
      return {
        ...state,
        currentTime: (action as UpdateTime).payload?.time || 0,
      };

    case 'update_video_file':
      return {
        ...state,
        videoFileUrl: (action as UpdateFile).payload?.file,
        videoFileName: (action as UpdateFile).payload?.fileName,
      };

    case 'update_subtitle_file':
      return {
        ...state,
        subtitleFile: (action as UpdateFile).payload?.file,
      };

    default:
      return state;
  }
}

const initialState: PlayerState = {
  isPlaying: null,
  currentTime: 0,
  subtitleFile: undefined,
  videoFileName: undefined,
  videoFileUrl: undefined,
  lastEventTime: Date.now(),
};

type PlayerState = {
  isPlaying: boolean | null;
  currentTime: number;
  videoFileUrl: string | undefined;
  videoFileName: string | undefined;
  subtitleFile: string | undefined;
  lastEventTime: number;
};

type Action<T = object> = {
  type: string;
  payload?: T;
};

type UpdateTime = Action<{ time: number }>;
type UpdateFile = Action<{ file: string | undefined; fileName: string | undefined }>;

type ActionUnion = Action | UpdateTime | UpdateFile;

type Dispatch = (_action: Action) => void;

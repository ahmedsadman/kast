// TODO: Try refining this type. Client and server user types are mistmatching
export type User = {
  id: string;
  roomId?: string;
  name: string;
};

export type MessageType = {
  id: string;
  content: string;
  user: User;
  systemMessage: boolean;
};

export type ReactionMessage = {
  id: string;
  emoji: string;
  createdAt: number;
};

export type Action<T = object> = {
  type: string;
  payload?: T;
};

export type Dispatch = (_action: Action) => void;

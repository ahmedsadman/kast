export type User = {
  id: string;
  roomId: string;
  name: string;
};

export type MessageType = {
  id: string;
  content: string;
  user: User;
  systemMessage: boolean;
};

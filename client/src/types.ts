export type User = {
  id: string;
  roomId: string;
  name: string;
};

export type MessageType = {
  id: string;
  content: string;
  name: string;
  systemMessage: boolean;
};

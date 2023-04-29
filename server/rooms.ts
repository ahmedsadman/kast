import { randomUUID } from 'crypto';

class Rooms {
  #roomsMap: RoomsMap;
  #userRoomMap: UserMap;
  /* 
    userId = socket.id
  */
  constructor() {
    this.#roomsMap = {}; // { users: [...{name, id, roomId}], videoURL: ''}
    this.#userRoomMap = {}; // maps socket id to rooms
  }

  createRoom() {
    const id = randomUUID();
    this.#roomsMap[id] = { users: [] };
    return id;
  }

  getRoom(roomId: string) {
    return this.#roomsMap[roomId];
  }

  addUser(roomId: string, name: string, userId: string) {
    this.#roomsMap[roomId]['users'].push({ name, id: userId, roomId });
    this.#userRoomMap[userId] = roomId;
    return { name, id: userId, roomId };
  }

  removeUser(userId: string) {
    const roomId = this.#userRoomMap[userId];
    let _user = null;

    if (roomId) {
      // remove user from the room
      const users = this.#roomsMap[roomId]['users'];
      this.#roomsMap[roomId]['users'] = users.filter((user) => {
        if (user.id === userId) {
          _user = user;
        }
        return user.id !== userId;
      });

      // remove user from the user-room mapping
      delete this.#userRoomMap[userId];

      // remove room if applicable
      this.removeRoom(roomId);

      return _user;
    }

    return null;
  }

  removeRoom(roomId: string) {
    if (this.#roomsMap[roomId]['users'].length === 0) delete this.#roomsMap[roomId];
  }

  getUserList(roomId: string) {
    const room = this.#roomsMap[roomId];
    if (room) {
      return room['users'];
    }
  }

  getUser(userId: string) {
    const room = this.#userRoomMap[userId];
    const users = this.getUserList(room);
    return users?.find((user) => user.id === userId);
  }

  getUserRoom(userId: string) {
    return this.#userRoomMap[userId];
  }
}

export type User = {
  id: string;
  name: string;
  roomId: string;
};

type Room = {
  users: User[];
};

type RoomsMap = {
  [key: string]: Room;
};

type UserMap = {
  [key: string]: string;
};

export default new Rooms();

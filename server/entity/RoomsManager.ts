import { randomUUID } from 'crypto';
import Room from './Room';

class RoomsManager {
  rooms: { [key: string]: Room };
  userRoomsMap: { [key: string]: Room };
  ROOM_KEEP_ALIVE = 5 * 60 * 1000;

  constructor() {
    this.rooms = {};
    this.userRoomsMap = {};

    setInterval(() => {
      this.handleRoomCleanup();
    }, 5000);
  }

  handleRoomCleanup() {
    for (const roomId in this.rooms) {
      if (!this.rooms[roomId].markedForDelete) {
        continue;
      }

      if (Date.now() - (this.rooms[roomId].markedForDelete || 0) > this.ROOM_KEEP_ALIVE) {
        console.log(`Removing room ${roomId} for inactivity`);
        const userIds = this.rooms[roomId].getAssociatedUserIds();

        for (const userId in this.userRoomsMap) {
          if (userIds.includes(userId)) {
            console.log(`Removing user-room association for user ${userId}`);
            delete this.userRoomsMap[userId];
          }
        }

        delete this.rooms[roomId];
        console.log(`Removed room ${roomId}`);
      }
    }
  }

  createRoom() {
    const id = randomUUID();
    const room = new Room(id);
    this.rooms[id] = room;
    console.log(`Created new room ${room.id}`);
    return room;
  }

  getRoom(roomId: string) {
    return this.rooms[roomId];
  }

  getRoomByUser(userId: string) {
    return this.userRoomsMap[userId];
  }

  addUserRoomAssociation(userId: string, room: Room) {
    this.userRoomsMap[userId] = room;
  }
}

export default new RoomsManager();

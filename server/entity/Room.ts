import { User } from './User';
import roomsManager from './RoomsManager';

class Room {
  id: string;
  users: { [key: string]: User };
  markedForDelete: number | null;

  constructor(id: string) {
    this.id = id;
    this.users = {};
    this.markedForDelete = null;
  }

  findUserById(userId: string) {
    return this.users[userId];
  }

  connectUser(userId: string, name?: string) {
    const existingUser = this.findUserById(userId);

    // TODO: Improve code
    if (existingUser) {
      existingUser.setActive();
      this.markedForDelete = null;
      console.log(`Existing user ${existingUser.id} found, restoring`);
      roomsManager.addUserRoomAssociation(userId, this);
      return existingUser;
    }

    const user = new User(userId, name || 'unnamed');
    this.users[userId] = user;

    this.markedForDelete = null;
    roomsManager.addUserRoomAssociation(userId, this);
    console.log(`Created new user ${user.id}`);
    return user;
  }

  disconnectUser(userId: string) {
    const userToRemove = this.findUserById(userId);

    if (userToRemove) {
      console.log(`Disconnecting user ${userToRemove.id}`);
      userToRemove.setInactive();
    }

    this.checkMarkForDelete();
  }

  getAssociatedUserIds() {
    return Object.keys(this.users);
  }

  getActiveUsers() {
    const allUsers = Object.values(this.users);
    return allUsers.filter((user) => Boolean(user.isActive));
  }

  checkMarkForDelete() {
    let shouldMark = true;

    for (const userId in this.users) {
      if (this.users[userId].isActive) {
        shouldMark = false;
        break;
      }
    }

    if (shouldMark) {
      console.log(`Marked room ${this.id} for deletion`);
      this.markedForDelete = Date.now();
    }
  }
}

export default Room;

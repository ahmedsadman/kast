import { Server, Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import roomsManager from './entity/RoomsManager';
import type { User } from './entity/User';
import type Room from './entity/Room';

class EventsHandler {
  #io: Server | null = null;

  constructor(io: Server) {
    this.#io = io;
  }

  registerEvents() {
    this.#io?.on('connection', (socket: Socket) => {
      console.log('user connected', socket.id);

      this.#registerUserJoin(socket);
      this.#registerUserDisconnect(socket);
      this.#registerPlayerEvents(socket);
      this.#registerChatEvents(socket);
      this.#registerReactionEvents(socket);

      if (socket.recovered) {
        const room = roomsManager.getRoomByUser(socket.id);
        const user = room.findUserById(socket.id);
        this.#announceUserJoin(room, user);
      }
    });
  }

  #announceUserJoin(room: Room, user: User) {
    this.#io?.to(room.id).emit('roomUserJoin', {
      id: user.id,
      roomId: room.id,
      name: user.name,
    });

    this.#io?.to(room.id).emit('newMessage', this.#generateChatMessage(user, `${user.name} joined the room`, true));
  }

  #registerUserJoin(socket: Socket) {
    socket.on('join', (data) => {
      try {
        console.log('joining user', data);
        const { roomId, name } = data;
        const room = roomId ? roomsManager.getRoom(roomId) : roomsManager.createRoom();

        socket.join(room.id);

        const newUser = room.connectUser(socket.id, name);
        this.#announceUserJoin(room, newUser);
      } catch (err) {
        console.log(`Failed to join user: ${err}`);
      }
    });
  }

  #registerUserDisconnect(socket: Socket) {
    socket.on('disconnect', () => {
      try {
        console.log('user disconnected', socket.id);
        const room = roomsManager.getRoomByUser(socket.id);
        const user = room.findUserById(socket.id);

        if (!room) {
          return;
        }

        this.#io?.to(room.id).emit('roomUserLeave', {
          id: user.id,
          roomId: room.id,
          name: user.name,
        });

        this.#io?.to(room.id).emit('newMessage', this.#generateChatMessage(user, `${user.name} left the room`, true));
        room.disconnectUser(socket.id);
      } catch (err) {
        console.log(`Failed to disconnect user: ${err}`);
      }
    });
  }

  #registerPlayerEvents(socket: Socket) {
    socket.on('videoPlayed', (data) => {
      const room = roomsManager.getRoomByUser(socket.id);
      const user = room.findUserById(socket.id);

      if (!room) {
        return;
      }

      socket.to(room.id).emit('videoPlayed', { id: socket.id, time: data.time });
      this.#io?.to(room.id).emit('newMessage', this.#generateChatMessage(user, 'Video started playing', true));
    });

    socket.on('videoPaused', () => {
      const room = roomsManager.getRoomByUser(socket.id);
      const user = room.findUserById(socket.id);

      if (!room) {
        return;
      }

      socket.to(room.id).emit('videoPaused', { id: socket.id });
      this.#io?.to(room.id).emit('newMessage', this.#generateChatMessage(user, 'Video paused', true));
    });
  }

  // TODO: Does not belong here. Should move to a utility function
  #generateChatMessage(user: User, content: string, systemMessage = false) {
    return {
      id: randomUUID(),
      user,
      content,
      systemMessage,
    };
  }

  // TODO: Does not belong here. Should move to a utility function
  #generateReactionMessage(user: User, emoji: string) {
    const id = `${user.id}-${Date.now()}`;
    return {
      id,
      emoji,
      createdAt: Date.now(),
    };
  }

  #registerChatEvents(socket: Socket) {
    socket.on('newMessage', (data) => {
      // TODO: Maybe extract as roomManager.getUser?
      const room = roomsManager.getRoomByUser(socket.id);
      const user = room.findUserById(socket.id);
      const { content } = data;

      if (!user) {
        return;
      }

      this.#io?.to(room.id).emit('newMessage', this.#generateChatMessage(user, content));
    });
  }

  #registerReactionEvents(socket: Socket) {
    socket.on('newReaction', (data) => {
      const room = roomsManager.getRoomByUser(socket.id);
      const user = room.findUserById(socket.id);
      const { emoji } = data;

      this.#io?.to(room.id).emit('newReaction', this.#generateReactionMessage(user, emoji));
    });
  }
}

export default EventsHandler;

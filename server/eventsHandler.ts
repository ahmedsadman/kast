import { Server, Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import roomsManager from './entity/RoomsManager';
import type { User } from './entity/User';

class EventsHandler {
  #io: Server | null = null;

  constructor(io: Server) {
    this.#io = io;
  }

  registerEvents() {
    this.#io?.on('connection', (socket: Socket) => {
      if (socket.recovered) {
        console.log('recovered connection', socket.id);
      }
      console.log('user connected', socket.id);
      this.#registerUserJoin(socket);
      this.#registerUserDisconnect(socket);
      this.#registerPlayerEvents(socket);
      this.#registerChatEvents(socket);
    });
  }

  #registerUserJoin(socket: Socket) {
    socket.on('join', (data) => {
      console.log('joining user', data);
      const { roomId, name } = data;
      const room = roomId ? roomsManager.getRoom(roomId) : roomsManager.createRoom();

      socket.join(room.id);

      const newUser = room.connectUser(socket.id, name);

      this.#io?.to(room.id).emit('roomUserJoin', {
        id: socket.id,
        roomId,
        name,
      });

      this.#io?.to(room.id).emit('newMessage', this.#generateChatMessage(newUser, `${name} joined the room`, true));
    });
  }

  #registerUserDisconnect(socket: Socket) {
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
      const room = roomsManager.getRoomByUser(socket.id);
      const user = room.findUserById(socket.id);

      if (!room) {
        return;
      }

      this.#io?.to(room.id).emit('newMessage', this.#generateChatMessage(user, `${user.name} left the room`, true));
      room.disconnectUser(socket.id);
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

  #generateChatMessage(user: User, content: string, systemMessage = false) {
    return {
      id: randomUUID(),
      user,
      content,
      systemMessage,
    };
  }

  #registerChatEvents(socket: Socket) {
    socket.on('newMessage', (data) => {
      const room = roomsManager.getRoomByUser(socket.id);
      const user = room.findUserById(socket.id);
      const { content } = data;

      if (!user) {
        return;
      }

      this.#io?.to(room.id).emit('newMessage', this.#generateChatMessage(user, content));
    });
  }
}

export default EventsHandler;

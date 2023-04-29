import { Server, Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import rooms, { User } from './rooms';

class EventsHandler {
  #io: Server | null = null;

  constructor(io: Server) {
    this.#io = io;
  }

  registerEvents() {
    this.#io?.on('connection', (socket: Socket) => {
      if (socket.recovered) {
        console.log('recovered connection', socket.id);
        return this.#handleRecoveredConnection(socket);
      }
      console.log('user connected', socket.id);
      this.#registerUserJoin(socket);
      this.#registerUserDisconnect(socket);
      this.#registerPlayerEvents(socket);
      this.#registerChatEvents(socket);
    });
  }

  #handleRecoveredConnection(socket: Socket) {
    const user = rooms.getUser(socket.id);
    console.log('found recovered user', user);
  }

  #registerUserJoin(socket: Socket) {
    socket.on('join', (data) => {
      console.log('joining user', data);
      const { roomId, name } = data;
      const finalRoomId = roomId || rooms.createRoom();

      socket.join(finalRoomId);

      const newUser = rooms.addUser(finalRoomId, name, socket.id);

      this.#io?.to(finalRoomId).emit('roomUserJoin', {
        id: socket.id,
        roomId,
        name,
      });

      this.#io?.to(finalRoomId).emit('newMessage', this.#generateChatMessage(newUser, `${name} joined the room`, true));
    });
  }

  #registerUserDisconnect(socket: Socket) {
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
      const user = rooms.getUser(socket.id);

      if (!user) {
        return;
      }

      this.#io?.to(user.roomId).emit('newMessage', this.#generateChatMessage(user, `${user.name} left the room`, true));
      rooms.removeUser(socket.id);
    });
  }

  #registerPlayerEvents(socket: Socket) {
    socket.on('videoPlayed', (data) => {
      const user = rooms.getUser(socket.id);

      if (!user) {
        return;
      }

      socket.to(user.roomId).emit('videoPlayed', { id: socket.id, time: data.time });
      this.#io?.to(user.roomId).emit('newMessage', this.#generateChatMessage(user, 'Video started playing', true));
    });

    socket.on('videoPaused', () => {
      const user = rooms.getUser(socket.id);

      if (!user) {
        return;
      }

      socket.to(user.roomId).emit('videoPaused', { id: socket.id });
      this.#io?.to(user.roomId).emit('newMessage', this.#generateChatMessage(user, 'Video paused', true));
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
      const user = rooms.getUser(socket.id);
      const { content } = data;

      if (!user) {
        return;
      }

      this.#io?.to(user.roomId).emit('newMessage', this.#generateChatMessage(user, content));
    });
  }
}

export default EventsHandler;

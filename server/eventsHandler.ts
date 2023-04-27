import { Server, Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import rooms from './rooms';

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

      rooms.addUser(finalRoomId, name, socket.id);

      this.#io?.to(finalRoomId).emit('roomUserJoin', {
        id: socket.id,
        roomId,
        name,
      });
    });
  }

  #registerUserDisconnect(socket: Socket) {
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
      rooms.removeUser(socket.id);
    });
  }

  #registerPlayerEvents(socket: Socket) {
    socket.on('videoPlayed', (data) => {
      const userRoom = rooms.getUserRoom(socket.id);
      socket.to(userRoom).emit('videoPlayed', { id: socket.id, time: data.time });
    });

    socket.on('videoPaused', () => {
      const userRoom = rooms.getUserRoom(socket.id);
      socket.to(userRoom).emit('videoPaused', { id: socket.id });
    });
  }

  #registerChatEvents(socket: Socket) {
    socket.on('newMessage', (data) => {
      const user = rooms.getUser(socket.id);
      const { content } = data;

      if (!user) {
        return;
      }

      this.#io?.to(user.roomId).emit('newMessage', {
        id: randomUUID(),
        name: user.name,
        content,
      });
    });
  }
}

export default EventsHandler;

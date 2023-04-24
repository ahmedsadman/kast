import { Server, Socket } from 'socket.io';
import rooms from './rooms';

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
    });
  }

  #registerUserJoin(socket: Socket) {
    socket.on('join', (data) => {
      console.log('joining user', data);
      const { roomId, name } = data;
      socket.join(roomId);

      rooms.addRoom(roomId);
      rooms.addUser(roomId, name, socket.id);

      this.#io?.to(roomId).emit('roomUserJoin', {
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
      this.#io?.to(userRoom).emit('videoPlayed', { id: socket.id, time: data.time });
    });

    socket.on('videoPaused', () => {
      const userRoom = rooms.getUserRoom(socket.id);
      this.#io?.to(userRoom).emit('videoPaused', { id: socket.id });
    });
  }
}

export default EventsHandler;

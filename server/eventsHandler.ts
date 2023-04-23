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
    });
  }

  #registerUserJoin(socket: Socket) {
    socket.on('join', (data) => {
      console.log('joining user', data);
      const { roomId, name } = data;
      socket.join(roomId);

      rooms.addRoom(roomId);
      rooms.addUser(roomId, name, socket.id);

      socket.to(roomId).emit('roomUserJoin', {
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
}

export default EventsHandler;

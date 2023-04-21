import { Server, Socket } from 'socket.io';

class EventsHandler {
  #io: Server | null = null;

  constructor(io: Server) {
    this.#io = io;
  }

  registerEvents() {
    this.#io?.on('connection', (socket: Socket) => {
      console.log('user connected', socket.id);
      this.#registerUserJoin(socket);
    });
  }

  #registerUserJoin(socket: Socket) {
    socket.on('userJoin', (data) => {
      console.log('joining user', data);
    });
  }
}

export default EventsHandler;

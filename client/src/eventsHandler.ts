import { io, Socket } from 'socket.io-client';

class EventsHandler {
  #socket: Socket | null = null;

  connect() {
    return new Promise((resolve) => {
      const socket = io('http://localhost:3005', { path: '/socket' });

      socket.on('connect', () => {
        console.log('connected', socket.id);
        this.#socket = socket;
        resolve(this);
      });
    });
  }
}

export default EventsHandler;

import { io, Socket } from 'socket.io-client';

class EventsHandler {
  #socket: Socket | null = null;
  #isConnecting = false;

  connect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.#isConnecting) {
        return resolve();
      }

      if (this.#socket?.id) {
        console.log('Already connected');
        return resolve();
      }

      this.#isConnecting = true;
      const _socket = io('http://localhost:3005', { path: '/socket' });

      _socket.on('connect', () => {
        console.log('connected', this.#socket?.id);
        this.#socket = _socket;
        this.#isConnecting = false;
        resolve();
      });
    });
  }

  emitJoin(roomId = null) {
    console.log('emit join');
    this.#socket?.emit('userJoin', {
      roomId: roomId || this.#socket.id,
    });
    return this;
  }
}

export default new EventsHandler();

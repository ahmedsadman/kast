import { io, Socket } from 'socket.io-client';

class EventsHandler {
  #socket: Socket | null = null;
  #isConnecting = false;

  connect(): Promise<string | undefined> {
    return new Promise((resolve) => {
      if (this.#isConnecting) {
        return resolve(undefined);
      }

      if (this.#socket?.id) {
        console.log('Already connected');
        return resolve(undefined);
      }

      this.#isConnecting = true;
      const _socket = io('http://localhost:3005', { path: '/socket' });

      _socket.on('connect', () => {
        this.#socket = _socket;
        this.#isConnecting = false;
        this.#registerEvents();
        resolve(this.#socket.id);
      });
    });
  }

  #registerEvents() {
    this.#socket?.on('roomUserJoin', (data) => {
      console.log('new user joined', data.id);
    });
  }

  emitJoin(name: string, roomId: string | null = null) {
    this.#socket?.emit('join', {
      roomId: roomId || this.#socket.id,
      name,
    });
    return this;
  }
}

export default new EventsHandler();

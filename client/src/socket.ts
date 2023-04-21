import { io } from 'socket.io-client';

export function createConnection() {
  return new Promise((resolve) => {
    const socket = io('http://localhost:3005', { path: '/socket' });

    socket.on('connect', () => {
      console.log('connected', socket.id);
      resolve(socket);
    });
  });
}

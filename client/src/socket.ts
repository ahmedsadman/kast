import { io } from 'socket.io-client';

export const socket = io('http://localhost:3005', { path: '/socket' });

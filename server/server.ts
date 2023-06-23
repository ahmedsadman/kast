import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import roomsManager from './entity/RoomsManager';

import EventsHandler from './eventsHandler';

const PORT = process.env.PORT || 3005;

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  path: '/socket',
  cors: {
    origin: ['https://mykast.netlify.app', 'http://127.0.0.1:5173', 'http://localhost:5173'],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

app.get('/status', (_req, res) => {
  res.send({ status: 'OK' });
});

app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const room = roomsManager.getRoomByUser(userId);

  const user = room.findUserById(userId);
  res.send({ user: { ...user, roomId: room.id } });
});

app.get('/room/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const room = roomsManager.getRoom(roomId);
  res.send({ room, found: !!room });
});

const eventsHandler = new EventsHandler(io);
eventsHandler.registerEvents();

server.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

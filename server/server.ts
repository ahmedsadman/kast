import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rooms from './rooms';

import EventsHander from './eventsHandler';

const PORT = process.env.PORT || 3005;

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  path: '/socket',
  cors: {
    origin: ['http://127.0.0.1:1420', 'http://localhost:1420'],
  },
  serveClient: false,
});

app.get('/status', (_req, res) => {
  res.send({ status: 'OK' });
});

app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = rooms.getUser(userId);
  res.send({ user });
});

const eventsHandler = new EventsHander(io);
eventsHandler.registerEvents();

server.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
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
  let callCount = 0;

  const userPromise = new Promise((resolve) => {
    /* When a new user requests info of itself instantly after joining, 
    room might not be assigned. Thus, the waiting.
    There are better ways of doing this, like breaking down the socket events. But
    let's skip those for now

    TODO: Explore cleaner options like breaking down socket events (joinRequestInit, joinRequestComplete)
    */
    const interval = setInterval(() => {
      console.log('assigned room interval check...');
      const user = rooms.getUser(userId);

      if (callCount === 20) {
        clearInterval(interval);
        resolve(null);
      }

      if (user) {
        clearInterval(interval);
        resolve(user);
      }

      callCount += 1;
    }, 200);
  });

  const user = await userPromise;
  res.send({ user });
});

const eventsHandler = new EventsHander(io);
eventsHandler.registerEvents();

server.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

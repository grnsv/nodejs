import { workerData, parentPort } from 'worker_threads';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';

const { host, port } = workerData;

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'lessons/lesson-6/Messenger/index.html');
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server);

io.on('connection', (socket) => {
  // eslint-disable-next-line no-param-reassign
  socket.data.username = `User ${socket.id.substring(0, 3)}`;

  socket.broadcast.emit('server-msg', { user: socket.data.username, msg: 'connected' });
  socket.broadcast.emit('update-online', { usersOnline: io.engine.clientsCount });
  socket.emit('update-online', { usersOnline: io.engine.clientsCount });

  socket.on('disconnect', () => {
    socket.broadcast.emit('server-msg', { user: socket.data.username, msg: 'disconnected' });
    socket.broadcast.emit('update-online', { usersOnline: io.engine.clientsCount });
    socket.emit('update-online', { usersOnline: io.engine.clientsCount });
  });
  socket.on('client-msg', (data) => {
    socket.broadcast.emit('server-msg', { user: socket.data.username, msg: data.msg });
    socket.emit('server-msg', { user: socket.data.username, msg: data.msg });
  });
});

server.listen(port, host, () => parentPort.postMessage(`Chat server running at http://${host}:${port}`));

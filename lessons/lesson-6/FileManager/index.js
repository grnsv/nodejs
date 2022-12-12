import { workerData, parentPort } from 'worker_threads';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';

const { host, port } = workerData;

const fsp = fs.promises;

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'lessons/lesson-6/FileManager/index.html');
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server);

io.on('connection', (socket) => {
  socket.broadcast.emit('update-online', { usersOnline: io.engine.clientsCount });
  socket.emit('update-online', { usersOnline: io.engine.clientsCount });

  socket.on('disconnect', () => {
    socket.broadcast.emit('update-online', { usersOnline: io.engine.clientsCount });
  });

  socket.on('click-link', (data) => {
    const curPath = path.join(process.cwd(), data.link);

    fs.stat(curPath, (err, stats) => {
      if (!err) {
        if (stats.isFile(curPath)) {
          const rs = fs.createReadStream(curPath, 'utf-8');
          let file = '';
          rs.on('data', (chunk) => {
            file += chunk;
          });
          rs.on('end', () => socket.emit('update-file', { file }));
        } else {
          fsp
            .readdir(curPath)
            .then((files) => {
              if (data.link !== '/') files.unshift('..');
              return files;
            })
            .then((files) => {
              socket.emit('update-links', { links: files });
            });
        }
      }
    });
  });
});

server.listen(port, host, () => parentPort.postMessage(`File server running at http://${host}:${port}`));

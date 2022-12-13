import { Worker } from 'worker_threads';

function lesson6() {
  const host = 'node';

  const workers = new Map([
    [3000, './lessons/lesson-6/FileManager/index.js'],
    [3001, './lessons/lesson-6/Messenger/index.js'],
  ]);

  workers.forEach((worker, port) => {
    const workerData = { host, port };
    new Worker(worker, { workerData }).on('message', (msg) => process.stdout.write(`${msg}\n`));
  });
}

export default lesson6;

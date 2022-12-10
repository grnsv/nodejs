import fs from 'fs';
import readline from 'readline';

function lesson3() {
  const readStream = fs.createReadStream('logs/access_tmp.log', 'utf-8');

  const ips = ['89.123.1.41', '34.48.240.111'];

  const writeStreams = new Map(ips.map(
    (ip) => [ip, fs.createWriteStream(`logs/${ip}_requests.log`)],
  ));

  const rl = readline.createInterface({
    input: readStream,
    terminal: true,
  });

  rl.on('line', (line) => {
    writeStreams.forEach((writeStream, ip) => {
      if (line.includes(ip)) {
        writeStream.write(`${line}\n`);
      }
    });
  });
}

export default lesson3;

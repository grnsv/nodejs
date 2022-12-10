import http from 'http';
import fs from 'fs';
import path from 'path';
import { Transform } from 'stream';
import { stdout } from 'process';

function lesson5() {
  const host = 'node';
  const port = 3000;

  const fsp = fs.promises;

  const links = (arr, curUrl) => {
    const url = (curUrl.endsWith('/')) ? curUrl.substring(0, curUrl.length - 1) : curUrl;
    return arr.reduce((result, item) => `${result}<li><a href="${url}/${item}">${item}</a></li>`, '');
  };

  const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
      const url = req.url.split('?')[0];
      const curPath = path.join(process.cwd(), url);

      fs.stat(curPath, (err, stats) => {
        if (!err) {
          if (stats.isFile(curPath)) {
            const rs = fs.createReadStream(curPath, 'utf-8');
            rs.pipe(res);
          } else {
            fsp
              .readdir(curPath)
              .then((files) => {
                if (url !== '/') files.unshift('..');
                return files;
              })
              .then((data) => {
                // render
                const filePath = path.join(process.cwd(), 'lessons/lesson-5/index.html');
                const rs = fs.createReadStream(filePath);
                const ts = new Transform({
                  transform(chunk, encoding, callback) {
                    const li = links(data, url);
                    this.push(chunk.toString().replace('#filelinks#', li));

                    callback();
                  },
                });

                rs.pipe(ts).pipe(res);
              });
          }
        } else {
          res.end('Path not exists');
        }
      });
    }
  });

  server.listen(port, host, () => stdout.write(`Server running at http://${host}:${port}`));
}

export default lesson5;

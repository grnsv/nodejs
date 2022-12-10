import readline from 'readline';
import colors from 'colors';
import path from 'path';
import inquirer from 'inquirer';
import fsp from 'fs/promises';

function lesson4() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const root = process.cwd();

  const findFilesInDir = (dirName) => fsp
    .readdir(dirName)
    .then((choices) => inquirer.prompt({
      name: 'fileName',
      type: 'list', // input, number, confirm, list, rawlist, expand, checkbox, password
      message: 'Choose file',
      choices,
    }))
    .then(async ({ fileName }) => {
      const fullPath = path.join(dirName, fileName);
      const stat = await fsp.stat(fullPath);
      if (!stat.isFile()) {
        return findFilesInDir(fullPath);
      }
      return Promise.resolve(fileName);
    })
    .then(async (fileName) => Promise.all([
      fsp.readFile(path.join(dirName, fileName), 'utf-8'),
      inquirer.prompt({
        name: 'findString',
        type: 'input',
        message: 'Enter something for search',
      }),
    ]))
    .then((result) => {
      if (result) {
        const [text, { findString }] = result;
        const pattern = new RegExp(findString, 'g');
        let count = 0;
        const out = text.replace(pattern, () => {
          count += 1;
          return colors.red(findString);
        });

        rl.write(out);
        rl.write('\n');
        rl.write(colors.green(`Found ${count} values`));
        rl.write('\n');
      }
    });

  rl.question(
    `You are in: ${root} \n Please enter the path to the directory: `,
    (dirPath) => {
      const dirName = path.join(root, dirPath);

      findFilesInDir(dirName);
    },
  );

  rl.on('close', () => process.exit(0));
}

export default lesson4;

import { stdout } from 'node:process';
import colors from 'colors';

class Handler {
  static checkTimers(timers, intervalId) {
    Handler.clear(timers.length);

    if (
      timers.reduce((result, timer) => {
        stdout.write(colors.green(`${timer.getMessage()}\n`));
        return result && timer.expired;
      }, true)
    ) {
      clearInterval(intervalId);
    }
  }

  static clear(count) {
    stdout.moveCursor(0, -count);
    stdout.clearScreenDown();
  }

  static error(e) {
    stdout.write(colors.red(`${e.toString()}\n`));
  }
}

export default Handler;

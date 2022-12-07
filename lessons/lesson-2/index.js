import EventEmitter from 'events';
import Handler from './Handler.js';
import Timer from './Timer.js';
import Validator from './Validator.js';

function lesson2() {
  const args = process.argv.splice(2);

  const emitter = new EventEmitter();

  emitter.on('checkTimers', Handler.checkTimers);
  emitter.on('error', Handler.error);

  const validator = new Validator(args);

  try {
    validator.validate();
  } catch (e) {
    emitter.emit('error', e);
    return;
  }

  const timers = validator.validated().map((date, index) => new Timer(date, index));

  const intervalId = setInterval(() => emitter.emit('checkTimers', timers, intervalId), 1000);
}

export default lesson2;

class Timer {
  constructor(date, id) {
    this.date = date;
    this.id = id;
    this.checkExpired();
  }

  checkExpired() {
    this.expired = Date.now() > this.date;
    return this.expired;
  }

  getMessage() {
    if (this.checkExpired()) {
      return `${this.id} (${this.formatDate()}): Timer expired`;
    }
    return `${this.id} (${this.formatDate()}): Timer running, remaining time ${this.getRemainingTime()}`;
  }

  formatDate() {
    return (new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Moscow',
    }).format(this.date));
  }

  getRemainingTime() {
    const diff = this.date - new Date();

    let sec = Math.floor(diff / 1000);
    if (sec < 60) {
      return `${sec} seconds`;
    }

    let min = Math.floor(diff / 1000 / 60);
    sec -= min * 60;
    if (min < 60) {
      return `${min} minutes and ${sec} seconds`;
    }

    let hours = Math.floor(diff / 1000 / 60 / 60);
    min -= hours * 60;
    if (hours < 24) {
      return `${hours} hours, ${min} minutes and ${sec} seconds`;
    }

    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    hours -= days * 24;
    return `${days} days, ${hours} hours, ${min} minutes and ${sec} seconds`;
  }
}

export default Timer;

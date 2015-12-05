const MESSAGE_TYPE = 'message';

export default class MessageHandler {
  constructor(pattern, callback) {
    this.pattern = pattern;
    this.callback = callback;
  }

  run(message) {
    if (message.hidden) return;

    const match = message.text.match(this.pattern);

    if (match) {
      this.callback({match, message});
    }
  }
}

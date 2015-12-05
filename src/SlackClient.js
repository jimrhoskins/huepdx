import Slack from 'slack-client';
import MessageHandler from './MessageHandler';

export default class SlackClient {
  constructor(SLACK_TOKEN) {
    this.slack = new Slack(SLACK_TOKEN, true, true);
    this.slack.on('open', this.handleOpen.bind(this));
    this.slack.on('message', this.handleMessage.bind(this));
    this.slack.on('error', this.handleError.bind(this));

    this.handlers = [];
  }

  login() {
    this.slack.login();
  }

  register(pattern, callback) {
    this.handlers.push(new MessageHandler(pattern, callback));
  }

  handleOpen(message) {
    let channels = Object.values(this.slack.channels)
          .filter(channel => channel.is_member)
          .map(channel => channel.name);
    console.log(channels);
  }

  handleMessage(message) {
    this.handlers.forEach(handler => handler.run(message));
  }

  handleError(error) {
    console.log(err);
  }
}

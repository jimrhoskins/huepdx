import HueClient from './HueClient';
import SlackClient from './SlackClient';

const {
  SLACK_TOKEN,
  HUE_IP,
  HUE_USERNAME
} = process.env;


const hue = new HueClient(HUE_IP, HUE_USERNAME);
const client = new SlackClient(SLACK_TOKEN);


client.register(/light (\d+) (.+)/, ({match, message}) => {
  const light = match[1];
  const state = match[2];

  const on = state == "on";

  hue.setLight(light, {on});
  console.log('Light called',  match);
});

client.login();

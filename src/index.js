import { HueApi, lightState } from 'node-hue-api';
import SlackClient from './SlackClient';

const {
  SLACK_TOKEN,
  HUE_IP,
  HUE_USERNAME
} = process.env;

const hue = new HueApi(HUE_IP, HUE_USERNAME);
const client = new SlackClient(SLACK_TOKEN);

client.register(/light (\d+|\*) (on|off)/, ([light, state]) => {
  const s = lightState.create();
  if (state === 'on') {
    s.on();
  } else {
    s.off();
  }

  // Change all lights:
  if (light === '*') {
    hue.lights().then(({ lights }) => {
      lights.forEach(({ id }) => {
        hue.setLightState(id, s);
      })
    });
  } else {
    hue.setLightState(light, s);
  }
});

client.register(/light (\d+|\*) strobe/, ([light]) => {
  const state = lightState.create().longAlert();
  if (light === '*') {
    hue.lights().then(({ lights }) => {
      lights.forEach(({ id }) => {
        hue.setLightState(id, state);
      })
    });
  } else {
    hue.setLightState(light, state);
  }
});

client.login();

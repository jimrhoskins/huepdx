import { HueApi, lightState } from 'node-hue-api';
import SlackClient from './SlackClient';
import Color from 'color'

const {
  SLACK_TOKEN,
  HUE_IP,
  HUE_USERNAME
} = process.env;

const hue = new HueApi(HUE_IP, HUE_USERNAME);
const client = new SlackClient(SLACK_TOKEN);

const buildLightState = (stateString) => {
  const state = lightState.create();
  stateString.toLowerCase().split(/\s+/).forEach((command) => {
    let match;

    // on|off
    if (match = command.match(/(on|off)/)) {
      state.on(match[1] == 'on');
    }

    // 0% to 100%
    if (match = command.match(/(\d+)%/)) {
      state.bri(2.55 * Math.min(100, Math.max(0, parseInt(match[1], 10))));
    }

    // #RRGGBB
    if (match = command.match(/(#[a-f0-9]{6})/)) {
      state.rgb(Color(match[1]).rgbArray());
    }
  });
  return state;
}

client.register(/light (\d+|\*) (.*)/, ([light, stateString]) => {
  const s = buildLightState(stateString);

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

import request from 'request';

export default class HueClient {
  constructor(ip, username) {
    this.ip = ip;
    this.username = username;
  }

  request(method, path, payload) {
    return request({
      method,
      uri: `http://${this.ip}/api/${this.username}${path}`,
      json: !!payload,
      body: payload
    });
  }

  setLight(lightID, state) {
    return this.request('PUT', `/lights/${lightID}/state`, state);
  }
}

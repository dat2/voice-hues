import Reactotron from 'reactotron';
import { create } from 'apisauce';

import DeviceInfo from 'react-native-device-info';
const DEVICE_NAME = DeviceInfo.getDeviceName().substr(0, 20);

const UPNP_URL = 'https://www.meethue.com/api/nupnp';

// discover the bridges
export function discover() {
  return fetch(UPNP_URL).then(res => res.json());
}

// create an api from the bridge url
export function createApi(ipaddress) {
  const api = create({
    baseURL: `http://${ipaddress}`,
    headers: {}
  });

  if(__DEV__) {
    api.addMonitor(Reactotron.apiLog);
  }

  return api;
}

export function getConfig(ipaddress) {
  const api = createApi(ipaddress);

  return api.get('/api/config')
    .then(result => result.data);
}

export function createUser(api) {
  return api.post('/api', { devicetype: 'VOICE_HUES#' + DEVICE_NAME })
    .then(result => {
      const response = result.data[0];
      if(response.error) {
        throw new Error(response.error.description);
      } else {
        return response.success;
      }
    });
}

export function turnLightOn(api, username, { id, on }) {
  return api.put(`/api/${username}/lights/${id}/state`, { on });
}

import Reactotron from 'reactotron';
import { create } from 'apisauce';

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

export function askForPermission(api) {

}

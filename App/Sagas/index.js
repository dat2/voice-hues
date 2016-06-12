import PhilipsSaga from './PhilipsSaga';
import VoiceSaga from './VoiceSaga';

export default function* root() {
  yield [
    PhilipsSaga(),
    VoiceSaga()
  ];
}

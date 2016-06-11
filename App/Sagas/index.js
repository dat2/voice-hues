import PhilipsSaga from './PhilipsSaga';

export default function* root() {
  yield [
    PhilipsSaga()
  ];
}

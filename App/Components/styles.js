import { StyleSheet, Dimensions } from 'react-native';
import cairn, { compose, variables } from 'cairn';

const { width, height } = Dimensions.get('window');

const vars = variables({
  // dimensions
  hairline: StyleSheet.hairlineWidth,
  navbarHeight: 50,
  appWidth: width,
  appHeight: height,

  // colours
  background: 'white',
  text: 'black',
  grey: '#ddd'
});

export default cairn(
  {
    background: {
      backgroundColor: '$background'
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    centeredText: {
      textAlign: 'center'
    }
  },

  // style transformers
  compose(
    vars,
    (styles) => StyleSheet.create(styles)
  ),

  // prop transformers
  vars
);

import { StyleSheet, Dimensions } from 'react-native';
import cairn, { compose, variables } from 'cairn';

const { width, height } = Dimensions.get('window');

const vars = variables({
  // dimensions
  hairline: StyleSheet.hairlineWidth,
  navbarHeight: 50,
  appWidth: width,
  appHeight: height,

  text: 'black',
  lightText: 'grey',

  // colours
  white: 'white',
  darkGrey: '#222',
  grey: '#e5e5e5'
});

export default cairn(
  {
    background: {
      backgroundColor: '$white'
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

import { Platform } from 'react-native';
import { em } from '../constants/em'

export default {
  text: {
    default: {
      fontSize: 15*em, color: '#313131'
    },
    title: {
      fontSize: 22*em, color: '#313131', fontWeight: 'bold'
    },
    defaultWhite: {
      fontSize: 15*em, color: '#fff'
    },
    titleWhite: {
      fontSize: 22*em, color: '#fff', fontWeight: 'bold'
    }
  },
  shadow: Platform.select({
    ios: {
      shadowColor: "#000000",
      backgroundColor: '#ffffff00',
      shadowOffset: { width: 1, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
    android: {
      elevation: 3,
    }
  }),
}
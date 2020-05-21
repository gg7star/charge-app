import { Dimensions, Platform } from 'react-native'

export const W = Dimensions.get('window').width;
export const H = Dimensions.get('window').height;
const rate = Platform.OS === 'ios' ? 375 : 375;
export const em = Dimensions.get('window').width/rate;

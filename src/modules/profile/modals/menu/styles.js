import { W, H, em, colors } from '~/common/constants';

export default {
  logoImage: {
    height: 75*em,
    width: 76*em,
    marginBottom: 12*em
  },
  titleImageContainer: {
    alignItems: 'center', justifyContent: 'center'
  },
  titleImage: {
    width: 79*em, height: 18*em, marginBottom: 25*em
  },
  displayName: { 
    fontSize: 25,
    color: colors.primary,
    fontWeight: '600',
    marginVertical: 15,
    marginLeft: 5
  }
}
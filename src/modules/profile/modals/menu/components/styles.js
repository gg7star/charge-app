import { W, H, em, colors } from '~/common/constants';

export default {
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingVertical: 15,
  },
  titleContainer: {
    marginRight: 10, flexDirection: 'row'
  },
  rightImage: {
    width: 20*em,
    marginRight: 5,
    marginLeft: 5,
    resizeMode: 'contain',
    tintColor: colors.primary
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    paddingLeft: 15
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '300'
  }
}
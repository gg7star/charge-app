import { W, H, em, colors } from '~/common/constants';

export default {
  container: { paddingLeft: 0, paddingRight: 0},
  itemContainer: { marginVertical: 20 },
  title: { color: '#9f9f9f', fontSize: 15, marginBottom: 7 },
  text: { color: '#36384a', fontSize: 18 },
  linkedItemContainer: { marginTop: 20, marginBottom: 20 },
  linkedItemTouchable: { flexDirection: 'row', justifyContent: 'space-between' },
  linkedTitle: { color: '#36384a', fontSize: 18 },
  linkedArrow: {
    transform: [{rotate: '180deg'}], 
    tintColor: '#bfbfc4',
    marginRight: 5
  },
  linkedAvatar: {
    height: 20,
    width: 30,
    marginRight: 15,
    tintColor: colors.primary
  }
}
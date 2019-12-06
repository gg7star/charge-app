import { em } from '~/common/constants'

export default {
  text: {
    title: {
      color: '#fff',
      fontSize: 26*em,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    desc: {
      color: '#fff',
      fontSize: 15*em,
      textAlign: 'center'
    },
  },
  input: {
    setField: {
      color: '#fff', fontSize: 17*em,
      padding: 20*em, borderRadius: 15*em,
      backgroundColor: 'rgba(255, 255, 255, 0.15)'
    }
  },
  bottomActionBar: {
    position: 'absolute', left: 20*em, bottom: 20*em,
    width: '100%'
  }
} 

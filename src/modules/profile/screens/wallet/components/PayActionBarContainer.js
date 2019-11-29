import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'
import PayActionBar from './PayActionBar'
import * as AppActions from '~/root/app/store/actions'
import * as ProfileActions from '../../../store/actions'

const mapStateToProps = state => ({
  app: state.app || {},
  profile: state.profile || {},
})

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  profileActions: bindActionCreators(ProfileActions, dispatch),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PayActionBar)

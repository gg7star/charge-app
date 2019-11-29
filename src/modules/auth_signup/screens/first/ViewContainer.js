import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'
import View from './View'
import * as AppActions from '~/root/app/store/actions'
import * as SignupActions from '../../store/actions'
import * as AuthActions from '~modules/auth/store/actions'

const mapStateToProps = state => ({
  app: state.app || {},
  signup: state.signup || {},
  auth: state.auth || {}
})

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  signupActions: bindActionCreators(SignupActions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(View)
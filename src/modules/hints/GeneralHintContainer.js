import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'
import {
  AppActions,
  SignupActions
} from '~/actions';
import GeneralHintView from './GeneralHintView'

const mapStateToProps = state => ({
  app: state.app || {},
  signup: state.signup || {},  
})

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  signupActions: bindActionCreators(SignupActions, dispatch),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(GeneralHintView)
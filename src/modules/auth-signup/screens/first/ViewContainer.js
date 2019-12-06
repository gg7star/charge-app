import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import {
  AppActions,
  LoginActions,
  SignupActions
} from '~/actions';
import View from './View';

const mapStateToProps = state => ({
  app: state.app || {},
  signup: state.signup || {},
  auth: state.auth || {}
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  signupActions: bindActionCreators(SignupActions, dispatch),
  authActions: bindActionCreators(LoginActions, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(View);
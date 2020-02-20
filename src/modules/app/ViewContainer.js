import { connect } from 'react-redux';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { AppActions, LoginActions, SignupActions, MapActions, ProfileActions } from '~/actions';
import AppView from './View';

const mapStateToProps = state => ({
  app: state.app || {},
  auth: state.auth || {},
  signup: state.signup || {},
  map: state.app || {}
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  loginActions: bindActionCreators(LoginActions, dispatch),
  signupActions: bindActionCreators(SignupActions, dispatch),
  mapActions: bindActionCreators(MapActions, dispatch),
  profileActions: bindActionCreators(ProfileActions, dispatch)
});

export default compose(
  connect(
    mapStateToProps, 
    mapDispatchToProps
  ),
)(AppView);

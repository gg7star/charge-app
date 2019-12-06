import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, LoginActions, ProfileActions } from '~/actions';
import ScreenView from './View';

const mapStateToProps = state => ({
  app: state.app || {},
  auth: state.auth || {},
  profile: state.profile || {},
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  authActions: bindActionCreators(LoginActions, dispatch),
  profileActions: bindActionCreators(ProfileActions, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ScreenView);

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, LoginActions, ProfileActions } from '~/actions';
import ScreenView from './View';

const mapStateToProps = state => ({
  app: state.app || {},
  profile: state.profile || {},
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  profileActions: bindActionCreators(ProfileActions, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ScreenView);

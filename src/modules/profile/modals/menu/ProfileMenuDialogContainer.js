import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, ProfileActions } from '~/actions';
import ProfileMenuDialog from './ProfileMenuDialog';

const mapStateToProps = state => ({
  app: state.app || {},
  profile: state.profile || {},
  auth: state.auth || {}
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  profileActions: bindActionCreators(ProfileActions, dispatch)
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProfileMenuDialog);
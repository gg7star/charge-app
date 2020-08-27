import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, LoginActions, MapActions, AdmobActions } from '~/actions';
import ScreenView from './View';

const mapStateToProps = state => ({
  app: state.app || {},
  rent: state.rent || {},
  admob: state.admob || {}
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  mapActions: bindActionCreators(MapActions, dispatch),
  admobActions: bindActionCreators(AdmobActions, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ScreenView);
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, MapActions, RentActions } from '~/actions';
import ScreenView from './View';

const mapStateToProps = state => ({
  app: state.app || {},
  auth: state.auth || {},
  map: state.map || {},
  rent: state.rent || {}
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  mapActions: bindActionCreators(MapActions, dispatch),
  rentActions: bindActionCreators(RentActions, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ScreenView);
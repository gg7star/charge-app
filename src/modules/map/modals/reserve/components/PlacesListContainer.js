import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, MapActions } from '~/actions';
import PlacesList from './PlacesList';

const mapStateToProps = state => ({
  app: state.app || {},
  map: state.map || {},  
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  mapActions: bindActionCreators(MapActions, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PlacesList);

import React, {Component} from 'react';
import { Provider } from 'react-redux';
import store from '~/store/store';
import AppViewContainer from '~/modules/app/ViewContainer';

export default class Nono extends Component {
  
  render() {
    return (
      <Provider store={store()}>
				<AppViewContainer />
      </Provider>
    );
  }
}

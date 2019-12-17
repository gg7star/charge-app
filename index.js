import { AppRegistry } from 'react-native';
import RootNode from './src/routes/RootNode';
import {name as appName} from './app.json';
import { onlineDatabase, getPlances } from '~/common/services/rn-firebase/database';
import { initStripe } from '~/common/lib/stripe';

console.disableYellowBox = true;

export default RootNode;

onlineDatabase();
initStripe();

AppRegistry.registerComponent(appName, () => RootNode);

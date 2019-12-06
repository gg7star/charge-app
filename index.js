import { AppRegistry } from 'react-native';
import RootNode from './src/routes/RootNode';
import {name as appName} from './app.json';
import { onlineDatabase, getPlances } from '~/common/services/rn-firebase/database';

console.disableYellowBox = true;

export default RootNode;

onlineDatabase();

AppRegistry.registerComponent(appName, () => RootNode);

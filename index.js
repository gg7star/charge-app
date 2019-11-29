import { AppRegistry } from 'react-native';
import RootNode from './src/root/RootNode';
import {name as appName} from './app.json';

console.disableYellowBox = true;

export default RootNode;

AppRegistry.registerComponent(appName, () => RootNode);

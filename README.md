# README #

### Technical stacks ###
- React native
- Firebase
- Native Base Theme with custom design
- Redux
- Thunk
- Google Map
- Stipe payment integration
- Facebook singup/login

### Environement ###

- node version: `10.16.0`
- react version: `16.8.3`
- react-native version: `0.60.5`

### Running cli ###

- Install react-native-cli.
```shell
  $ nvm use 10.15.0
  $ yarn global add react-native-cli
  $ yarn install
```

- Run on ios simulator
```shell
  $ nvm use 10.15.0
  $ react-native link
  $ cd ios &&
  $ pod install
  $ cd ..
  $ yarn start
```
open other console and run this command
```shell
  $ nvm use 10.15.0
  $ react-native run-ios
```
### Publishing ###

```shell
```

### Troubleshooting

* Failed `pod install`
```
  $ cd ios
  $ pod update ReactNativeUiLib
  $ pod install
```

* Clean cache 

Close the iPhone simulation
```shell
  yarn cache clean && \
    watchman watch-del-all && \
    rm -rf node_modules && \
    rm -rf /tmp/metro-bundler-cache-* && \
    rm -rf /tmp/haste-map-react-native-packager-* && \
    rm -rf $TMPDIR/react-* && rm -rf /tmp/metro-bundler-cache-* && \
    rm -rf /tmp/haste-map-react-native-packager-* && \
    xcrun simctl erase all
```

* Clean build
```
  npx react-native-clean-project --remove-iOS-build --remove-iOS-pods
```
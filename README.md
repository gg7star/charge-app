# README #

### Technical stacks ###
- React native
- Firebase
  1). Auth with Phone and Facebook
  2). Real-Time database
  3). Cloud Message
  4). Admob
- Native Base Theme with custom design
- Redux
- Google Map
- GPS geolocation
- Stripe payment integration
- Facebook SDK
- Integration with OneSignal for push notification
- Integration with Device Middleware API

### Related Servers
- Google Firebase: https://console.firebase.google.com/u/0/project/nono-app-a7dde/overview
- Google Map: https://console.cloud.google.com/google/maps-apis/api-list?project=nono-app-a7dde
- Facebook: https://developers.facebook.com/apps/411769359503356/dashboard/?business_id=1248992388822538
- OneSignal server: https://app.onesignal.com/
- API Gateway: https://nonoapigateway.herokuapp.com/
- Device Middleware server: http://matrix.chargeme.fr/mqtt5/
- Stripe payment: https://www.stripe.com/

### Environement ###
- node version: `12.13.1`
- react version: `16.9.0`
- react-native version: `0.61.5`
- react-native-firebase: `6.2.0`

### Running cli ###

- Install react-native-cli.
```shell
  $ nvm use 12.13.1
  $ yarn install
```

- Run on ios simulator
```shell
  $ nvm use 12.13.1
  $ cd ios &&
  $ pod install
  $ cd ..
  $ yarn start
```
open other console and run this command
```shell
  $ nvm use 12.13.1
  $ react-native run-ios
```

or with device 

```
  $ react-native run-ios --device --udid 00008020-001939191138002E
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

* Android
  - keystone password: `chargeme`

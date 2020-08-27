import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
  checkNotifications,
  requestNotifications,
  openSettings
} from 'react-native-permissions';
import { Alert } from 'react-native';

/** Camera permissions */
export const requireCameraPermission = async (_t) => {
  // Check permissions
  const cameraPermission = Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  });

  try {
    // Check camera permission
    const hasPermission = await check(cameraPermission);

    switch (hasPermission) {
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        console.log(
          'The permission has not been requested / is denied but requestable',
        );
        // Require camera permission
        const status = await request(cameraPermission);
        if (status === RESULTS.GRANTED) return true;
        if ((status === RESULTS.DENIED) || (status === RESULTS.BLOCKED)) {
          console.log('Camera permission was denied by user.');
          requireCameraOpenSettings(_t);
        }
        break;
      case RESULTS.GRANTED:
        // console.log('The permission is granted');
        return true;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        requireCameraOpenSettings(_t);
        break;
    }
  } catch (error) {
    console.log('while checking camera permission, error was happened: ', error);
  };
  return false;
}

export const requireCameraOpenSettings = (_t) => {
  // Require camera permission on settins
  Alert.alert(
    _t('Camera permission'),
    _t('You need to allow camera permission to rent a battery. Would you setup it on phone settings?'),
    [
      {
        text: _t('Ok'),
        onPress: () => {
          // Open settings.
          openSettings().catch(() => console.warn('cannot open settings'));
        }
      },
      { text: _t('Canel'), onPress: () => console.log('clicked cancel.') }
    ],
    { cancelable: true },
  );
}

/** Location permissions */
export const requireLocationPermission = async (_t) => {
  // Check permissions
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  });

  try {
    // Check location permission
    const hasPermission = await check(permission);

    switch (hasPermission) {
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        console.log(
          'The permission has not been requested / is denied but requestable',
        );
        // Require location permission
        const status = await request(permission);
        if (status === RESULTS.GRANTED) return true;
        if ((status === RESULTS.DENIED) || (status === RESULTS.BLOCKED)) {
          console.log('===== Location permission was denied by user.');
          requireLocationOpenSettings(_t);
        }
        break;
      case RESULTS.GRANTED:
        // console.log('The permission is granted');
        return true;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        requireLocationOpenSettings(_t);
        break;
    }
  } catch (error) {
    console.log('while checking camera permission, error was happened: ', error);
  };
  return false;
}

export const requireLocationOpenSettings = (_t) => {
  // Require location permission on settins
  Alert.alert(
    _t('Location permission'),
    _t('You need to allow location permission to search stations. Would you setup it on phone settings?'),
    [
      {
        text: _t('Ok'),
        onPress: () => {
          // Open settings.
          openSettings().catch(() => console.warn('cannot open settings'));
        }
      },
      { text: _t('Canel'), onPress: () => console.log('clicked cancel.') }
    ],
    { cancelable: true },
  );
}

/** Notification permissions */
export const requireNotificationPermission = async (_t) => {
  // Check permissions
  try {
    // Check location permission
    const hasPermission = await checkNotifications();

    switch (hasPermission.status) {
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        console.log(
          'The permission has not been requested / is denied but requestable',
        );
        // Require notification permission
        const { status, settings } = await requestNotifications([
          'alert', 'sound', 'badge', 'lockScreen', 'notificationCenter'
        ]);
        if (status === RESULTS.GRANTED) return true;
        if ((status === RESULTS.DENIED) || (status === RESULTS.BLOCKED)) {
          console.log('===== Location permission was denied by user.');
          requireNotificationOpenSettings(_t);
        }
        break;
      case RESULTS.GRANTED:
        // console.log('The permission is granted');
        return true;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        requireNotificationOpenSettings(_t);
        break;
    }
  } catch (error) {
    console.log('while checking camera permission, error was happened: ', error);
  };
  return false;
}

export const requireNotificationOpenSettings = (_t) => {
  // Require location permission on settins
  Alert.alert(
    _t('Notification permission'),
    _t('You must allow the notification permission to rent a battery. Would you setup it on phone settings?'),
    [
      {
        text: _t('Ok'),
        onPress: () => {
          // Open settings.
          openSettings().catch(() => console.warn('cannot open settings'));
        }
      }
    ],
    { cancelable: false },
  );
}
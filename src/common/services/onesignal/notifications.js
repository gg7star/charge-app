
import OneSignal from 'react-native-onesignal';
import onesignalConfig from '~/common/config/onesignal';

export const postNotification = (contents, data, playerId, otherParameters) => {
  try {
    OneSignal.postNotification(contents, data, playerId, otherParameters);//, otherParameters);
  } catch (error) {
    console.log('======= error: ', error);
  }  
};

export const NONO_NOTIFICATION_TYPES = {
  REGISTERED_FIRST: 'REGISTERED_FIRST',
  CONNECTED_CARD: 'CONNECTED_CARD',
  RENT_BATTERY: 'RENT_BATTERY',
  FAILED_RENT_BATTERY: 'FAILED_RENT_BATTERY',
  RETURNED_BATTERY: 'RETURNED_BATTERY',
  FAILED_RETURN_BATTERY: 'FAILED_RETURN_BATTERY',
  PAIED_TO_NONO: 'PAIED_TO_NONO',
  RATED_NONO: 'RATED_NONO',
  GAVE_FEEDBACK: 'GAVE_FEEDBACK'
};

export const NONO_NOTIFICATION_DATA = {
  REGISTERED_FIRST: {
    contents: {
      'en': 'You are registered firstly.',
      'fr': 'Vous êtes d\'abord enregistré.'
    },
    message: { 
      type: NONO_NOTIFICATION_TYPES.REGISTERED_FIRST
    },
    otherParameters: {
      headings: {
        "en": "Welcome to Nono!",
        "fr": "Bienvenue chez Nono!"
      },
    }
  }
};
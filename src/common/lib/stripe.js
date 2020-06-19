import stripe from 'tipsi-stripe';
import stripeConfig from '~/common/config/stripe';
import { processRequest } from '~/common/services/api';
import serverUrls from '~/common/constants/api';

export async function initStripe() {
  try {
    const response = await processRequest(
      `${serverUrls.apiGatewayServerURL}/payment/stripe/settings`,
      'GET',
      null
    );
    const stripeSettings = response;
    const settings = stripeSettings['data'];
    console.log('====== stripe settings: ', stripeSettings, settings);
    if (settings) {
      const mode = settings['is_live_mode'];
      const publishableKey = mode ? settings['live_publishable_key'] : settings['test_publishable_key'];
      console.log('====== stripe publishableKey: ', publishableKey);
      stripe.setOptions({
        publishableKey: publishableKey || stripeConfig.publishableKey,
      });
    }
  } catch(error) {
    console.log('==== getPaymentSettings error: ', error);
  }
}

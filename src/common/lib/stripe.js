import stripe from 'tipsi-stripe';
import stripeConfig from '~/common/config/stripe';

export function initStripe() {
  stripe.setOptions({
    publishableKey: stripeConfig.publishableKey,
  });  
}

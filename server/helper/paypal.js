import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

console.log("PayPal Client ID loaded:", !!clientId, clientId && clientId.slice(0, 6) + "...");
console.log("PayPal Client Secret loaded:", !!clientSecret, clientSecret && clientSecret.slice(0, 6) + "...");

const environment = new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

export default client;
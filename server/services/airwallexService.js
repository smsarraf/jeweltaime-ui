const axios = require('axios');

class AirwallexService {
  constructor() {
    this.apiKey = process.env.AIRWALLEX_API_KEY;
    this.clientId = process.env.AIRWALLEX_CLIENT_ID;
    this.environment = process.env.AIRWALLEX_ENV || 'demo';
    this.baseURL = this.environment === 'demo'
      ? 'https://api-demo.airwallex.com'
      : 'https://api.airwallex.com';
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Get authentication token from Airwallex
   */
  async getAuthToken() {
    // Return cached token if still valid
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const auth = Buffer.from(`${this.apiKey}:${this.clientId}`).toString('base64');
      const response = await axios.post(
        `${this.baseURL}/api/v1/authentication/login`,
        {},
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'x-api-version': '2025-03-01'
          }
        }
      );

      this.token = response.data.token;
      // Token expires in 30 minutes, refresh after 25 minutes
      this.tokenExpiry = Date.now() + 25 * 60 * 1000;
      return this.token;
    } catch (error) {
      console.error('Airwallex Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Airwallex');
    }
  }

  /**
   * Get request headers with authorization
   */
  async getHeaders() {
    const token = await this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-api-version': '2025-03-01'
    };
  }

  /**
   * Create an Airwallex payment intent
   * @param {number} amount - Amount in minor units (cents)
   * @param {string} currency - Currency code e.g. GBP, USD
   * @param {Object} metadata - Additional metadata
   */
  async createPaymentIntent(amount, currency = 'GBP', metadata = {}) {
    try {
      const headers = await this.getHeaders();

      // Amount must be in minor units (cents, pence)
      const amountInMinorUnits = Math.round(amount * 100);

      const payload = {
        amount: amountInMinorUnits,
        currency: currency,
        merchant_order_id: `ORDER_${Date.now()}`,
        request_id: `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          source: 'jeweltaime_web',
          ...metadata
        },
        // Return the URL that the customer will be redirected to after payment
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?payment_status=completed`
      };

      const response = await axios.post(
        `${this.baseURL}/api/v1/pa/payment_intents/create`,
        payload,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Airwallex Create Payment Intent Error:', error.response?.data || error.message);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Create an Airwallex Payment Session for Drop-in UI
   * @param {string} paymentIntentId - The payment intent ID
   */
  async createPaymentSession(paymentIntentId) {
    try {
      const headers = await this.getHeaders();

      const payload = {
        payment_intent_id: paymentIntentId
      };

      const response = await axios.post(
        `${this.baseURL}/api/v1/pa/payment_sessions/create`,
        payload,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Airwallex Create Session Error:', error.response?.data || error.message);
      throw new Error('Failed to create payment session');
    }
  }

  /**
   * Retrieve payment intent status
   * @param {string} paymentIntentId - The payment intent ID
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(
        `${this.baseURL}/api/v1/pa/payment_intents/${paymentIntentId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Airwallex Get Payment Intent Error:', error.response?.data || error.message);
      throw new Error('Failed to retrieve payment intent');
    }
  }

  /**
   * Confirm a payment intent (for server-side confirmation)
   * @param {string} paymentIntentId - The payment intent ID
   * @param {Object} paymentMethod - Payment method details
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethod) {
    try {
      const headers = await this.getHeaders();

      const payload = {
        payment_method: paymentMethod
      };

      const response = await axios.post(
        `${this.baseURL}/api/v1/pa/payment_intents/${paymentIntentId}/confirm`,
        payload,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Airwallex Confirm Payment Intent Error:', error.response?.data || error.message);
      throw new Error('Failed to confirm payment intent');
    }
  }

  /**
   * Create a Payment Intent with embedded Drop-in UI support
   * This combines both intent creation and session creation for the Drop-in UI flow
   */
  async createDropInPaymentSession(amount, currency = 'GBP', metadata = {}) {
    try {
      // Step 1: Create payment intent
      const paymentIntent = await this.createPaymentIntent(amount, currency, metadata);

      // Step 2: Create payment session for Drop-in UI
      const session = await this.createPaymentSession(paymentIntent.id);

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        sessionId: session.id,
        sessionToken: session.token || session.session_token,
        amount: amount,
        currency: currency,
        merchantOrderId: paymentIntent.merchant_order_id
      };
    } catch (error) {
      console.error('Airwallex Drop-in Session Error:', error);
      throw error;
    }
  }

  /**
   * Handle Airwallex webhook events
   * @param {Object} event - The webhook event object
   */
  handleWebhook(event) {
    console.log('Airwallex Webhook Event:', event.type, event.id);

    switch (event.type) {
      case 'payment_intent.created':
        console.log('Payment intent created:', event.data?.id);
        break;
      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded:', event.data?.id);
        // Here you would update order status in your database
        break;
      case 'payment_intent.failed':
        console.log('Payment intent failed:', event.data?.id);
        break;
      case 'payment_intent.cancelled':
        console.log('Payment intent cancelled:', event.data?.id);
        break;
      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return { received: true };
  }
}

module.exports = new AirwallexService();
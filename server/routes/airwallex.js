const express = require('express');
const router = express.Router();
const airwallexService = require('../services/airwallexService');

/**
 * POST /api/airwallex/create-payment-session
 * Creates a payment intent + session for the Drop-in UI
 * Body: { amount, currency, metadata }
 */
router.post('/create-payment-session', async (req, res) => {
  try {
    const { amount, currency = 'GBP', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Must be a positive number.' });
    }

    const session = await airwallexService.createDropInPaymentSession(
      amount,
      currency,
      metadata
    );

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Create payment session error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment session'
    });
  }
});

/**
 * GET /api/airwallex/payment-intent/:id
 * Retrieve payment intent status
 */
router.get('/payment-intent/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    const paymentIntent = await airwallexService.getPaymentIntent(id);

    res.json({
      success: true,
      data: paymentIntent
    });
  } catch (error) {
    console.error('Get payment intent error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve payment intent'
    });
  }
});

/**
 * POST /api/airwallex/webhook
 * Handle Airwallex webhook events
 */
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;

    if (!event || !event.type) {
      return res.status(400).json({ error: 'Invalid webhook event' });
    }

    const result = airwallexService.handleWebhook(event);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process webhook'
    });
  }
});

/**
 * POST /api/airwallex/confirm-payment
 * Confirm a payment intent server-side
 * Body: { paymentIntentId, paymentMethod }
 */
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, paymentMethod } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    const result = await airwallexService.confirmPaymentIntent(
      paymentIntentId,
      paymentMethod
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to confirm payment'
    });
  }
});

module.exports = router;
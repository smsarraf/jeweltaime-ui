const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');

// In-memory order storage (for demo purposes)
let orders = [];

// Possible order statuses
const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

/**
 * POST /api/orders
 * Store a new order
 * Body: { orderId, paymentMethod, transactionId, billing, items, subtotal, shipping, total, status, userId }
 */
router.post('/', (req, res) => {
  try {
    const { orderId, paymentMethod, transactionId, billing, items, subtotal, shipping, total, status, userId } = req.body;

    if (!orderId || !billing || !items) {
      return res.status(400).json({ error: 'Missing required fields: orderId, billing, items' });
    }

    const order = {
      id: orderId,
      paymentMethod,
      transactionId,
      billing,
      items,
      subtotal,
      shipping,
      total,
      status: status || ORDER_STATUSES.PENDING,
      userId: userId || (billing && billing.email) || 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        { status: status || ORDER_STATUSES.PENDING, timestamp: new Date().toISOString(), note: 'Order created' }
      ]
    };

    orders.push(order);

    console.log(`Order stored: ${orderId} (${paymentMethod}) - £${total}`);

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Store order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store order'
    });
  }
});

/**
 * GET /api/orders/my-orders
 * Get orders for the authenticated user
 */
router.get('/my-orders', authMiddleware, (req, res) => {
  try {
    const userOrders = orders.filter(o => o.userId === req.userId || (o.billing && o.billing.email === req.user.email));
    res.json({
      success: true,
      data: userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders.'
    });
  }
});

/**
 * GET /api/orders/:id
 * Get a specific order by ID
 */
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }

  res.json({
    success: true,
    data: order
  });
});

/**
 * PUT /api/orders/:id/cancel
 * Cancel an order (only if status is 'pending' or 'confirmed')
 */
router.put('/:id/cancel', authMiddleware, (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Verify ownership
    if (order.userId !== req.userId && (!order.billing || order.billing.email !== req.user.email)) {
      return res.status(403).json({
        success: false,
        error: 'You can only cancel your own orders.'
      });
    }

    const cancellableStatuses = [ORDER_STATUSES.PENDING, ORDER_STATUSES.CONFIRMED];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: `Order cannot be cancelled. Current status: ${order.status}. Only pending or confirmed orders can be cancelled.`
      });
    }

    order.status = ORDER_STATUSES.CANCELLED;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: ORDER_STATUSES.CANCELLED,
      timestamp: new Date().toISOString(),
      note: 'Order cancelled by customer'
    });

    console.log(`Order cancelled: ${order.id} by user ${req.userId}`);

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order.'
    });
  }
});

/**
 * GET /api/orders/:id/status
 * Get latest order status
 */
router.get('/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }

  res.json({
    success: true,
    data: {
      orderId: order.id,
      status: order.status,
      updatedAt: order.updatedAt,
      statusHistory: order.statusHistory || []
    }
  });
});

/**
 * GET /api/orders
 * Get all orders (admin)
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: orders
  });
});

module.exports = router;
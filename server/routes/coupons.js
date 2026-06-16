const express = require('express');
const router = express.Router();

// In-memory coupon storage (for demo purposes)
// In production, replace with a database
const coupons = [
  {
    code: 'FREE15FIRST',
    type: 'percentage',
    discount: 15,
    minAmount: 0,
    maxUses: 100,
    usedCount: 0,
    active: true
  }
];

/**
 * POST /api/coupons/validate
 * Validate a coupon code and return discount info
 * Body: { code: string, cartTotal: number }
 */
router.post('/validate', (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || !cartTotal) {
      return res.status(400).json({
        success: false,
        error: 'Coupon code and cart total are required'
      });
    }

    const coupon = coupons.find(
      c => c.code.toUpperCase() === code.trim().toUpperCase()
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Invalid coupon code'
      });
    }

    if (!coupon.active) {
      return res.status(400).json({
        success: false,
        error: 'This coupon is no longer active'
      });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({
        success: false,
        error: 'This coupon has reached its maximum usage limit'
      });
    }

    if (coupon.minAmount && cartTotal < coupon.minAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum cart total of $${coupon.minAmount} required for this coupon`
      });
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = cartTotal * (coupon.discount / 100);
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.discount;
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;

    // Increment usage count
    coupon.usedCount++;

    res.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        discountPercent: coupon.type === 'percentage' ? coupon.discount : 0,
        discountAmount,
        description: coupon.type === 'percentage'
          ? `${coupon.discount}% off`
          : `$${coupon.discount} off`
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate coupon'
    });
  }
});

module.exports = router;
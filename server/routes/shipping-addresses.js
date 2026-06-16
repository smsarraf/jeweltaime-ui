const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');

// In-memory shipping addresses storage
// In production, replace with a database
const addresses = {};

/**
 * GET /api/shipping-addresses
 * Get all shipping addresses for the authenticated user
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const userAddresses = addresses[req.userId] || [];
    res.json({ success: true, data: userAddresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch addresses.' });
  }
});

/**
 * POST /api/shipping-addresses
 * Add a new shipping address
 * Body: { label, firstName, lastName, phone, addressLine1, addressLine2, country, state, city, postcode, isDefault }
 */
router.post('/', authMiddleware, (req, res) => {
  try {
    const { label, firstName, lastName, phone, addressLine1, addressLine2, country, state, city, postcode, isDefault } = req.body;

    if (!firstName || !lastName || !addressLine1 || !country || !city || !postcode) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: firstName, lastName, addressLine1, country, city, postcode'
      });
    }

    if (!addresses[req.userId]) {
      addresses[req.userId] = [];
    }

    // If this is the first address or marked as default, unset others
    if (isDefault || addresses[req.userId].length === 0) {
      addresses[req.userId].forEach(addr => { addr.isDefault = false; });
    }

    const newAddress = {
      id: `ADDR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4)}`,
      label: label || '',
      firstName,
      lastName,
      phone: phone || '',
      addressLine1,
      addressLine2: addressLine2 || '',
      country,
      state: state || '',
      city,
      postcode,
      isDefault: addresses[req.userId].length === 0 ? true : !!isDefault,
      createdAt: new Date().toISOString()
    };

    addresses[req.userId].push(newAddress);

    console.log(`Address added for user ${req.userId}: ${newAddress.id}`);

    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, error: 'Failed to add address.' });
  }
});

/**
 * PUT /api/shipping-addresses/:id
 * Update a shipping address
 */
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const userAddresses = addresses[req.userId] || [];
    const index = userAddresses.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Address not found.' });
    }

    const { label, firstName, lastName, phone, addressLine1, addressLine2, country, state, city, postcode, isDefault } = req.body;

    if (isDefault) {
      userAddresses.forEach(addr => { addr.isDefault = false; });
    }

    const addr = userAddresses[index];
    if (label !== undefined) addr.label = label;
    if (firstName !== undefined) addr.firstName = firstName;
    if (lastName !== undefined) addr.lastName = lastName;
    if (phone !== undefined) addr.phone = phone;
    if (addressLine1 !== undefined) addr.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) addr.addressLine2 = addressLine2;
    if (country !== undefined) addr.country = country;
    if (state !== undefined) addr.state = state;
    if (city !== undefined) addr.city = city;
    if (postcode !== undefined) addr.postcode = postcode;
    if (isDefault !== undefined) addr.isDefault = isDefault;

    console.log(`Address updated for user ${req.userId}: ${addr.id}`);

    res.json({ success: true, data: addr });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ success: false, error: 'Failed to update address.' });
  }
});

/**
 * DELETE /api/shipping-addresses/:id
 * Delete a shipping address
 */
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const userAddresses = addresses[req.userId] || [];
    const index = userAddresses.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Address not found.' });
    }

    const wasDefault = userAddresses[index].isDefault;
    userAddresses.splice(index, 1);

    // If the deleted address was default and there are other addresses, set the first one as default
    if (wasDefault && userAddresses.length > 0) {
      userAddresses[0].isDefault = true;
    }

    console.log(`Address deleted for user ${req.userId}: ${req.params.id}`);

    res.json({ success: true, data: userAddresses });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete address.' });
  }
});

/**
 * PUT /api/shipping-addresses/:id/default
 * Set an address as default
 */
router.put('/:id/default', authMiddleware, (req, res) => {
  try {
    const userAddresses = addresses[req.userId] || [];
    const index = userAddresses.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Address not found.' });
    }

    userAddresses.forEach(addr => { addr.isDefault = false; });
    userAddresses[index].isDefault = true;

    res.json({ success: true, data: userAddresses[index] });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ success: false, error: 'Failed to set default address.' });
  }
});

module.exports = router;
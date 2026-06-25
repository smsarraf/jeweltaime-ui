const express = require('express');
const router = express.Router();

// In-memory wishlist storage
// In production, replace with a database
const wishlists = {};

/**
 * Helper: get wishlist items for a user
 */
function getWishlist(userId) {
  return wishlists[userId] || [];
}

/**
 * Helper: save wishlist for a user
 */
function saveWishlist(userId, items) {
  wishlists[userId] = items;
}

/**
 * Middleware: extract user from auth token
 * Expects header: Authorization: Bearer <token>
 * For demo, token format: jwt-{userId}-{timestamp}
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in.'
    });
  }

  const token = authHeader.split(' ')[1];
  const parts = token.split('-');
  if (parts.length < 3 || parts[0] !== 'jwt') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }

  // Extract userId from token: jwt-{userId}-{timestamp}
  const userId = parts[1];
  req.userId = userId;
  next();
}

/**
 * GET /api/wishlist
 * Get all wishlist items for the authenticated user
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const items = getWishlist(req.userId);
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wishlist.'
    });
  }
});

/**
 * POST /api/v1/wishlist/add
 * Add a product to the wishlist
 * Body: { product: { id, name, price, image, slug, category } }
 */
router.post('/add', authMiddleware, (req, res) => {
  try {
    const { product } = req.body;

    if (!product || !product.id) {
      return res.status(400).json({
        success: false,
        error: 'Product data is required.'
      });
    }

    const items = getWishlist(req.userId);

    // Check if product already exists in wishlist
    const exists = items.find(item => item.id === product.id);
    if (exists) {
      return res.json({
        success: true,
        data: items,
        message: 'Product is already in your wishlist.'
      });
    }

    items.push({
      id: product.id,
      name: product.name || '',
      price: product.price || 0,
      image: product.image || '',
      slug: product.slug || '',
      category: product.category || '',
      addedAt: new Date().toISOString()
    });

    saveWishlist(req.userId, items);

    console.log(`Wishlist add: User ${req.userId} added product ${product.id}`);

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add to wishlist.'
    });
  }
});

/**
 * DELETE /api/v1/wishlist/remove/:productId
 * Remove a product from the wishlist
 */
router.delete('/remove/:productId', authMiddleware, (req, res) => {
  try {
    const { productId } = req.params;
    const items = getWishlist(req.userId);
    const filtered = items.filter(item => item.id !== productId);

    if (filtered.length === items.length) {
      return res.status(404).json({
        success: false,
        error: 'Product not found in wishlist.'
      });
    }

    saveWishlist(req.userId, filtered);

    console.log(`Wishlist remove: User ${req.userId} removed product ${productId}`);

    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove from wishlist.'
    });
  }
});

/**
 * POST /api/v1/wishlist/check
 * Check if products are in the user's wishlist
 * Body: { productIds: string[] }
 * Returns: { [productId]: true/false }
 */
router.post('/check', authMiddleware, (req, res) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        error: 'productIds must be an array.'
      });
    }

    const items = getWishlist(req.userId);
    const result = {};
    productIds.forEach(id => {
      result[id] = !!items.find(item => item.id === id);
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check wishlist.'
    });
  }
});

/**
 * GET /api/v1/wishlist/count
 * Get the count of wishlist items
 */
router.get('/count', authMiddleware, (req, res) => {
  try {
    const items = getWishlist(req.userId);
    res.json({
      success: true,
      data: { count: items.length }
    });
  } catch (error) {
    console.error('Wishlist count error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wishlist count.'
    });
  }
});

module.exports = router;
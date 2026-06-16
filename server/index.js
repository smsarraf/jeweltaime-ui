const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const airwallexRoutes = require('./routes/airwallex');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const ordersRoutes = require('./routes/orders');
const categoriesRoutes = require('./routes/categories');
const couponsRoutes = require('./routes/coupons');
const authRoutes = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlist');
const locationRoutes = require('./routes/locations');
const shippingAddressRoutes = require('./routes/shipping-addresses');
const policiesRoutes = require('./routes/policies');

// Routes
app.use('/api/airwallex', airwallexRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/shipping-addresses', shippingAddressRoutes);
app.use('/api/policies', policiesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const airwallexRoutes = require('./routes/airwallex');
const { passport } = require('./services/passport');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session middleware (required by Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'jeweltaime-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

const ordersRoutes = require('./routes/orders');
const categoriesRoutes = require('./routes/categories');
const couponsRoutes = require('./routes/coupons');
const authRoutes = require('./routes/auth');
const socialAuthRoutes = require('./routes/social-auth');
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
app.use('/api/auth/social', socialAuthRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/shipping-addresses', shippingAddressRoutes);
app.use('/api/legal-policies', policiesRoutes);

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
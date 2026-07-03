const express = require('express');
const router = express.Router();

// Shared in-memory user storage
const { users } = require('../services/userStore');

/**
 * Middleware: extract user from auth token
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.'
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

  const userId = parts[1];
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'User not found.'
    });
  }

  req.user = user;
  req.userId = userId;
  next();
}

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: firstName, lastName, email, password'
      });
    }

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters.'
      });
    }

    const user = {
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      firstName,
      lastName,
      email,
      phone: phone || '',
      address: '',
      city: '',
      postcode: '',
      country: '',
      password, // In production, hash the password with bcrypt
      createdAt: new Date().toISOString()
    };

    users.push(user);

    console.log(`User registered: ${user.email} (${user.id})`);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate a user
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    console.log(`User logged in: ${user.email}`);

    res.json({
      success: true,
      token: `jwt-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authMiddleware, (req, res) => {
  const { password, ...safeUser } = req.user;
  res.json({
    success: true,
    data: safeUser
  });
});

/**
 * PUT /api/auth/profile
 * Update user profile
 * Body: { firstName, lastName, email, phone, address, city, postcode, country }
 */
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, postcode, country } = req.body;

    if (firstName) req.user.firstName = firstName;
    if (lastName) req.user.lastName = lastName;
    if (email) {
      // Check if email is taken by another user
      const emailTaken = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== req.user.id);
      if (emailTaken) {
        return res.status(409).json({
          success: false,
          error: 'This email is already in use.'
        });
      }
      req.user.email = email;
    }
    if (phone !== undefined) req.user.phone = phone;
    if (address !== undefined) req.user.address = address;
    if (city !== undefined) req.user.city = city;
    if (postcode !== undefined) req.user.postcode = postcode;
    if (country !== undefined) req.user.country = country;

    console.log(`User profile updated: ${req.user.email}`);

    const { password, ...safeUser } = req.user;
    res.json({
      success: true,
      data: safeUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile.'
    });
  }
});

/**
 * PUT /api/auth/password
 * Change user password
 * Body: { currentPassword, newPassword }
 */
router.put('/password', authMiddleware, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required.'
      });
    }

    if (req.user.password !== currentPassword) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters.'
      });
    }

    req.user.password = newPassword;

    res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update password.'
    });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
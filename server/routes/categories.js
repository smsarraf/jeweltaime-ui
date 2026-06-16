const express = require('express');
const router = express.Router();

// Hierarchical categories data
// In production, this would come from a database
const categories = [
  {
    id: 1,
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Beautiful necklaces and pendants',
    image: 'https://placehold.co/185x185',
    parentId: null,
    children: [
      { id: 11, name: 'Gold Necklaces', slug: 'gold-necklaces', description: 'Gold necklaces', image: 'https://placehold.co/185x185', parentId: 1, children: [] },
      { id: 12, name: 'Silver Necklaces', slug: 'silver-necklaces', description: 'Silver necklaces', image: 'https://placehold.co/185x185', parentId: 1, children: [] },
      { id: 13, name: 'Pendants', slug: 'pendants', description: 'Beautiful pendants', image: 'https://placehold.co/185x185', parentId: 1, children: [] },
      { id: 14, name: 'Pearl Necklaces', slug: 'pearl-necklaces', description: 'Pearl necklaces', image: 'https://placehold.co/185x185', parentId: 1, children: [] }
    ]
  },
  {
    id: 2,
    name: 'Rings',
    slug: 'rings',
    description: 'Elegant rings for every occasion',
    image: 'https://placehold.co/185x185',
    parentId: null,
    children: [
      { id: 21, name: 'Engagement Rings', slug: 'engagement-rings', description: 'Engagement rings', image: 'https://placehold.co/185x185', parentId: 2, children: [] },
      { id: 22, name: 'Wedding Bands', slug: 'wedding-bands', description: 'Wedding bands', image: 'https://placehold.co/185x185', parentId: 2, children: [] },
      { id: 23, name: 'Fashion Rings', slug: 'fashion-rings', description: 'Fashion rings', image: 'https://placehold.co/185x185', parentId: 2, children: [] }
    ]
  },
  {
    id: 3,
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Stylish bracelets and bangles',
    image: 'https://placehold.co/185x185',
    parentId: null,
    children: [
      { id: 31, name: 'Gold Bracelets', slug: 'gold-bracelets', description: 'Gold bracelets', image: 'https://placehold.co/185x185', parentId: 3, children: [] },
      { id: 32, name: 'Silver Bracelets', slug: 'silver-bracelets', description: 'Silver bracelets', image: 'https://placehold.co/185x185', parentId: 3, children: [] },
      { id: 33, name: 'Charm Bracelets', slug: 'charm-bracelets', description: 'Charm bracelets', image: 'https://placehold.co/185x185', parentId: 3, children: [] }
    ]
  },
  {
    id: 4,
    name: 'Earrings',
    slug: 'earrings',
    description: 'Beautiful earrings for all styles',
    image: 'https://placehold.co/185x185',
    parentId: null,
    children: [
      { id: 41, name: 'Stud Earrings', slug: 'stud-earrings', description: 'Stud earrings', image: 'https://placehold.co/185x185', parentId: 4, children: [] },
      { id: 42, name: 'Hoop Earrings', slug: 'hoop-earrings', description: 'Hoop earrings', image: 'https://placehold.co/185x185', parentId: 4, children: [] },
      { id: 43, name: 'Drop Earrings', slug: 'drop-earrings', description: 'Drop earrings', image: 'https://placehold.co/185x185', parentId: 4, children: [] }
    ]
  },
  {
    id: 5,
    name: 'Charms & Dangles',
    slug: 'charms-dangles',
    description: 'Charming additions to your collection',
    image: 'https://placehold.co/185x185',
    parentId: null,
    children: [
      { id: 51, name: 'Gold Charms', slug: 'gold-charms', description: 'Gold charms', image: 'https://placehold.co/185x185', parentId: 5, children: [] },
      { id: 52, name: 'Silver Charms', slug: 'silver-charms', description: 'Silver charms', image: 'https://placehold.co/185x185', parentId: 5, children: [] }
    ]
  },
  {
    id: 6,
    name: 'Watches',
    slug: 'watches',
    description: 'Luxury timepieces',
    image: 'https://placehold.co/185x185',
    parentId: null,
    children: [
      { id: 61, name: 'Men\'s Watches', slug: 'mens-watches', description: 'Men\'s watches', image: 'https://placehold.co/185x185', parentId: 6, children: [] },
      { id: 62, name: 'Women\'s Watches', slug: 'womens-watches', description: 'Women\'s watches', image: 'https://placehold.co/185x185', parentId: 6, children: [] }
    ]
  }
];

/**
 * GET /api/categories
 * Get all parent categories
 */
router.get('/', (req, res) => {
  const parentCategories = categories
    .filter(c => c.parentId === null)
    .map(({ children, ...parent }) => ({
      ...parent,
      childCount: children ? children.length : 0
    }));

  res.json({
    success: true,
    data: parentCategories
  });
});

/**
 * GET /api/categories/all
 * Get all categories with full hierarchy
 */
router.get('/all', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

/**
 * GET /api/categories/:slug
 * Get a single category by slug (with children)
 */
router.get('/:slug', (req, res) => {
  const { slug } = req.params;

  // Search top-level categories
  let category = categories.find(c => c.slug === slug);

  // Search children if not found at top level
  if (!category) {
    for (const parent of categories) {
      const child = parent.children.find(c => c.slug === slug);
      if (child) {
        category = { ...child, parentSlug: parent.slug, parentName: parent.name };
        break;
      }
    }
  }

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }

  res.json({
    success: true,
    data: category
  });
});

module.exports = router;
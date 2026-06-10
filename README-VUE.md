# JewelT'Aime Vue.js Frontend Application

A modern, responsive Vue.js 3 front-end application for the JewelT'Aime luxury jewelry store.

## Features

✨ **Multi-Page Application** with Vue Router
- Home Page with hero section and featured products
- Product Listing with category filtering and pagination
- Product Detail pages with related products
- User Profile management
- Order Management (Order List and Order Details)
- Shopping Cart with add/remove/quantity management
- Checkout process
- Blog listing and detail pages
- About page

## Pages Included

### Public Pages
- **Home** (`/`) - Landing page with categories and featured products
- **Products** (`/products`) - Product listing with filters and pagination
- **Product Detail** (`/products/:id`) - Individual product page
- **Products by Category** (`/products/category/:category`) - Category-filtered products
- **Blog** (`/blog`) - Blog post listing
- **Blog Detail** (`/blog/:id`) - Individual blog post
- **About** (`/about`) - About page
- **Cart** (`/cart`) - Shopping cart
- **Checkout** (`/checkout`) - Order checkout

### User Pages (Authenticated)
- **User Profile** (`/profile`) - User profile management
- **Orders** (`/orders`) - User orders list
- **Order Detail** (`/orders/:id`) - Order details and tracking

## Technology Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Client-side routing
- **Pinia** - State management
- **Bootstrap 5** - CSS framework
- **Vite** - Modern build tool
- **Axios** - HTTP client

## Project Structure

```
vue-app/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── ProductCard.vue
│   ├── pages/
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   ├── ProductDetail.vue
│   │   ├── BlogList.vue
│   │   ├── BlogDetail.vue
│   │   ├── UserProfile.vue
│   │   ├── Orders.vue
│   │   ├── OrderDetail.vue
│   │   ├── Cart.vue
│   │   ├── Checkout.vue
│   │   ├── About.vue
│   │   └── NotFound.vue
│   ├── stores/
│   │   ├── productStore.js
│   │   ├── cartStore.js
│   │   └── userStore.js
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── .env.example
```

## Installation

1. Navigate to the vue-app directory:
```bash
cd vue-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Store Management (Pinia)

### Product Store
- Manages product list, filtering, and sorting
- Supports category filtering
- Price range filtering
- Product detail lookup

### Cart Store
- Manages shopping cart items
- Add/remove products
- Update quantities
- Calculate cart totals

### User Store
- Manages user profile data
- User authentication state
- Order management
- Profile updates

## Styling

The application uses a combination of:
- **Bootstrap 5** for responsive grid and utility classes
- **Custom CSS** for luxury brand styling
- **Luxury color scheme** with dark accents (#222), whites, and accent colors
- **Responsive design** for mobile, tablet, and desktop

## Features Implemented

### Product Management
✅ Dynamic product filtering by category
✅ Price range filtering
✅ Multiple sorting options (newest, price, rating)
✅ Product pagination
✅ Product detail pages with related products
✅ Quick add to cart functionality

### Shopping Cart
✅ Add/remove products
✅ Update quantities
✅ Calculate totals
✅ Persistent cart state (via Pinia)

### User Experience
✅ Responsive header with navigation
✅ Product cards with images and quick actions
✅ Breadcrumb navigation
✅ Category browsing
✅ Order tracking
✅ Profile management

### Blog
✅ Blog listing with date formatting
✅ Individual blog post pages
✅ Author and date information

## Future Enhancements

- Backend API integration
- Authentication/Login system
- Wishlist functionality
- Product reviews and ratings
- Advanced search
- Payment gateway integration
- Email notifications
- Image optimization
- SEO improvements
- Dark mode theme

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

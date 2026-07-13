# AGENTS.md - JewelTime UI Project Guide

## Project Overview

JewelTime UI is a comprehensive e-commerce jewelry store application consisting of:
- **Static HTML pages** - Marketing/brochure pages (home, about, blog, shop, cart, checkout, etc.)
- **Vue 3 Frontend (vue-app/)** - Full-featured SPA for the storefront
- **Express.js Backend** - Legacy API server (server/)
- **ERP Backend (Primary)** - Headless CMS and commerce API at `http://localhost:3000`

## Vue App Architecture

### Tech Stack
- **Vue 3** - Composition API with `<script setup>` syntax
- **Vite** - Build tool and dev server
- **Pinia** - State management
- **Vue Router 4** - Client-side routing
- **Bootstrap 5** - UI framework
- **Axios** - HTTP client for API communication

### Project Structure
```
vue-app/
├── src/
│   ├── main.js                    # App entry point
│   ├── App.vue                    # Root component
│   ├── router/
│   │   └── index.js               # Vue Router configuration (lazy-loaded routes)
│   ├── pages/                     # Page components (one per route)
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   ├── ProductDetail.vue
│   │   ├── Cart.vue
│   │   ├── Checkout.vue
│   │   ├── SignIn.vue
│   │   ├── Register.vue
│   │   ├── Profile.vue
│   │   ├── Dashboard.vue
│   │   ├── Orders.vue
│   │   ├── OrderDetail.vue
│   │   ├── Wishlist.vue
│   │   ├── Contact.vue
│   │   └── PolicyPage.vue
│   ├── components/                # Reusable components
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── ProductCard.vue
│   ├── stores/                    # Pinia state stores
│   │   ├── cartStore.js
│   │   ├── wishlistStore.js
│   │   ├── locationStore.js
│   │   └── siteSettingsStore.js
│   ├── utils/                     # Helper utilities
│   │   ├── auth.js
│   │   └── slug.js
│   └── assets/                    # Static assets
├── api-docs.json                  # OpenAPI 3.0 specification
├── .env.example                   # Environment variables template
├── .env                           # Environment configuration (not committed)
├── vite.config.js                 # Vite configuration
└── package.json                   # Dependencies and scripts
```

## Environment Configuration

### Required Environment Variables
Create `.env` from `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_TITLE=JewelTime
VITE_UPLOAD_BASE_URL=http://localhost:3000
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## ERP Backend API (Primary CMS)

### Base URL
```
http://localhost:3000/api/v1
```

### Swagger Documentation
Full interactive API docs: `http://localhost:3000/swagger-ui/index.html`

### API Categories

#### 1. Authentication & Authorization
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh-token` - Refresh access token

#### 2. Product Catalog (CMS)
**Endpoints:**
- `GET /products` - Get all products (paginated)
- `GET /products/{id}` - Get product by ID
- `GET /products/search?keyword=` - Search products
- `GET /products/category/{categoryId}` - Products by category
- `GET /products/low-stock` - Low stock products
- `POST /products` - Create product (admin)
- `PUT /products/{id}` - Update product (admin)
- `DELETE /products/{id}` - Delete product (admin)
- `POST /products/{id}/stock` - Add stock
- `GET /products/{id}/reviews` - Get reviews
- `POST /products/{id}/reviews` - Add review

**Key Schemas:**
```javascript
ProductResponse {
  id: number
  sku: string
  name: string
  shortDescription: string
  longDescription: string
  videoUrl: string
  basePriceUsd: number
  categoryId: number
  categoryName: string
  tags: string[]
  customFields: object
  isActive: boolean
  supplierId: number
  createdAt: string (date-time)
  variants: ProductVariantResponse[]
  media: ProductMediaResponse[]
}

ProductCreateRequest {
  categoryId: number (required)
  supplierId: number (required)
  sku: string (required)
  name: string (required)
  basePriceUsd: number (required)
  tags: string[]
  customFields: object
  variants: ProductVariantRequest[]
  media: ProductMediaRequest[]
  warehouseQuantities: object
}
```

#### 3. Category Management (CMS)
**Endpoints:**
- `GET /categories` - Get all categories
- `GET /categories/root` - Get root categories
- `GET /categories/{id}/subcategories` - Get subcategories
- `GET /categories/{id}/all-subcategories` - Get all descendants
- `GET /categories/{id}` - Get category by ID
- `POST /categories` - Create category (admin)
- `PUT /categories/{id}` - Update category (admin)
- `DELETE /categories/{id}` - Delete category (admin)

**Key Schema:**
```javascript
Category {
  id: number
  parent: Category (null for root)
  name: string
  slug: string
}

CategoryResponse {
  id: number
  name: string
  slug: string
  childCats: Category[]
}
```

#### 4. Banner Management (CMS)
**Endpoints:**
- `GET /banners` - Get all banners (admin)
- `GET /banners/active` - Get active banners (public, filtered by date/priority)
- `GET /banners/{id}` - Get banner by ID (admin)
- `POST /banners` - Create banner (admin)
- `PUT /banners/{id}` - Update banner (admin)
- `DELETE /banners/{id}` - Delete banner (admin)

**Key Schema:**
```javascript
Banner {
  id: number
  title: string
  subtitle: string
  specialText: string
  buttonText: string
  targetUrl: string
  imageUrl: string
  isActive: boolean
  startDate: string (date-time)
  endDate: string (date-time)
  priority: number
}
```

#### 5. Site Settings Management (CMS)
**Endpoints:**
- `GET /site-settings` - Get site configuration
- `POST /site-settings` - Create settings (admin)
- `PUT /site-settings/{id}` - Update settings (admin)
- `DELETE /site-settings/{id}` - Delete settings (admin)

**Key Schema:**
```javascript
SiteSettings {
  id: number
  logo: string
  shortDescription: string
  longDescription: string
  instagramLink: string
  facebookLink: string
  pinterestLink: string
  twitterLink: string
  emailAddress: string
  contactInfo: string
  storeInfo: string
  freeShippingText: string
  returnText: string
  googleMapLink: string
}
```

#### 6. Legal Policies (CMS)
**Endpoints:**
- `GET /legal-policies` - Get all policies
- `GET /legal-policies/{slug}` - Get policy by slug (public)
- `PUT /legal-policies/{id}` - Update policy (admin)

**Key Schema:**
```javascript
LegalPolicy {
  id: number
  slug: string (unique identifier)
  title: string
  contentHtml: string (rich text)
  isPublished: boolean
  createdAt: string (date-time)
  updatedAt: string (date-time)
}

LegalPolicyUpdateRequest {
  title?: string
  contentHtml?: string
}
```

#### 7. User Management (CMS)
- `GET /users` - List all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create user (admin only)
- `PUT /users/{id}` - Update user (admin only)
- `DELETE /users/{id}` - Delete user
- `PATCH /users/{id}/activate` - Activate user (admin)
- `PATCH /users/{id}/deactivate` - Deactivate user (admin)
- `GET /users/email/{email}` - Get user by email
- `GET /roles` - Get all roles

#### 8. Order Management (CMS)
**Endpoints:**
- `GET /orders` - Get all orders (paginated)
- `GET /orders/{id}` - Get order by ID
- `POST /orders` - Create order
- `PUT /orders/{id}/status?status=` - Update order status
- `POST /orders/{id}/ship?trackingNumber=` - Ship order
- `GET /orders/user/{userId}` - Get user orders
- `GET /orders/total-value` - Get total order value
- `GET /orders/recent/{days}` - Get recent orders

**Key Schema:**
```javascript
OrderResponse {
  id: number
  userId: number
  status: string (ORDERED, PREPARING, SHIPPED, etc.)
  source: string (WEBSITE, BULK_B2B)
  shippingAddress: string
  totalUsdPrice: number
  paymentTerm: string
  shippingTrackingNumber: string
  items: OrderItemResponse[]
}

OrderCreateRequest {
  userId: number (required)
  countryId: number (required)
  items: OrderItemRequest[] (required)
  shippingAddress: string (required)
  currencyId: number
  voucherId: number
  paymentTermId: string
  paymentGatewayId: number
}
```

#### 9. Inventory Management (CMS)
- `POST /inventory/create` - Create inventory record
- `POST /inventory/add-stock` - Add stock to warehouse
- `POST /inventory/reduce-stock` - Reduce stock
- `POST /inventory/adjust-stock` - Adjust stock levels
- `POST /inventory/transfer-stock` - Transfer between warehouses
- `GET /inventory/low-stock` - Get low stock items
- `GET /inventory/product/{productId}` - Get product inventory

#### 10. Other CMS Endpoints
- **Wishlist**: `/wishlist/*` - User wishlist operations
- **Notifications**: `/notifications` - Send/receive notifications
- **File Upload**: `/upload` - Upload files to public folder
- **Vouchers**: `/vouchers/*` - Promotional codes and validation
- **Locations**: `/locations/*` - Countries, states, cities data
- **Partners**: `/partners/*` - Suppliers/manufacturers management

---

## Coding Conventions

### Vue Components
- Use **PascalCase** for component names: `ProductCard.vue`, `Header.vue`
- Use **Composition API** with `<script setup>` syntax
- Components should be single-file (`.vue` files)
- Keep components focused and reusable

### JavaScript/TypeScript
- Use **camelCase** for variables, functions, and stores
- Import paths use relative paths: `import { useCartStore } from '../stores/cartStore'`
- Destructure reactive state: `const { items, total } = storeToRefs(cartStore)`
- Use async/await for API calls

### Stores (Pinia)
- Store files follow **camelCase**: `cartStore.js`, `wishlistStore.js`
- Define store with `defineStore()`
- Use `ref()` for state, `computed()` for getters
- Define actions for API calls and mutations
- Export store as default

### API Integration
- Base URL from environment: `import.meta.env.VITE_API_BASE_URL`
- Use Axios for HTTP requests
- Create reusable API utility functions in `api/` directory
- Handle errors with try/catch
- Store auth token in localStorage/ Pinia store

### CSS/Styling
- Follow **BEM-like** naming: `.header`, `.footer`, `.product-card`
- Use **Bootstrap 5** classes for layout and components
- Custom styles in `<style scoped>` within components
- Avoid inline styles

### File Structure
- One component per file
- Co-locate related files (component + styles + tests)
- Use index.js for barrel exports when needed

---

## Development Workflow

### 1. Environment Setup
```bash
cd vue-app
npm install
cp .env.example .env
# Edit .env with API URLs
```

### 2. Development
```bash
npm run dev  # Starts dev server at http://localhost:5173
```

### 3. Making API Changes
1. Check Swagger docs at `http://localhost:3000/swagger-ui`
2. Update/create Pinia stores to match API
3. Update/create API utility functions
4. Use stores in components

### 4. Adding a New CMS Feature
1. Identify API endpoint in `api-docs.json` or Swagger
2. Create/update Pinia store in `src/stores/`
3. Create reusable components in `src/components/`
4. Create page component in `src/pages/`
5. Add route in `src/router/index.js`

### 5. Styling
- Use Bootstrap 5 grid system: `container`, `row`, `col-*`
- Use Bootstrap utilities: `d-flex`, `justify-content-center`, etc.
- Custom styles in `<style scoped>` or global styles
- Follow mobile-first responsive design

### 6. Routing
- Routes defined in `src/router/index.js`
- Use lazy loading: `() => import('../pages/PageName.vue')`
- Route params: `:id`, `:slug`
- Route meta for auth guards

---

## Key Implementation Patterns

### Store Pattern
```javascript
// stores/exampleStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useExampleStore = defineStore('example', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  
  async function fetchAll() {
    loading.value = true
    try {
      const response = await axios.get(`${API_BASE}/endpoint`)
      items.value = response.data
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  
  return { items, loading, error, fetchAll }
})
```

### Component Pattern
```vue
<!-- components/ExampleComponent.vue -->
<script setup>
import { useExampleStore } from '../stores/exampleStore'
import { onMounted } from 'vue'

const store = useExampleStore()
const { items, loading } = storeToRefs(store)

onMounted(() => {
  store.fetchAll()
})
</script>

<template>
  <div class="example-component">
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="item in items" :key="item.id">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.example-component {
  padding: 2rem;
}
</style>
```

### API Request Pattern
```javascript
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL

async function fetchProducts(params) {
  try {
    const response = await axios.get(`${API_BASE}/products`, { params })
    return response.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw error
  }
}
```

---

## CMS Integration Notes

### Headless CMS Features
The ERP backend at `http://localhost:3000` provides full CMS capabilities:
- **Product Management**: CRUD operations, variants, media, stock levels
- **Category Hierarchy**: Nested categories with parent-child relationships
- **Banners/Carousels**: Date-ranged banner management with priority ordering
- **Content Management**: Legal policies, site settings, notifications
- **Order Management**: Full order lifecycle and tracking
- **User Management**: Roles, permissions, activation/deactivation

### Authentication Flow
1. Login with `POST /auth/login` (email/password)
2. Receive `access_token` and `refresh_token`
3. Store tokens in Pinia/auth store
4. Include in headers: `Authorization: Bearer {access_token}`
5. Refresh token when expired

### Image/File Handling
- Upload endpoint: `POST /upload?subFolder=general`
- Upload variant media: `POST /upload/variant/{variantId}`
- Public access: `http://localhost:3000/uploads/...`
- Store returned URLs in product media fields

---

## Important Notes

1. **Environment Variables**: Never commit `.env` file. Use `.env.example` as template.
2. **API Changes**: Always check `api-docs.json` for current API specs.
3. **Error Handling**: Implement proper error boundaries and user-friendly error messages.
4. **Responsive Design**: Test on mobile, tablet, and desktop viewports.
5. **Performance**: Use lazy loading for routes and images. Implement code splitting.
6. **State Management**: Use Pinia stores for shared state (cart, wishlist, auth).
7. **Form Validation**: Validate inputs both client and server-side.
8. **SEO**: Use proper meta tags and semantic HTML.

---

## Resources

- **API Documentation**: `http://localhost:3000/swagger-ui/index.html`
- **OpenAPI Spec**: `vue-app/api-docs.json`
- **Vue 3 Docs**: https://vuejs.org/guide/introduction.html
- **Pinia Docs**: https://pinia.vuejs.org/
- **Bootstrap 5 Docs**: https://getbootstrap.com/docs/5.3/

---

*This file is generated for Claude Code agents working on the JewelTime UI project. Refer to this document for architectural decisions, API specifications, and coding standards.*
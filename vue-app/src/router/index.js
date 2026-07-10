import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import PolicyPage from '../pages/PolicyPage.vue'
import ProductList from '../pages/ProductList.vue'
import ProductDetail from '../pages/ProductDetail.vue'
import Cart from '../pages/Cart.vue'
import Checkout from '../pages/Checkout.vue'
import Blog from '../pages/Blog.vue'
import BlogDetail from '../pages/BlogDetail.vue'
import About from '../pages/About.vue'
import Contact from '../pages/Contact.vue'
import SignIn from '../pages/SignIn.vue'
import Register from '../pages/Register.vue'
import RegisterUser from '../pages/RegisterUser.vue'
import RegisterB2B from '../pages/RegisterB2B.vue'
import RegisterSuccess from '../pages/RegisterSuccess.vue'
import ActivateAccount from '../pages/ActivateAccount.vue'
import AuthCallback from '../pages/AuthCallback.vue'
import Wishlist from '../pages/Wishlist.vue'
import Dashboard from '../pages/Dashboard.vue'
import Profile from '../pages/Profile.vue'
import Orders from '../pages/Orders.vue'
import OrderDetail from '../pages/OrderDetail.vue'
import Invoices from '../pages/Invoices.vue'
import InvoiceDetail from '../pages/InvoiceDetail.vue'
import OrderSuccess from '../pages/OrderSuccess.vue'
import PaymentSuccess from '../pages/PaymentSuccess.vue'
import B2BProductList from '../pages/B2BProductList.vue'
import B2BProductDetail from '../pages/B2BProductDetail.vue'
import B2BQuoteCart from '../pages/B2BQuoteCart.vue'
import B2BQuoteConfirmation from '../pages/B2BQuoteConfirmation.vue'
import B2BMyQuotes from '../pages/B2BMyQuotes.vue'
import B2BQuoteDetail from '../pages/B2BQuoteDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductList
  },
  {
    path: '/products/:id/:slug',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: ProductList
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/blog/:slug',
    name: 'BlogDetail',
    component: BlogDetail
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/register/user',
    name: 'RegisterUser',
    component: RegisterUser
  },
  {
    path: '/register/b2b',
    name: 'RegisterB2B',
    component: RegisterB2B
  },
  {
    path: '/register/success',
    name: 'RegisterSuccess',
    component: RegisterSuccess
  },
  {
    path: '/activate-account',
    name: 'ActivateAccount',
    component: ActivateAccount
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: AuthCallback
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: OrderDetail
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: Invoices
  },
  {
    path: '/invoices/:id',
    name: 'InvoiceDetail',
    component: InvoiceDetail
  },
  {
    path: '/order-success/:id',
    name: 'OrderSuccess',
    component: OrderSuccess
  },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: PaymentSuccess
  },
  {
    path: '/policies/:slug',
    name: 'Policy',
    component: PolicyPage
  },
  // B2B Quote-to-Order Routes
  {
    path: '/b2b/products',
    name: 'B2BProducts',
    component: B2BProductList,
    meta: { requiresAuth: true, roles: ['B2B_USER'] }
  },
  {
    path: '/b2b/products/:id/:slug?',
    name: 'B2BProductDetail',
    component: B2BProductDetail,
    meta: { requiresAuth: true, roles: ['B2B_USER'] }
  },
  {
    path: '/b2b/quote-cart',
    name: 'B2BQuoteCart',
    component: B2BQuoteCart,
    meta: { requiresAuth: true, roles: ['B2B_USER'] }
  },
  {
    path: '/b2b/quote-confirmation',
    name: 'B2BQuoteConfirmation',
    component: B2BQuoteConfirmation,
    meta: { requiresAuth: true, roles: ['B2B_USER'] }
  },
  {
    path: '/b2b/quotes',
    name: 'B2BMyQuotes',
    component: B2BMyQuotes,
    meta: { requiresAuth: true, roles: ['B2B_USER'] }
  },
  {
    path: '/b2b/quotes/:id',
    name: 'B2BQuoteDetail',
    component: B2BQuoteDetail,
    meta: { requiresAuth: true, roles: ['B2B_USER'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
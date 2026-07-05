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
import AuthCallback from '../pages/AuthCallback.vue'
import Wishlist from '../pages/Wishlist.vue'
import Dashboard from '../pages/Dashboard.vue'
import Profile from '../pages/Profile.vue'

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
    path: '/policies/:slug',
    name: 'Policy',
    component: PolicyPage
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
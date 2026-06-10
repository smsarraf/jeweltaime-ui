<template>
  <div class="product-card">
    <div class="product-image-wrapper">
      <router-link :to="`/products/${product.id}`" class="product-image-link">
        <img :src="product.image" :alt="product.name" class="product-image">
      </router-link>
      <span v-if="product.onSale" class="sale-badge">SALE</span>
      <span v-if="product.isBestSeller" class="bestseller-badge">BEST SELLER</span>
      <div class="product-actions">
        <button @click="addToWishlist" class="action-btn" title="Add to Wishlist">
          <i class="fas fa-heart"></i>
        </button>
        <button @click="quickView" class="action-btn" title="Quick View">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
    <div class="product-details">
      <p class="product-category">{{ getCategoryName() }}</p>
      <h3 class="product-name">
        <router-link :to="`/products/${product.id}`">{{ product.name }}</router-link>
      </h3>
      <div class="product-price">
        <span v-if="product.onSale" class="sale-price">£{{ product.salePrice }}</span>
        <span :class="{ original: product.onSale }" class="regular-price">£{{ product.price }}</span>
      </div>
      <button @click="addToCart" class="btn-add-cart">ADD TO CART</button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useProductStore } from '@/stores/productStore'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const productStore = useProductStore()

const addToCart = () => {
  cartStore.addItem(props.product)
  alert('Product added to cart!')
}

const addToWishlist = () => {
  alert('Added to wishlist!')
}

const quickView = () => {
  alert('Quick view feature coming soon!')
}

const getCategoryName = () => {
  const category = productStore.categories.find(c => c.id === props.product.category)
  return category ? category.name : 'Product'
}
</script>

<style scoped>
.product-card {
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image-wrapper {
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  aspect-ratio: 1;
}

.product-image-link {
  display: block;
  width: 100%;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image-wrapper:hover .product-image {
  transform: scale(1.05);
}

.sale-badge,
.bestseller-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
}

.sale-badge {
  background-color: #e74c3c;
}

.bestseller-badge {
  background-color: #f39c12;
  left: auto;
  right: 10px;
}

.product-actions {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-image-wrapper:hover .product-actions {
  opacity: 1;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, color 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  background-color: #222;
  color: #fff;
}

.product-details {
  padding: 15px;
  text-align: center;
}

.product-category {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.product-name {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  font-weight: 300;
  line-height: 1.4;
}

.product-name a {
  color: #222;
  text-decoration: none;
}

.product-name a:hover {
  text-decoration: underline;
}

.product-price {
  margin-bottom: 12px;
}

.sale-price {
  color: #e74c3c;
  font-weight: 600;
  margin-right: 8px;
}

.regular-price {
  font-weight: 500;
}

.regular-price.original {
  text-decoration: line-through;
  color: #999;
}

.btn-add-cart {
  width: 100%;
  padding: 10px;
  background-color: #222;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: background-color 0.3s ease;
}

.btn-add-cart:hover {
  background-color: #444;
}
</style>

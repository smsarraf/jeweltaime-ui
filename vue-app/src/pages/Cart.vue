<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Cart</li>
        </ol>
      </nav>
    </div>
    <section class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="mnHding fw-normal mb-7 mb-sm-14">Shopping Cart</h1>
          </div>
          <div class="col-12 col-xl-9">
            <!-- Desktop Table View -->
            <div v-if="cartStore.items.length > 0" class="table-responsive d-none d-md-block pe-xl-14">
              <table class="table align-middle carttable mb-10">
                <thead>
                  <tr>
                    <th class="col col01 text-uppercase fw-normal ps-15">Product</th>
                    <th class="col col02 text-uppercase fw-normal">Price</th>
                    <th class="col col03 text-uppercase fw-normal">Quantity</th>
                    <th class="col col04 text-uppercase fw-normal">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cartStore.items" :key="getCartItemKey(item)">
                    <td class="d-flex align-items-center ps-4 pt-4 pb-4">
                      <button class="btn btn-sm btnicon p-0 me-6" @click="removeItem(item)"><i class="fa-regular fa-circle-xmark"></i></button>
                      <img :src="item.image || 'https://placehold.co/80x80'" class="img-thumbnail border-0 p-0 me-4 rounded-0 tb-img" alt="Product Image" STYLE="height: 80px; width: 80px;">
                      <div>
                        <span class="tb-heading d-block fw-light">{{ item.name }}</span>
                        <small class="d-block" :class="stockMessageClass(item)">{{ stockMessage(item) }}</small>
                        <small v-if="item.giftBoxId || item.giftCardId || item.giftNote" class="d-block text-muted">
                          <span v-if="item.giftBoxId">Gift Box: {{ item.giftBoxName || `#${item.giftBoxId}` }}</span>
                          <span v-if="item.giftCardId" class="ms-2">Gift Card: {{ item.giftCardName || `#${item.giftCardId}` }}</span>
                          <span v-if="item.giftNote" class="d-block">Note: {{ item.giftNote }}</span>
                        </small>
                      </div>
                    </td>
                    <td class="tb-price fw-normal">{{ currencyStore.formatPrice(item.price) }}</td>
                    <td>
                      <div class="input-group position-relative">
                        <button class="btn btn-minus border-0" @click="updateQuantity(item, item.quantity - 1)"><i class="fa-solid fa-minus"></i></button>
                        <input type="text" class="form-control text-center fw-light px-6" min="1" :value="item.quantity" readonly>
                        <button class="btn btn-plus border-0" @click="updateQuantity(item, item.quantity + 1)"><i class="fa-regular fa-plus"></i></button>
                      </div>
                    </td>
                    <td class="tb-price fw-normal">
                      {{ currencyStore.formatPrice(getItemLineTotal(item)) }}
                      <small v-if="getItemAddonUnit(item) > 0" class="d-block text-muted">
                        Includes add-ons: {{ currencyStore.formatPrice(getItemAddonUnit(item) * item.quantity) }}
                      </small>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td class="p-0 border-0" colspan="4">
                      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 pt-5">
                        <form class="couponform d-flex" @submit.prevent="applyCoupon">
                          <input type="text" class="form-control fw-light me-2" v-model="couponCode" placeholder="Coupon Code">
                          <button type="submit" class="btn btn-outline-dark">Apply Coupon</button>
                        </form>
                        <button class="btn btn-dark btncart" @click="cartStore.clearCart()">Clear Cart</button>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Mobile Card View -->
            <div v-if="cartStore.items.length > 0" class="d-md-none mb-4">
              <div v-for="item in cartStore.items" :key="getCartItemKey(item)" class="cart-item-card">
                <img :src="item.image || 'https://placehold.co/80x80'" :alt="item.name">
                <div class="item-info">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-meta">
                    <span :class="stockMessageClass(item)">{{ stockMessage(item) }}</span>
                    <span v-if="item.giftBoxId || item.giftCardId"> · Gift wrapped</span>
                  </div>
                  <div class="item-price">{{ currencyStore.formatPrice(getItemLineTotal(item)) }}</div>
                  <div class="qty-control">
                    <button @click="updateQuantity(item, item.quantity - 1)">−</button>
                    <input type="text" :value="item.quantity" readonly>
                    <button @click="updateQuantity(item, item.quantity + 1)">+</button>
                  </div>
                </div>
                <button class="remove-btn" @click="removeItem(item)">✕</button>
              </div>
              <div class="d-flex gap-2 mt-4">
                <form class="d-flex flex-grow-1" @submit.prevent="applyCoupon">
                  <input type="text" class="form-control" v-model="couponCode" placeholder="Coupon Code">
                  <button type="submit" class="btn btn-dark ms-2">Apply</button>
                </form>
              </div>
              <button class="btn btn-outline-dark w-100 mt-3" @click="cartStore.clearCart()">Clear Cart</button>
            </div>

            <div v-if="cartStore.items.length === 0" class="text-center py-10">
              <h3 class="mb-4">Your cart is currently empty.</h3>
              <router-link to="/products" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Return to Shop</router-link>
            </div>
          </div>
          <div class="col-12 col-xl-3">
            <div class="ms-xl-n8">
              <div class="cartSide border py-5 px-2 px-md-6">
                <h5 class="cartHeading fw-medium mb-4">Cart Totals</h5>
                <div class="d-flex justify-content-between mb-2">
                  <span class="subheading fw-normal">Subtotal</span>
                  <strong class="Hprice fw-normal">{{ currencyStore.formatPrice(cartStore.totalPrice) }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2" v-if="cartStore.addonsTotal > 0">
                  <span class="subheading fw-normal">Add-ons</span>
                  <strong class="Hprice fw-normal">{{ currencyStore.formatPrice(cartStore.addonsTotal) }}</strong>
                </div>
                <hr class="mb-2">
                <div class="pt-1 mb-3">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="fa-solid fa-truck-fast text-dark" style="font-size:1.1rem"></i>
                    <span class="small fw-normal">Shipping & taxes calculated at checkout</span>
                  </div>
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="fa-solid fa-shield-halved text-dark" style="font-size:1.1rem"></i>
                    <span class="small fw-normal">Secure checkout with SSL encryption</span>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <i class="fa-solid fa-rotate-left text-dark" style="font-size:1.1rem"></i>
                    <span class="small fw-normal">Easy 30-day returns & exchanges</span>
                  </div>
                </div>
                <hr class="mb-2">
                <div class="d-flex justify-content-between mb-4">
                  <span class="subheading fw-normal">Total</span>
                  <strong class="Hprice fw-medium">{{ currencyStore.formatPrice(cartTotalWithShipping) }}</strong>
                </div>
                <router-link to="/checkout" class="btn btnP btn-dark fw-medium w-100 mb-1">Proceed to Checkout</router-link>
              </div>
            </div>
          </div>
        </div>
        <!-- Coupon message -->
        <div v-if="couponMessage" class="row mt-3">
          <div class="col-12">
            <div :class="['alert', couponMessageType === 'success' ? 'alert-success' : 'alert-warning', 'rounded-0']">
              {{ couponMessage }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useCurrencyStore } from '../stores/currencyStore'
import axios from 'axios'

const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const couponCode = ref('')
const couponMessage = ref('')
const couponMessageType = ref('')

const cartTotalWithShipping = computed(() => cartStore.totalPrice + cartStore.addonsTotal)

function getCartItemKey(item) {
  return cartStore.getItemKey(item)
}

function removeItem(item) {
  cartStore.removeFromCart(item.id, item.variantId || null)
}

function updateQuantity(item, newQty) {
  if (newQty < 1) return
  cartStore.updateQuantity(item.id, newQty)
}

function getItemLineTotal(item) {
  const addons = Number(item.giftBoxPriceUsd || 0) + Number(item.giftCardPrice || 0)
  return (Number(item.price || 0) + addons) * (item.quantity || 1)
}

function getItemAddonUnit(item) {
  return Number(item.giftBoxPriceUsd || 0) + Number(item.giftCardPrice || 0)
}

function stockMessage(item) {
  if (item.trackInventory === false) return 'Made to order'
  if (item.allowBackorder) return item.availableStock > 0 ? 'In stock' : 'Pre-Order'
  return item.availableStock > 0 ? 'In stock' : 'Out of stock'
}

function stockMessageClass(item) {
  if (item.trackInventory === false) return 'text-primary'
  if (item.allowBackorder) return 'text-warning'
  return item.availableStock > 0 ? 'text-success' : 'text-danger'
}

async function applyCoupon() {
  couponMessage.value = ''
  if (!couponCode.value.trim()) return
  try {
    const res = await axios.post(`${API_BASE}/api/v1/vouchers/validate`, null, {
      params: { code: couponCode.value.trim(), orderTotal: cartStore.totalPrice + cartStore.addonsTotal }
    })
    couponMessage.value = 'Coupon applied successfully!'
    couponMessageType.value = 'success'
  } catch (e) {
    couponMessage.value = e.response?.data?.message || 'Invalid coupon code.'
    couponMessageType.value = 'danger'
  }
}
</script>

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
            <div v-if="cartStore.items.length > 0" class="table-responsive pe-xl-14">
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
                  <tr v-for="item in cartStore.items" :key="item.id">
                    <td class="d-flex align-items-center ps-4 pt-4 pb-4">
                      <button class="btn btn-sm btnicon p-0 me-6" @click="cartStore.removeFromCart(item.id)"><i class="fa-regular fa-circle-xmark"></i></button>
                      <img :src="item.image || 'https://placehold.co/80x80'" class="img-thumbnail border-0 p-0 me-4 rounded-0 tb-img" alt="Product Image" STYLE="height: 80px; width: 80px;">
                      <span class="tb-heading d-block fw-light">{{ item.name }}</span>
                    </td>
                    <td class="tb-price fw-normal">{{ currencyStore.formatPrice(item.price) }}</td>
                    <td>
                      <div class="input-group position-relative">
                        <button class="btn btn-minus border-0" @click="updateQuantity(item.id, item.quantity - 1)"><i class="fa-solid fa-minus"></i></button>
                        <input type="text" class="form-control text-center fw-light px-6" min="1" :value="item.quantity" readonly>
                        <button class="btn btn-plus border-0" @click="updateQuantity(item.id, item.quantity + 1)"><i class="fa-regular fa-plus"></i></button>
                      </div>
                    </td>
                    <td class="tb-price fw-normal">{{ currencyStore.formatPrice(item.price * item.quantity) }}</td>
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
            <div v-else class="text-center py-10">
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
                <hr class="mb-2">
                <div class="pt-1 mb-3">
                  <div class="d-flex justify-content-between align-items-start flex-wrap">
                    <span class="Shding fw-normal me-2">Shipping</span>
                    <div class="text-end pe-6">
                      <div class="form-check text-start">
                        <input class="form-check-input" type="radio" name="shippingOption" id="freeShipping" value="free" v-model="shippingOption" @change="updateShipping">
                        <label class="form-check-label" for="freeShipping">Free Shipping</label>
                      </div>
                      <div class="form-check text-start mb-1">
                        <input class="form-check-input" type="radio" name="shippingOption" id="flatRate" value="flat" v-model="shippingOption" @change="updateShipping">
                        <label class="form-check-label" for="flatRate">Flat Rate: <span class="clr fw-normal ps-1">{{ currencyStore.formatPrice(10.00) }}</span></label>
                      </div>
                      <a class="d-inline-flex align-items-center text-decoration-none small addbtn fw-normal" data-bs-toggle="collapse" href="#addressCollapse" role="button" aria-expanded="true" aria-controls="addressCollapse">
                        <i class="fa-solid fa-location-pin me-1"></i> Change Address <i class="fa-solid fa-angle-down ms-1"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="collapse mt-3 show" id="addressCollapse">
                    <select class="form-select fw-light mb-2 rounded-0" v-model="shippingCountry">
                      <option value="" disabled>Select Country</option>
                      <option value="Germany">Germany</option>
                      <option value="UK">United Kingdom</option>
                      <option value="USA">USA</option>
                    </select>
                    <select class="form-select fw-light mb-2 rounded-0" v-model="shippingState">
                      <option value="" disabled>Select an option...</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                    </select>
                    <input type="text" class="form-control fw-light mb-2" v-model="shippingZip" placeholder="Postcode / ZIP">
                    <button class="btn btnTotl btn-outline-dark fw-medium mb-2" @click="updateTotals">Update Totals</button>
                  </div>
                </div>
                <hr class="mb-4">
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

const cartStore = useCartStore()
const currencyStore = useCurrencyStore()

// Coupon code
const couponCode = ref('')
const couponMessage = ref('')
const couponMessageType = ref('success')
const discountAmount = ref(0)

// Shipping
const shippingOption = ref('free')
const shippingCost = ref(0)
const shippingCountry = ref('')
const shippingState = ref('')
const shippingZip = ref('')

const cartTotalWithShipping = computed(() => {
  return Math.max(0, cartStore.totalPrice + shippingCost.value - discountAmount.value)
})

const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    couponMessage.value = 'Please enter a coupon code.'
    couponMessageType.value = 'warning'
    return
  }
  // Demo coupon: FREE15FIRST gives 15% off
  if (couponCode.value.trim().toUpperCase() === 'FREE15FIRST') {
    discountAmount.value = cartStore.totalPrice * 0.15
    couponMessage.value = `Coupon applied! You saved ${currencyStore.formatPrice(discountAmount.value)}.`
    couponMessageType.value = 'success'
  } else {
    couponMessage.value = 'Invalid coupon code. Please try again.'
    couponMessageType.value = 'warning'
  }
}

const updateShipping = () => {
  shippingCost.value = shippingOption.value === 'flat' ? 10.00 : 0
}

const updateTotals = () => {
  couponMessage.value = 'Shipping address updated.'
  couponMessageType.value = 'success'
}

const updateQuantity = (id, newQuantity) => {
  if (newQuantity > 0) {
    cartStore.updateQuantity(id, newQuantity)
  }
}
</script>
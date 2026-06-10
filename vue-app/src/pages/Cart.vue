<template>
  <main>
      <header class="pageMainHead d-flex position-relative bgCover w-100 text-white" style="background-image: url(https://placehold.co/1920x300);">
          <div class="align-self-center text-center w-100">
              <div class="container">
                  <h1 class="pageHeading mb-3">Shopping Cart</h1>
                  <nav aria-label="breadcrumb">
                      <ol class="breadcrumb d-flex justify-content-center mb-0">
                          <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                          <li class="breadcrumb-item active" aria-current="page">Cart</li>
                      </ol>
                  </nav>
              </div>
          </div>
      </header>

      <section class="cartPageSection py-8 py-lg-12">
          <div class="container">
              <div class="row" v-if="cartStore.items.length > 0">
                  <div class="col-12 col-lg-8 mb-6 mb-lg-0">
                      <div class="table-responsive cartTableWrap">
                          <table class="table text-nowrap">
                              <thead>
                                  <tr>
                                      <th scope="col" class="fw-normal">Product</th>
                                      <th scope="col" class="fw-normal">Price</th>
                                      <th scope="col" class="fw-normal">Quantity</th>
                                      <th scope="col" class="fw-normal">Total</th>
                                      <th scope="col"></th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="item in cartStore.items" :key="item.id">
                                      <td>
                                          <div class="d-flex align-items-center">
                                              <img :src="item.image" class="img-fluid me-3" style="width: 80px;" alt="product">
                                              <h5 class="mb-0 fw-normal"><router-link :to="`/products/${item.id}`" class="text-decoration-none text-dark">{{ item.name }}</router-link></h5>
                                          </div>
                                      </td>
                                      <td class="align-middle">£{{ item.price.toFixed(2) }}</td>
                                      <td class="align-middle">
                                          <div class="quantity-control d-flex border rounded" style="width: 120px;">
                                              <button class="btn btn-sm px-3" @click="updateQuantity(item.id, item.quantity - 1)">-</button>
                                              <input type="text" class="form-control form-control-sm text-center border-0" :value="item.quantity" readonly>
                                              <button class="btn btn-sm px-3" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
                                          </div>
                                      </td>
                                      <td class="align-middle">£{{ (item.price * item.quantity).toFixed(2) }}</td>
                                      <td class="align-middle">
                                          <button @click="cartStore.removeFromCart(item.id)" class="btn text-danger p-0"><i class="fa-solid fa-trash-can"></i></button>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                      <div class="d-flex justify-content-between mt-4">
                          <router-link to="/products" class="btn btn-outline-dark text-uppercase fw-medium">Continue Shopping</router-link>
                          <button class="btn btn-outline-dark text-uppercase fw-medium" @click="cartStore.clearCart()">Clear Cart</button>
                      </div>
                  </div>
                  <div class="col-12 col-lg-4">
                      <div class="cartTotalsBlock p-4 p-md-6 border">
                          <h3 class="mb-4 fw-normal">Cart Totals</h3>
                          <div class="d-flex justify-content-between mb-3 pb-3 border-bottom">
                              <span>Subtotal</span>
                              <span>£{{ cartStore.totalPrice.toFixed(2) }}</span>
                          </div>
                          <div class="d-flex justify-content-between mb-4 pb-3 border-bottom">
                              <span>Shipping</span>
                              <span>Free Shipping</span>
                          </div>
                          <div class="d-flex justify-content-between mb-5 fw-medium fs-5">
                              <span>Total</span>
                              <span>£{{ cartStore.totalPrice.toFixed(2) }}</span>
                          </div>
                          <router-link to="/checkout" class="btn btn-dark w-100 py-3 text-uppercase fw-medium">Proceed to Checkout</router-link>
                      </div>
                  </div>
              </div>
              <div v-else class="text-center py-10">
                  <h3 class="mb-4">Your cart is currently empty.</h3>
                  <router-link to="/products" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Return to Shop</router-link>
              </div>
          </div>
      </section>
  </main>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore'

const cartStore = useCartStore()

const updateQuantity = (id, newQuantity) => {
  if (newQuantity > 0) {
      cartStore.updateQuantity(id, newQuantity)
  }
}
</script>

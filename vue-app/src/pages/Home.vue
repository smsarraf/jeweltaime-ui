<template>
  <main>
      <section class="introBlock position-relative overflow-hidden w-100">
          <div class="container-fluid px-lgwd-18">
              <div class="ibSliderII">
                  <div>
                      <article class="ibsColumn ibsColII d-md-flex justify-content-md-center bgclr">
                          <div class="col-12 col-md-5 py-5 my-md-auto pddngS">
                              <div class="ahAlign">
                                  <h1 class="hhHeadingI fw-normal mb-1">Limited Edition <br>Cage Rings</h1>
                                  <span class="subHeading d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">World-class diamond</span>
                                  <strong class="subTitle d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">Mother's Day Special</strong>
                                  <router-link to="/products" class="btn btnThemeOutlined py-2 py-lg-3 px-6 px-lg-9" data-hover="Shop Now">
                                      <span class="btnText">Shop Now</span>
                                  </router-link>
                              </div>
                          </div>
                          <div class="col-12 col-md-7 imgHolder iMgII">
                              <img src="https://placehold.co/1000x600" class="w-100" alt="image description">
                          </div>
                      </article>
                  </div>
              </div>
          </div>
      </section>
      
      <section class="categoriesBlock position-relative w-100 overflow-hidden pt-4 pt-xl-14">
          <div class="container">
              <header class="headingHead text-center mb-8">
                  <h2 class="hhHeading fw-normal">Popular Categories</h2>
              </header>
              <div class="colsHolder d-flex flex-wrap justify-content-center">
                  <div class="chCol d-flex">
                      <router-link to="/category/necklaces" class="catColumn d-block w-100 text-center">
                          <div class="imgHolder mx-auto mb-5">
                              <img src="https://placehold.co/185x185" class="w-100 h-100 object-fit-cover" alt="image description">
                          </div>
                          <h3 class="ctHeading d-inline-block text-uppercase align-top">NECKLaCES</h3>
                      </router-link>
                  </div>
                  <div class="chCol d-flex">
                      <router-link to="/category/rings" class="catColumn d-block w-100 text-center">
                          <div class="imgHolder mx-auto mb-5">
                              <img src="https://placehold.co/185x185" class="w-100 h-100 object-fit-cover" alt="image description">
                          </div>
                          <h3 class="ctHeading d-inline-block text-uppercase align-top">RINGS</h3>
                      </router-link>
                  </div>
                  <div class="chCol d-flex">
                      <router-link to="/category/bracelets" class="catColumn d-block w-100 text-center">
                          <div class="imgHolder mx-auto mb-5">
                              <img src="https://placehold.co/185x185" class="w-100 h-100 object-fit-cover" alt="image description">
                          </div>
                          <h3 class="ctHeading d-inline-block text-uppercase align-top">BRACELETS</h3>
                      </router-link>
                  </div>
                  <div class="chCol d-flex">
                      <router-link to="/category/earrings" class="catColumn d-block w-100 text-center">
                          <div class="imgHolder mx-auto mb-5">
                              <img src="https://placehold.co/185x185" class="w-100 h-100 object-fit-cover" alt="image description">
                          </div>
                          <h3 class="ctHeading d-inline-block text-uppercase align-top">EARRINGS</h3>
                      </router-link>
                  </div>
                  <div class="chCol d-flex">
                      <router-link to="/category/charms" class="catColumn d-block w-100 text-center">
                          <div class="imgHolder mx-auto mb-5">
                              <img src="https://placehold.co/185x185" class="w-100 h-100 object-fit-cover" alt="image description">
                          </div>
                          <h3 class="ctHeading d-inline-block text-uppercase align-top">CHARMS & DANGLES</h3>
                      </router-link>
                  </div>
              </div>
          </div>
      </section>

      <aside class="badgerIIAsideBlock text-center pt-3">
          <div class="container">
              <div class="row">
                  <div class="col-12">
                      <div class="babWrapper d-flex align-items-center flex-wrap justify-content-center py-3 px-2">
                          <i class="fa-solid fa-tag fa-flip-horizontal babIcn mb-2 mb-md-0 me-md-3"></i>
                          <h3 class="mb-0 babHeading fw-light mb-2 mb-md-0 me-md-3">Super discount for your first purchase</h3>
                          <a href="javascript:void(0);" class="btn text-uppercase fw-normal mb-2 mb-md-0 me-md-3 py-2">FREE15FIRST</a>
                          <p class="mb-0">Use discount code in checkout!</p>
                      </div>
                  </div>
              </div>
          </div>
      </aside>

      <section class="collectionBlock position-relative w-100 overflow-hidden py-6 py-md-10 py-lg-15">
          <div class="container">
              <header class="headingHead text-center mb-9">
                  <h2 class="position-relative fw-normal hhHeading patternActive d-flex justify-content-center align-items-center gap-4 mb-4">Featured Products</h2>
              </header>
              <ul class="list-unstyled cbFiltersList gap-2 gap-md-5 d-flex isoFiltersList flex-wrap justify-content-center">
                                          <li class="active">
                                              <a href="javascript:void(0);">New Arrivals</a>
                                          </li>
                                          <li class="">
                                              <a href="javascript:void(0);" data-filter=".popular">Most Popular</a>
                                          </li>
                                          <li class="">
                                              <a href="javascript:void(0);" data-filter=".bestSeller">Best Seller</a>
                                          </li>
                                      </ul>
              <div class="row d-block isoContentHolder">
                  <div class="col-12 col-sm-6 col-xl-3 isoCol bestSeller popular mb-5" v-for="product in featuredProducts" :key="product.id">
                      <ProductCard :product="product" />
                  </div>
              </div>
          </div>
      </section>

      <aside class="featuresBlock text-center w-100 position-relative py-9">
          <div class="container">
              <ul class="list-unstyled d-flex flex-wrap justify-content-around gap-1 mb-0">
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-01.svg" width="37" height="30" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">Free Shipping</h3>
                      <h4 class="fbbSubheading fw-light mb-0">For all orders over $100</h4>
                  </li>
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-02.svg" width="37" height="33" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">30 Days Return</h3>
                      <h4 class="fbbSubheading fw-light mb-0">For an Exchange Product</h4>
                  </li>
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-03.svg" width="37" height="29" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">Secured Payment</h3>
                      <h4 class="fbbSubheading fw-light mb-0">Payment Cards Accepted</h4>
                  </li>
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-04.svg" width="37" height="37" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">Support 24/7</h3>
                      <h4 class="fbbSubheading fw-light mb-0">Contact us Anytime.</h4>
                  </li>
              </ul>
          </div>
      </aside>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'

const featuredProducts = ref([
  {
      id: 1,
      name: 'Cross Stripes & Stone Bracelet',
      category: 'BRACELETS',
      price: 169.00,
      image: 'https://placehold.co/305x305'
  },
  {
      id: 2,
      name: 'Echoes Necklace Extension Piece',
      category: 'CHARM AND DANGLES',
      price: 199.00,
      image: 'https://placehold.co/305x305'
  },
  {
      id: 3,
      name: 'Four-Leaf Clover Rings',
      category: 'RINGS',
      price: 99.00,
      originalPrice: 129.00,
      sale: true,
      image: 'https://placehold.co/305x305'
  },
  {
      id: 4,
      name: 'Cross of Light Pendant',
      category: 'NECKLACES',
      price: 79.00,
      image: 'https://placehold.co/305x305'
  }
])
</script>

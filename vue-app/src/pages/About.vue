<template>
  <main>
      <div class="container pt-4">
          <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                      <router-link to="/" class="text-decoration-none">Home</router-link>
                  </li>
                  <li class="breadcrumb-item">
                      <a href="javascript:void(0);" class="text-decoration-none">Pages</a>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">About Us</li>
              </ol>
          </nav>
      </div>
      <article class="visualBlock position-relative w-100 overflow-hidden pt-7 pb-16">
          <div class="container">
              <div class="row">
                  <div class="col-12 col-md-6 col-lg-4 mb-5 mb-md-0">
                      <header class="headingHead pt-xl-11 pe-xl-11">
                          <h1 class="hhHeading HDii fw-normal mb-6">About Our Online Jewellery Store</h1>
                          <p class="phgra mb-4 mb-md-9">{{ siteSettings.longDescription || 'At JewelT\'Aime, we believe every piece of jewellery tells a story. Our curated collection blends timeless elegance with modern craftsmanship, delivered with unwavering quality and customer satisfaction at every step.' }}</p>
                          <router-link to="/contact" class="btn btnThemeOutlined fw-normal px-7 py-2">Contact Us</router-link>
                      </header>
                  </div>
                  <div class="col-12 col-md-6 col-lg-4 ps-md-8 mb-5 mb-md-0">
                      <img src="https://placehold.co/385x500" alt="image description" class="img-fluid">
                  </div>
                  <div class="col-12 col-md-6 col-lg-4">
                      <ul class="list-unstyled lbList d-flex flex-column gap-9 mb-0 pt-xl-11 ps-2">
                          <li>
                              <h2 class="abtHD fw-normal">Our Mission</h2>
                              <p>To bring you exquisite jewellery that celebrates life's precious moments. Every piece is thoughtfully sourced and crafted to ensure exceptional quality, timeless design, and complete customer delight — because you deserve nothing less than the finest.</p>
                          </li>
                          <li>
                              <h2 class="abtHD fw-normal">Our Vision</h2>
                              <p>To become the world's most trusted online destination for fine jewellery — where artistry meets authenticity, where every customer feels valued, and where quality with satisfaction isn't just a promise, it's our foundation.</p>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </article>
      <section class="countersection py-6 py-md-8 py-lg-22 text-center">
          <div class="container">
              <div class="row">
                  <div class="col-12 col-md-6 col-lg-3 mb-5 mb-lg-0">
                      <strong class="counter fw-normal d-block mb-4">41k+</strong>
                      <span class="d-block title">Happy Customer</span>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3 mb-5 mb-lg-0">
                      <strong class="counter fw-normal d-block mb-4">21+</strong>
                      <span class="d-block title">Years in Business</span>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3 mb-5 mb-md-0">
                      <strong class="counter fw-normal d-block mb-4">98%</strong>
                      <span class="d-block title">Return Clients</span>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3 mb-5 mb-md-0">
                      <strong class="counter fw-normal d-block mb-4">16</strong>
                      <span class="d-block title">Awards Won</span>
                  </div>
              </div>
          </div>
      </section>
      <section class="multicolumnsBlock w-100 position-relative overflow-hidden py-6 py-md-8 py-lg-15 text-center">
          <div class="container">
              <header class="headingHead mb-11">
                  <h2 class="hhHeading fw-normal">Quality Products - We Promise!</h2>
              </header>
              <div class="row justify-content-center row-gap-6">
                  <div class="col-12 col-md-6 col-lg-4">
                      <article class="mcColumn px-xl-8 px-xlwd-15">
                          <i class="icnWrap solid fw-medium d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4">
                              1
                          </i>
                          <h3 class="mccHeadaing fw-normal">It's Always the<br> Right Size</h3>
                          <p>Every piece is precision-crafted to ensure the perfect fit. From rings to bracelets, our sizing guarantees comfort and elegance.</p>
                      </article>
                  </div>
                  <div class="col-12 col-md-6 col-lg-4">
                      <article class="mcColumn px-xl-8 px-xlwd-15">
                          <i class="icnWrap solid fw-medium d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4">
                              2
                          </i>
                          <h3 class="mccHeadaing fw-normal">Nature Quality<br> Timeless Design</h3>
                          <p>We source only the finest materials — ethically mined gemstones and premium metals — paired with designs that transcend trends.</p>
                      </article>
                  </div>
                  <div class="col-12 col-md-6 col-lg-4">
                      <article class="mcColumn px-xl-8 px-xlwd-15">
                          <i class="icnWrap solid fw-medium d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4">
                              3
                          </i>
                          <h3 class="mccHeadaing fw-normal">Quality & Satisfaction<br> Guaranteed</h3>
                          <p>Every order comes with our satisfaction promise. Not happy? 30-day hassle-free returns, because your trust is our greatest reward.</p>
                      </article>
                  </div>
              </div>
          </div>
      </section>
      <div class="container">
          <hr class="my-0">
      </div>
      <section class="profilesBlock w-100 position-relative overflow-hidden py-6 py-md-8 py-lg-12">
          <div class="container">
              <header class="headingHead mb-8 text-center">
                  <h2 class="hhHeading fw-normal">The Leader Board Of Our Company</h2>
                  <p class="mt-3 text-muted">Our leadership team brings together diverse backgrounds and decades of experience from across the globe — united by a shared passion for quality jewellery and customer satisfaction.</p>
              </header>
              <div class="row justify-content-center row-gap-6">
                  <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                      <article class="leadColumn">
                          <div class="imgHolder text-center position-relative mb-5 overflow-hidden">
                              <img src="https://placehold.co/320x360" class="img-fluid w-100" alt="image description">
                              <div class="captiveWrap position-absolute p-6">
                                  <ul class="list-unstyled socialNetworks d-flex flex-wrap lcSocialNetworks mb-0">
                                      <li>
                                          <a href="javascript:void(0);" class="text-decoration-none">
                                              <i class="icomoon-twitter"><span class="visually-hidden">twitter</span></i>
                                          </a>
                                      </li>
                                      <li>
                                          <a href="javascript:void(0);" class="text-decoration-none">
                                              <i class="icomoon-facebook"><span class="visually-hidden">facebook</span></i>
                                          </a>
                                      </li>
                                      <li>
                                          <a href="javascript:void(0);" class="text-decoration-none">
                                              <i class="icomoon-linkedin"><span class="visually-hidden">linkedin</span></i>
                                          </a>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                          <div class="px-3 px-lg-6">
                              <h3 class="lcHeading fw-normal mb-1">Monali Shah</h3>
                              <h4 class="lcSubheading fw-light mb-0">Founder </h4>
                          </div>
                      </article>
                  </div><div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                      <article class="leadColumn">
                          <div class="imgHolder text-center position-relative mb-5 overflow-hidden">
                              <img src="https://placehold.co/320x360" class="img-fluid w-100" alt="image description">
                              <div class="captiveWrap position-absolute p-6">
                                  <ul class="list-unstyled socialNetworks d-flex flex-wrap lcSocialNetworks mb-0">
                                      <li>
                                          <a href="javascript:void(0);" class="text-decoration-none">
                                              <i class="icomoon-twitter"><span class="visually-hidden">twitter</span></i>
                                          </a>
                                      </li>
                                      <li>
                                          <a href="javascript:void(0);" class="text-decoration-none">
                                              <i class="icomoon-facebook"><span class="visually-hidden">facebook</span></i>
                                          </a>
                                      </li>
                                      <li>
                                          <a href="javascript:void(0);" class="text-decoration-none">
                                              <i class="icomoon-linkedin"><span class="visually-hidden">linkedin</span></i>
                                          </a>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                          <div class="px-3 px-lg-6">
                              <h3 class="lcHeading fw-normal mb-1">Jinal Shah</h3>
                              <h4 class="lcSubheading fw-light mb-0">Founder </h4>
                          </div>
                      </article>
                  </div>
                  <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                      <article class="leadColumn">
                          <div class="imgHolder text-center position-relative mb-5 overflow-hidden">
                              <img src="https://placehold.co/320x360" class="img-fluid w-100" alt="image description">
                              <div class="captiveWrap position-absolute p-6">
                                  <ul class="list-unstyled socialNetworks d-flex flex-wrap lcSocialNetworks mb-0">
                                      <li>
                                          <a href="javascript:void(0);" class="text-decoration-none">
                                              <i class="icomoon-twitter"><span class="visually-hidden">twitter</span></i>
                                          </a>
                                      </li>
                                      <li>
                                          <a href="javascript:void(0);" class="text-decoration-none">
                                              <i class="icomoon-facebook"><span class="visually-hidden">facebook</span></i>
                                          </a>
                                      </li>
                                      <li>
                                          <a href="javascript:void(0);" class="text-decoration-none">
                                              <i class="icomoon-linkedin"><span class="visually-hidden">linkedin</span></i>
                                          </a>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                          <div class="px-3 px-lg-6">
                              <h3 class="lcHeading fw-normal mb-1">Rashmi Saraf</h3>
                              <h4 class="lcSubheading fw-light mb-0">Founder </h4>
                          </div>
                      </article>
                  </div>
              </div>
          </div>
      </section>
      <section class="testimonialsBlock position-relative w-100 overflow-hidden py-6 py-lg-9 py-xl-13">
          <div class="container">
              <header class="headingHead text-center mb-8">
                  <h2 class="hhHeading fw-normal">Customer Review</h2>
              </header>
              <div class="slidersColsHolder">
                  <div class="row row-gap-4">
                      <div class="col-12 col-md-6 col-lg-4">
                          <div class="schCol h-100">
                              <blockquote class="quoteColumn overflow-hidden bg-white p-8 h-100">
                                  <i class="qcIcn icomoon-quotes bg-black text-white rounded-circle d-flex align-items-center justify-content-center mb-4"><span class="visually-hidden">"</span></i>
                                  <h3 class="qcHeading fw-medium mb-2">JewelT'Aime is my favourite store</h3>
                                  <p>Great products and designs and such great quality, they always wash up well no matter how many times I wash them.</p>
                                  <div class="d-flex gap-1 mt-5">
                                      <cite class="flex-grow-1 qcCite fw-normal">Donald Duclk</cite>
                                      <ul class="list-unstyled ratingStaticList d-flex mb-0">
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 1</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 2</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 3</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 4</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 5</span></i></li>
                                      </ul>
                                  </div>
                              </blockquote>
                          </div>
                      </div>
                      <div class="col-12 col-md-6 col-lg-4">
                          <div class="schCol h-100">
                              <blockquote class="quoteColumn overflow-hidden bg-white p-8 h-100">
                                  <i class="qcIcn icomoon-quotes bg-black text-white rounded-circle d-flex align-items-center justify-content-center mb-4"><span class="visually-hidden">"</span></i>
                                  <h3 class="qcHeading fw-medium mb-2">Beautiful products</h3>
                                  <p>Beautiful clothes. I always get complements. Good quality and items wash well. products and designs and such great.</p>
                                  <div class="d-flex gap-1 mt-5">
                                      <cite class="flex-grow-1 qcCite fw-normal">Niamh Oxley</cite>
                                      <ul class="list-unstyled ratingStaticList d-flex mb-0">
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 1</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 2</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 3</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 4</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 5</span></i></li>
                                      </ul>
                                  </div>
                              </blockquote>
                          </div>
                      </div>
                      <div class="col-12 col-md-6 col-lg-4">
                          <div class="schCol h-100">
                              <blockquote class="quoteColumn overflow-hidden bg-white p-8 h-100">
                                  <i class="qcIcn icomoon-quotes bg-black text-white rounded-circle d-flex align-items-center justify-content-center mb-4"><span class="visually-hidden">"</span></i>
                                  <h3 class="qcHeading fw-medium mb-2">Lovely products</h3>
                                  <p>Great products and designs and such great quality, they always wash up well no matter how many times I wash them.</p>
                                  <div class="d-flex gap-1 mt-5">
                                      <cite class="flex-grow-1 qcCite fw-normal">P Patel</cite>
                                      <ul class="list-unstyled ratingStaticList d-flex mb-0">
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 1</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 2</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 3</span></i></li>
                                          <li><i class="icomoon-star"><span class="visually-hidden">rated star 4</span></i></li>
                                          <li><i class="icomoon-star dull"><span class="visually-hidden">rated star 5</span></i></li>
                                      </ul>
                                  </div>
                              </blockquote>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      <aside class="sponsorsBlock w-100 position-relative overflow-hidden py-8 py-lg-12 text-center">
          <div class="container">
              <div class="d-flex flex-wrap justify-content-center gap-4 gap-lg-6">
                  <div class="logoWrap d-flex align-items-center justify-content-center">
                      <span class="w-100"><img src="https://placehold.co/115x40" class="img-fluid" alt="image description"></span>
                  </div>
                  <div class="logoWrap d-flex align-items-center justify-content-center">
                      <span class="w-100"><img src="https://placehold.co/115x40" class="img-fluid" alt="image description"></span>
                  </div>
                  <div class="logoWrap d-flex align-items-center justify-content-center">
                      <span class="w-100"><img src="https://placehold.co/115x40" class="img-fluid" alt="image description"></span>
                  </div>
                  <div class="logoWrap d-flex align-items-center justify-content-center">
                      <span class="w-100"><img src="https://placehold.co/115x40" class="img-fluid" alt="image description"></span>
                  </div>
                  <div class="logoWrap d-flex align-items-center justify-content-center">
                      <span class="w-100"><img src="https://placehold.co/115x40" class="img-fluid" alt="image description"></span>
                  </div>
              </div>
          </div>
      </aside>
      <aside class="signupAsideBlock text-center w-100 position-relative bg-light py-6 py-lg-9 py-xl-14">
          <div class="container">
              <div class="row">
                  <div class="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
                      <div class="px-xl-6 px-xxl-16">
                          <h3 class="sabHeading fw-normal mb-3">Subscribe Newsletter</h3>
                          <form action="#" class="subscribeForm" @submit.prevent="onNewsletterSubmit">
                              <label for="signup-email" class="d-block mb-6">Sign up to our Newsletter and get the discount code.</label>
                              <div v-if="newsletterMessage" class="alert" :class="newsletterMessageType" role="alert">
                                <small>{{ newsletterMessage }}</small>
                              </div>
                              <div class="d-flex flex-column flex-sm-row gap-2">
                                  <input id="signup-email" type="email" class="form-control bg-light" placeholder="Email address" v-model="newsletterEmail" required>
                                  <button type="submit" class="btn btnTheme" :disabled="newsletterSubmitting">
                                    <span v-if="newsletterSubmitting"><span class="spinner-border spinner-border-sm me-1" role="status"></span>Subscribing...</span>
                                    <span v-else>SUBSCRIBE</span>
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </aside>
      <aside class="featuresBlock text-center w-100 position-relative py-9">
          <div class="container">
              <ul class="list-unstyled d-flex flex-wrap justify-content-around gap-1 mb-0">
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-01.svg" width="37" height="30" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">Free Shipping</h3>
                      <h4 class="fbbSubheading fw-light mb-0">{{ siteSettings.freeShippingText || 'For all orders over $100' }}</h4>
                  </li>
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-02.svg" width="37" height="33" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">30 Days Return</h3>
                      <h4 class="fbbSubheading fw-light mb-0">{{ siteSettings.returnText || 'For an Exchange Product' }}</h4>
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
import { useSiteSettingsStore } from '../stores/siteSettingsStore'
import { subscribeToNewsletter, buildSubscribePayload } from '../services/newsletterService'

const siteSettings = useSiteSettingsStore()

const newsletterEmail = ref('')
const newsletterSubmitting = ref(false)
const newsletterMessage = ref('')
const newsletterMessageType = ref('')

async function onNewsletterSubmit() {
  const email = newsletterEmail.value.trim()
  if (!email) return

  newsletterMessage.value = ''
  newsletterSubmitting.value = true

  try {
    const payload = buildSubscribePayload({ email, name: '' })
    await subscribeToNewsletter(payload)
    newsletterMessage.value = 'Thank you for subscribing to our newsletter!'
    newsletterMessageType.value = 'alert-success'
    newsletterEmail.value = ''
  } catch (error) {
    const backendMsg = error?.response?.data?.message || error?.response?.data?.error
    if (backendMsg && backendMsg.toLowerCase().includes('already')) {
      newsletterMessage.value = 'This email is already subscribed to our newsletter.'
      newsletterMessageType.value = 'alert-info'
    } else {
      newsletterMessage.value = 'Subscription failed. Please try again later.'
      newsletterMessageType.value = 'alert-danger'
    }
  } finally {
    newsletterSubmitting.value = false
  }
}
</script>

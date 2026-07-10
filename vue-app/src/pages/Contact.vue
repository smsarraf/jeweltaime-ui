<template>
  <main>
      <div class="container">
          <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                      <router-link to="/" class="text-decoration-none">Home</router-link>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">Contact</li>
              </ol>
          </nav>
      </div>
      <section class="stroreBlock w-100 position-relative overflow-hidden py-6">
          <div class="container">
              <header class="headingHead text-center mb-8 mb-xl-12">
                  <h2 class="hhHeading HDii fw-normal">Contact</h2>
                  <p v-if="siteSettings.shortDescription">{{ siteSettings.shortDescription }}</p>
                  <p v-else>Click on your nearest store location below to set the road on Google Map.</p>
              </header>
              <div class="mapFrameWrap position-relative w-100">
                <iframe
                  v-if="siteSettings.googleMapLink"
                  :src="siteSettings.googleMapLink"
                  width="600" height="450" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
                <iframe
                  v-else
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d154064.43776737354!2d173.01955735890454!3d52.88979840709298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5848219cf1660ad9%3A0x295a91312c57c71!2sAttu%20Station%2C%20AK%2C%20USA!5e0!3m2!1sen!2s!4v1697323381464!5m2!1sen!2s"
                  width="600" height="450" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <address class="row bioContact text-center mb-0 pt-8 row-gap-6">
                  <div class="col-12 col-md-4">
                      <i class="icnWrap d-flex align-items-center justify-content-center mb-2">
								<span class="w-100">
									<img src="/images/ico-08.svg" class="img-fluid" width="18" height="30" alt="icon">
								</span>
                      </i>
                      <strong class="fw-medium bcdHeading d-block mb-1">OUR STORE</strong>
                      <p v-if="siteSettings.storeInfo.address">{{ siteSettings.storeInfo.address }}</p>
                      <p v-else>7021 Washington Sq.<br/>South New York, NY 10012</p>
                  </div>
                  <div class="col-12 col-md-4">
                      <i class="icnWrap d-flex align-items-center justify-content-center mb-2">
								<span class="w-100">
									<img src="/images/ico-09.svg" class="img-fluid" width="30" height="30" alt="icon">
								</span>
                      </i>
                      <strong class="fw-medium bcdHeading d-block mb-1">CONTACT INFO</strong>
                      <ul class="list-unstyled mb-0">
                          <li v-if="siteSettings.storeInfo.phone">
                            Phone: <a :href="`tel:${siteSettings.storeInfo.phone}`" class="text-decoration-none">{{ siteSettings.storeInfo.phone }}</a>
                          </li>
                          <li v-if="siteSettings.storeInfo.hours">{{ siteSettings.storeInfo.hours }}</li>
                          <li v-if="!siteSettings.storeInfo.phone && !siteSettings.storeInfo.hours">
                            Telephone: <a href="tel:7031723412" class="text-decoration-none">703.172.3412</a>
                          </li>
                          <li>Email: <a :href="`mailto:${siteSettings.emailAddress || 'hello@example.com'}`" class="text-decoration-none">{{ siteSettings.emailAddress || 'hello@example.com' }}</a></li>
                      </ul>
                  </div>
                  <div class="col-12 col-md-4">
                      <i class="icnWrap d-flex align-items-center justify-content-center mb-2">
								<span class="w-100">
								<img src="/images/ico-10.svg" class="img-fluid" width="30" height="30" alt="icon">
							</span>
                      </i>
                      <strong class="fw-medium bcdHeading d-block mb-1">BUSINESS HOURS</strong>
                      <p>{{ siteSettings.storeInfo.hours || 'Monday - Sunday: \n 09:00 am - 20:00 pm' }}</p>
                  </div>
              </address>
          </div>
      </section>
      <div class="container">
          <hr class="my-0">
      </div>
      <section class="formBlock w-100 position-relative overflow-hidden py-6 py-lg-9 py-xl-12">
          <div class="container">
              <header class="headingHead text-center mb-8 mb-xl-12">
                  <h2 class="hhHeading fw-normal">Have an question? Contact us!</h2>
              </header>
              <form action="#">
                  <div class="frmWrap">
                      <div class="row">
                          <div class="col-12 col-md-8 offset-md-2">
                              <div class="row mx-n2">
                                  <div class="col-12 col-sm-6 px-2">
                                      <div class="form-group mb-4">
                                          <input type="text" class="form-control" placeholder="Name">
                                      </div>
                                  </div>
                                  <div class="col-12 col-sm-6 px-2">
                                      <div class="form-group mb-4">
                                          <input type="email" class="form-control" :placeholder="siteSettings.emailAddress || 'Email'">
                                      </div>
                                  </div>
                                  <div class="col-12 px-2">
                                      <div class="form-group mb-4">
                                          <input type="email" class="form-control" placeholder="Subject">
                                      </div>
                                  </div>
                                  <div class="col-12 px-2">
                                      <div class="form-group mb-4">
                                          <textarea class="form-control" placeholder="Write your comment&hellip;"></textarea>
                                      </div>
                                  </div>
                              </div>
                              <div class="btnWrap">
                                  <input type="submit" class="btn btn-primary w-100" value="Send Message">
                              </div>
                          </div>
                      </div>
                  </div>
              </form>
          </div>
      </section>
  </main>
</template>

<script setup>
import { useSiteSettingsStore } from '../stores/siteSettingsStore'

const siteSettings = useSiteSettingsStore()
</script>
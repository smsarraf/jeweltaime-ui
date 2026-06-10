<template>
  <main>
      <header class="pageMainHead d-flex position-relative bgCover w-100 text-white" style="background-image: url(https://placehold.co/1920x300);">
          <div class="align-self-center text-center w-100">
              <div class="container">
                  <h1 class="pageHeading mb-3">Our Blog</h1>
                  <nav aria-label="breadcrumb">
                      <ol class="breadcrumb d-flex justify-content-center mb-0">
                          <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                          <li class="breadcrumb-item active" aria-current="page">Blog</li>
                      </ol>
                  </nav>
              </div>
          </div>
      </header>

      <section class="itemContentBlock pt-8 pb-10 pt-lg-14 pb-lg-14">
          <div class="container">
              <div class="row row-gap-6">
                  <div class="col-12 col-md-6 col-lg-4" v-for="post in blogPosts" :key="post.id">
                      <a href="javascript:void(0);" class="blogColumn overflow-hidden d-block text-decoration-none">
                          <div class="imgHolder mb-5 position-relative">
                              <img :src="post.image" class="img-fluid w-100" :alt="post.title">
                              <strong class="position-absolute fw-medium text-uppercase blgTag py-1 px-2">{{ post.category }}</strong>
                          </div>
                          <div class="blgTitle mb-2">
                              <strong class="blgAuthor fw-normal">{{ post.author }}</strong>
                              -
                              <time class="fw-normal" :datetime="post.date">{{ post.dateFormatted }}</time>
                          </div>
                          <h3 class="fw-medium blgHeading mb-4">{{ post.title }}</h3>
                          <span class="btnLink">Continue Reading</span>
                      </a>
                  </div>
              </div>
              
              <nav aria-label="Page navigation" class="mt-8">
                  <ul class="pagination justify-content-center">
                      <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
                      <li class="page-item active"><a class="page-link" href="#">1</a></li>
                      <li class="page-item"><a class="page-link" href="#">2</a></li>
                      <li class="page-item"><a class="page-link" href="#">Next</a></li>
                  </ul>
              </nav>
          </div>
      </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const blogPosts = ref([
  {
      id: 1,
      title: 'Christmas Gift Guide',
      category: 'Accessories',
      author: 'NECKERT',
      date: '2025-12-10',
      dateFormatted: 'DECEMBER 10, 2025',
      image: 'https://placehold.co/435x285'
  },
  {
      id: 2,
      title: 'How to Style a Quiff',
      category: 'Fashion',
      author: 'SANCER',
      date: '2025-11-25',
      dateFormatted: 'NOVEMBER 25, 2025',
      image: 'https://placehold.co/435x285'
  },
  {
      id: 3,
      title: 'Selective Styles Help your look',
      category: 'Collection',
      author: 'MONCK',
      date: '2025-10-15',
      dateFormatted: 'OCTOBER 15, 2025',
      image: 'https://placehold.co/435x285'
  },
  {
      id: 4,
      title: 'Diamond Jewelry Trends',
      category: 'Jewelry',
      author: 'ADMIN',
      date: '2025-09-05',
      dateFormatted: 'SEPTEMBER 05, 2025',
      image: 'https://placehold.co/435x285'
  },
  {
      id: 5,
      title: 'Matching Bracelets with Outfits',
      category: 'Style',
      author: 'JULIA',
      date: '2025-08-20',
      dateFormatted: 'AUGUST 20, 2025',
      image: 'https://placehold.co/435x285'
  },
  {
      id: 6,
      title: 'Taking Care of Gold Rings',
      category: 'Care',
      author: 'DAVID',
      date: '2025-07-11',
      dateFormatted: 'JULY 11, 2025',
      image: 'https://placehold.co/435x285'
  }
])
</script>

<template>
  <div class="not-found-page">
    <div class="container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <router-link to="/" class="btn btn-primary">Back to Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

h1 {
  font-size: 4rem;
  margin: 0;
  color: #999;
}

h2 {
  font-size: 2rem;
  margin: 10px 0 20px;
}

p {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.btn {
  display: inline-block;
  padding: 12px 30px;
  background-color: #222;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #444;
}
</style>

<template>
    <div class="forbidden-container">
      <h1>403 Forbidden</h1>
      <p>You do not have permission to access this page. Please Login to authorized user first.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "ForbiddenPage",
  };
  </script>
  
  <style scoped>
  .forbidden-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8d7da;
    color: #721c24;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  </style>
  
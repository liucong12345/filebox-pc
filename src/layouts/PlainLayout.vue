<template>
  <a-layout>
    <a-layout-header class="header">
      <a-row style="width: 1200px;margin: 0 auto">
        <a-col :span="20">
          <div class="logo">
            <router-link to="/">
              <img src="~@/assets/logo.png" class="logo" alt="logo">
            </router-link>
          </div>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="content">
      <router-view/>
    </a-layout-content>
  </a-layout>
</template>

<script>
  export default {
    name: 'PlainLayout'
  }
</script>

<style scoped>
  .header {
    background-color: #fff;
  }

  .content {
    background-color: #fff;
    padding: 5px;
  }

  .logo {
    margin-top: 19px;
    margin-bottom: 18px;
  }

  .logo img {
    margin-top: 0;
    width: 43px;
    height: 50px;
    float: left;
  }
</style>

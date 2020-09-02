<template>
  <a-layout class="body-content">
    <a-layout-header class="header">
      <a-row style="width: 1200px;margin: 0 auto">
        <a-col :span="14">
          <div class="logo">
            <router-link to="/">
              <img src="~@/assets/logo.png" class="logo" alt="logo">
            </router-link>
          </div>
        </a-col>
        <a-col :span="10" class="right">
          <template>
            <right-content/>
          </template>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content v-if="this.isUserInfo" style="background-color: #ffffff">
      <router-view/>
    </a-layout-content>
    <a-layout-content v-else>
      <router-view/>
    </a-layout-content>
  </a-layout>
</template>

<script>
  import RightContent from '@/components/GlobalHeader/RightContent'

  export default {
    name: 'HomeLayout',
    data () {
      return {
        isUserInfo: false
      }
    },
    components: {
      RightContent
    },
    beforeRouteUpdate (to, from, next) {
      if (to.path === '/userinfo') {
        this.isUserInfo = true
      } else {
        this.isUserInfo = false
      }
      next()
    }
  }

</script>

<style lang="less" scoped>
  .body-content {
    background-color: #F0F6FE;
  }
  .userinfo {
    background-color: #ffffff;
  }
  .other {
    background-color: transparent;
  }
  .header {
    background-color: #fff;
    .right {
      text-align: right;
    }
  }

  .logo {
    margin-top: 19px;
    margin-bottom: 18px;
  }

  .logo img {
    margin-top: 0px;
    width: 43px;
    height: 50px;
    float: left;
  }

  .logo span {
    line-height: 37px;
    margin-left: 15px;
    color: #333333;
    font-family: 'Arial Normal', 'Arial';
    font-weight: bold;
    font-style: normal;
    font-size: 18px;
    float: left;
  }
</style>

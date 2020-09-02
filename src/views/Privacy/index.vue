<template>
  <div class="main">
    <div class="card">
      <div class="header">
        <div class="line"/>
        <a class="back" @click="() => goBack()">{{ $t('privacy.back') }}</a>
      </div>
      <div class="title">
        {{ $t('privacy.title') }}
      </div>
      <div class="content">
        <CN v-if="currentLang === 'zh-CN'"/>
        <US v-if="currentLang === 'en-US'"/>
      </div>
    </div>
  </div>
</template>
<script>
  import CN from './CN'
  import US from './US'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        homefrom: false
      }
    },
    components: {
      CN, US
    },
    computed: {
      ...mapState({
        currentLang: state => state.app.lang
      })
    },
    methods: {
      goBack () {
        if (this.homefrom) {
          this.$router.push('/home')
        } else {
          this.$router.push('login')
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.path.indexOf('home') !== -1) {
          vm.homefrom = true
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #fff;

    .card {
      background-color: #fff;
      padding: 50px;
      width: 1200px;
      margin: 15px auto;
      box-shadow: -5px 0 30px 0 rgba(220, 228, 238, 0.5);

      .header {
        position: relative;
        text-align: center;
        margin-bottom: 15px;

        .line {
          display: inline-block;
          width: 72px;
          height: 4px;
          background-color: #26C195;
          border-radius: 2px;
        }

        .back {
          color: #26C195;
          font-size: 16px;
          font-weight: 400;
          position: absolute;
          right: 0;
          top: 0;

          &:hover {
            color: lighten(#26C195, 10%);
          }
        }
      }

      .title {
        text-align: center;
        color: #162646;
        font-size: 24px;
        font-weight: bold;
      }

      .content {
        color: #2E323D;
        font-size: 16px;
        font-weight: 400;
        padding-top: 15px;

        p {
          text-indent: 2em;
        }
      }
    }
  }
</style>

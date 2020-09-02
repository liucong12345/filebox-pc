<template>
  <a-layout class="center-layout" style="width: 1200px;margin: 0 auto">
    <!-- 左侧导航 -->
    <a-layout-sider width="176" class="sider-content">
      <a-menu
        id="left-menu"
        mode="inline"
        :default-selected-keys="[this.$route.path]"
        :style="{ height: '80%', borderRight: 0 }"
        @select="({item,key}) => this.$router.push(key)"
        :selectedKeys="[this.$route.path]"
      >
        <a-menu-item key="/center/uploadfile" style="padding: 0">
          {{ $t('menu.uploadfile') }}
        </a-menu-item>
        <a-menu-item key="/center/myfile" style="padding: 0">
          {{ $t('menu.myfile') }}
        </a-menu-item>
        <a-menu-item key="/center/hashsearch" style="padding: 0">
          {{ $t('menu.hashsearch') }}
        </a-menu-item>
        <a-menu-item key="/center/myreward" style="padding: 0">
          {{ $t('menu.myreward') }}
        </a-menu-item>
        <a-menu-item key="/center/myorder" style="padding: 0">
          {{ $t('menu.myorder') }}
        </a-menu-item>
        <a-menu-item key="/center/myspace" style="padding: 0">
          {{ $t('menu.myspace') }}
        </a-menu-item>
        <a-menu-item key="/center/test" style="padding: 0">
          测试
        </a-menu-item>
      </a-menu>
      <div style="height: 20%;background-color: #ffffff;align-items: end;display: grid;padding: 10px 0 20px 0;">
        <div style="padding: 0 16px; margin-bottom: 0px;font-weight:400;font-size: 12px;width: 100%">
          <div style="display: flex">
            <div style="color:rgba(46,50,61,1);flex: 1;width: 100%">{{ isBuy?$t('menu.volume.nospace'):$t('menu.volume.info', [useSize, allSize]) }}</div>
            <div><a
              style="color:rgba(38,193,149,1);"
              @click="()=>this.$router.push('/buy')">{{
                isBuy?$t('menu.volume.buy'):$t('menu.volume.expand') }}</a></div>
          </div>
          <a-row>
            <a-col span="24">
              <a-progress
                :percent="isSpaceOver?100:percent"
                :showInfo="false"
                :strokeColor="isSpaceOver?'#FF0000':'#26C195'"/>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-layout-sider>
    <a-layout class="context-content">
      <a-spin :spinning="routerLoading" style="overflow: hidden">
        <div
          class="content-height"
          :style="{ background: '#fff', margin: 0, width: '1014px' }"
        >
          <router-view/>
        </div>
      </a-spin>
    </a-layout>
  </a-layout>
</template>
<script>
  import { asyncRouterMap } from '@/config/router.config'
  import { mapActions, mapState } from 'vuex'
  import { formatFileSize } from '@/utils/util'

  export default {
    name: 'CenterLayout',
    data () {
      return {
        pageList: [],
        linkList: [],
        activePage: '',
        updateInfoEvent: null
      }
    },
    computed: {
      ...mapState({
        routerLoading: (state) => state.router.isLoading,
        allSize: (state) => formatFileSize(state.user.totalSize, 0, false, true),
        useSize: (state) => formatFileSize(state.user.currentSize, 0, false, true),
        percent: (state) => (state.user.currentSize / state.user.totalSize) * 100,
        isBuy: (state) => state.user.totalSize === 0,
        isSpaceOver: (state) => state.user.currentSize > state.user.totalSize
      })
    },
    methods: {
      ...mapActions(['GetSpaceInfo']),
      gettingSpaceInfo (cflg) {
        if (cflg && !this.updateInfoEvent) {
          return
        }
        clearTimeout(this.updateInfoEvent)
        this.updateInfoEvent = null
        this.GetSpaceInfo().then((data) => {
          if (data.buyConfirmingCnt > 0) {
            // 存在未确认定时确认
            this.updateInfoEvent = setTimeout(() => { this.gettingSpaceInfo(true) }, 1000)
          } else {
            clearTimeout(this.updateInfoEvent)
            this.updateInfoEvent = null
          }
        })
      }
    },
    created () {
      this.pageList.push(asyncRouterMap[2])
      this.linkList.push(this.$route.fullPath)
      this.activePage = this.$route.fullPath
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (to.path.startsWith('/center')) {
          vm.gettingSpaceInfo()
        }
      })
    },
    beforeRouteUpdate (to, from, next) {
      if (to.path.startsWith('/center')) {
        this.gettingSpaceInfo()
      }
      next()
    },
    destroyed () {
      clearTimeout(this.updateInfoEvent)
      this.updateInfoEvent = null
    }
  }
</script>

<style lang="less">
  .center-layout {
    .content-height {
      min-height: calc(100vh - 138px);
    }

    @media screen and (max-height: 500px) {
      .content-height {
        min-height: 393px;
      }
    }

    .ant-menu-inline .ant-menu-item {
      height: 54px;
      line-height: 54px;
    }

    .sider-content {
      margin: 20px 0 30px 0;
      background-color: #FFFFFF;
    }

    .context-content {
      margin: 21px 0 30px 10px;
      background-color: #FFFFFF;
    }

    #left-menu li {
      margin: 0;
      text-align: center;
    }

    #left-menu li::after {
      border-right: 0px;
    }

    #left-menu .ant-menu-item-selected {
      color: rgba(38, 193, 149, 1);
      background-color: #E0F6F0;
      border-left: 3px solid rgba(38, 193, 149, 1);
    }
  }
</style>

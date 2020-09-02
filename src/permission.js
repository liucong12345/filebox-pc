import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { ADDRESS, KEY_STORE, ROUTER_LOADING } from '@/store/mutation-types'
import notification from 'ant-design-vue/es/notification'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['home', 'about', 'login', 'agreement', 'privacy']
const loginRoutePath = '/login'
const defaultRoutePath = '/home'
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  store.commit(ROUTER_LOADING, true)
  const address = storage.get(ADDRESS)
  const keystore = storage.get(KEY_STORE)
  if (address && keystore) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
      store.commit(ROUTER_LOADING, false)
    } else {
      if (!store.getters.address || !store.getters.keystore) {
        store.dispatch('Login', { address, keystore })
          .then(() => {
            if (to.path === defaultRoutePath) {
              next({ path: '/center' })
              NProgress.done()
              store.commit(ROUTER_LOADING, false)
            } else {
              next()
            }
            NProgress.done()
            store.commit(ROUTER_LOADING, false)
          })
          .catch(() => {
            notification.error({
              key: 'message',
              message: 'error',
              description: 'server is something wrong!'
            })
          })
      } else {
        if (to.path === defaultRoutePath) {
          next({ path: '/center' })
          NProgress.done()
          store.commit(ROUTER_LOADING, false)
        } else {
          next()
        }
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      store.commit(ROUTER_LOADING, false)
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
  store.commit(ROUTER_LOADING, false)
  // 移动到顶部
  window.scrollTo(0, 0)
})

// eslint-disable-next-line
import { BlankLayout, CenterLayout, HomeLayout, PlainLayout } from '@/layouts'

export const asyncRouterMap = []

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: HomeLayout,
    redirect: '/home',
    hidden: true,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home')
      }, {
        // 关于我们
        path: '/about',
        name: 'about',
        component: () => import('@/views/about')
      }, {
        // 个人中心（）
        path: '/userinfo',
        name: 'userinfo',
        component: () => import('@/views/center/userinfo')
      }, {
        path: '/center',
        component: CenterLayout,
        redirect: '/center/uploadfile',
        children: [
          {
            path: '/center/uploadfile',
            name: 'uploadfile',
            component: () => import('@/views/center/uploadfile')
          },
          {
            // 我的文件
            path: '/center/myfile',
            name: 'myfile',
            component: () => import('@/views/center/myfile')
          },
          {
            // 我的文件
            path: '/center/a',

            name: 'a',
            component: () => import('@/views/center/myfile/a')
          },
          {
            // 哈希检索
            path: '/center/hashsearch',
            name: 'hashsearch',
            component: () => import('@/views/center/hashsearch')
          },
          {
            path: '/center/myreward',
            name: 'myreward',
            component: () => import('@/views/center/myreward')
          },
          {
            path: '/center/myorder',
            name: 'myorder',
            component: () => import('@/views/center/myorder')
          },
          {
            path: '/center/myorder/detail',
            name: 'detail',
            component: () => import('@/views/center/myorder/detail')
          },
          {
            path: '/center/myspace',
            name: 'myspace',
            component: () => import('@/views/center/myspace')
          },
          {
            path: '/center/withdraw',
            name: 'withdraw',
            component: () => import('@/views/center/withdraw')
          }
        ]
      }, {
        // 购买云空间
        path: '/buy',
        name: 'buy',
        component: () => import('@/views/Buy')
      }, {
        // 分享给别人进来看到的页面
        path: '/sharePage',
        name: 'sharePage',
        component: () => import('@/views/sharePage')
      }, {
        // 分享列表
        path: '/shareList',
        name: 'shareList',
        component: () => import('@/views/shareList')
      }, {
        // 测试
        path: '/test',
        name: 'test',
        component: () => import('@/views/test')
      }
    ]
  },
  {
    // 登录
    path: '/login',
    component: BlankLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/Login')
      }
    ]
  },
  {
    // 用户服务协议
    path: '/agreement',
    component: PlainLayout,
    children: [
      {
        path: '',
        name: 'agreement',
        component: () => import('@/views/Agreement')
      }
    ]
  },
  {
    // 隐私协议
    path: '/privacy',
    component: PlainLayout,
    children: [
      {
        path: '',
        name: 'privacy',
        component: () => import('@/views/Privacy')
      }
    ]
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home-page',
      component: require('@/components/home').default
    },
    {
      path: '/settings',
      component: require('@/components/settings').default,
      children: [
        {
          path: '/global',
          name: 'settings-global',
          component: require('@/components/settings/global').default,
          props: false
        },
        {
          path: ':module',
          name: 'settings-module',
          component: require('@/components/settings/module').default,
          props: true
        }
      ]
    },
    {
      path: '/about',
      name: 'about-page',
      component: require('@/components/about').default
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})

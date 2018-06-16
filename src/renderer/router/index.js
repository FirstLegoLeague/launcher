import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: require('@/components/home').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/settings').default,
      children: [
        {
          path: ':module',
          name: 'settings-module',
          component: require('@/components/settings/module').default,
          props: true
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

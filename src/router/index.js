import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/HomeView'
import Login from '@/components/LoginView'
import Reset from '@/components/PasswordResetView'
import Thrive from '@/components/thrive/ThriveCategoryView'
import Series from '@/components/series/SeriesListView'
import Lesson from '@/components/lesson/LessonItemListView'
import ItemEdit from '@/components/lesson/ItemEdit'
import ItemAdd from '@/components/lesson/ItemAdd'
import SeriesAdd from '@/components/thrive/ThriveSeriesAdd'
import SeriesEdit from '@/components/thrive/ThriveSeriesEdit'
import LessonAdd from '@/components/series/SeriesLessonAdd'
import LessonEdit from '@/components/series/SeriesLessonEdit'
import Section from '@/components/section/Section'
import SectionEdit from '@/components/section/SectionEdit'
import SectionAdd from '@/components/section/SectionAdd'

import store from '../config/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      alias: '/home',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/reset',
      name: 'Reset',
      component: Reset
    },
    {
      path: '/section/:sectionName',
      name: 'section',
      component: Section,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/section/:sectionName/:sectionItemKey/edit',
      name: 'sectionEdit',
      component: SectionEdit,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/section/:sectionName/add',
      name: 'sectionAdd',
      component: SectionAdd,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thrive/:category',
      name: 'thrive',
      component: Thrive,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thrive/:category/add',
      name: 'seriesAdd',
      component: SeriesAdd,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thrive/:category/:seriesName/edit',
      name: 'seriesEdit',
      component: SeriesEdit,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thrive/:category/:seriesName',
      name: 'series',
      component: Series,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thrive/:category/:seriesName/add',
      name: 'lessonAdd',
      component: LessonAdd,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thrive/:category/:seriesName/:lessonName/edit',
      name: 'lessonEdit',
      component: LessonEdit,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thrive/:category/:seriesName/:lessonName/:section',
      name: 'lesson',
      component: Lesson,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thrive/:category/:seriesName/:lessonName/:sectionName/edit/:lessonItemKey',
      name: 'itemEdit',
      component: ItemEdit,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:category/:seriesName/:lessonName/:sectionName/add/',
      name: 'itemAdd',
      component: ItemAdd,
      props: true,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.isLoggedIn) {
      next({ name: 'Login' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

export default router

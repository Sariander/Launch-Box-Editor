import Vue from 'vue'
import VueRouter from 'vue-router'
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
import SeriesVideoEdit from '@/components/series/SeriesVideoEdit'
import Section from '@/components/section/Section'
import SectionEdit from '@/components/section/SectionEdit'
import SectionAdd from '@/components/section/SectionAdd'
import Links from '@/components/Links'
import Editors from '@/components/Editors'
import EditorsEdit from '@/components/EditorsEdit'
import AdEditOne from '@/components/AdEditOne'
import AdEditTwo from '@/components/AdEditTwo'
import AdEditThree from '@/components/AdEditThree'
import AdEditFour from '@/components/AdEditFour'
import BackgroundEdit from '@/components/BackgroundEdit'
import Languages from '@/components/Languages'
import HeaderEdit from '@/components/HeaderEdit'
import Question from '@/components/question/QuestionItemListView'
import QuestionAdd from '@/components/question/QuestionAdd'
import QuestionEdit from '@/components/question/QuestionEdit'

import store from '../config/store'

Vue.use(VueRouter)

const routes = [
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
    path: '/links',
    name: 'links',
    component: Links,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/editors',
    name: 'editors',
    component: Editors,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/languages',
    name: 'languages',
    component: Languages,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/editors/edit/:editorId',
    name: 'editorsEdit',
    component: EditorsEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/ad-edit-one',
    name: 'ad-edit-one',
    component: AdEditOne,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/ad-edit-two',
    name: 'ad-edit-two',
    component: AdEditTwo,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/ad-edit-three',
    name: 'ad-edit-three',
    component: AdEditThree,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/ad-edit-four',
    name: 'ad-edit-four',
    component: AdEditFour,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/background-edit',
    name: 'background-edit',
    component: BackgroundEdit,
    meta: {
      requiresAuth: true
    }
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
    path: '/thrive/:category/:seriesId/edit',
    name: 'seriesEdit',
    component: SeriesEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/videoEdit',
    name: 'seriesVideoEdit',
    component: SeriesVideoEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId',
    name: 'series',
    component: Series,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/add',
    name: 'lessonAdd',
    component: LessonAdd,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/:lessonId/edit',
    name: 'lessonEdit',
    component: LessonEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/:lessonId/:section',
    name: 'lesson',
    component: Lesson,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/:lessonId/:sectionName/edit/:lessonItemKey',
    name: 'itemEdit',
    component: ItemEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/:lessonId/:sectionName/add/',
    name: 'itemAdd',
    component: ItemAdd,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/:lessonId/:sectionName/headerEdit',
    name: 'headerEdit',
    component: HeaderEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/:lessonId/:sectionName/question/:questionItemKey',
    name: 'question',
    component: Question,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/:lessonId/:sectionName/question/:questionItemKey/add',
    name: 'questionAdd',
    component: QuestionAdd,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thrive/:category/:seriesId/:lessonId/:sectionName/question/:questionItemKey/edit/:questionKey',
    name: 'questionEdit',
    component: QuestionEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
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

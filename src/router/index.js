import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Thrive from '@/components/Thrive'
import FollowUp from '@/components/FollowUp'
import Series from '@/components/Series'
import Lesson from '@/components/Lesson'
import ItemEdit from '@/components/ItemEdit'
import ItemAdd from '@/components/ItemAdd'
import SeriesAdd from '@/components/SeriesAdd'
import SeriesEdit from '@/components/SeriesEdit'
import LessonAdd from '@/components/LessonAdd'
import LessonEdit from '@/components/LessonEdit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      alias: '/home'
    },
    {
      path: '/FollowUp',
      name: 'followup',
      component: FollowUp
    },
    {
      path: '/:category',
      name: 'thrive',
      component: Thrive,
      props: true
    },
    {
      path: '/:category/add',
      name: 'seriesAdd',
      component: SeriesAdd,
      props: true
    },
    {
      path: '/:category/:seriesName/edit',
      name: 'seriesEdit',
      component: SeriesEdit,
      props: true
    },
    {
      path: '/:category/:seriesName',
      name: 'series',
      component: Series,
      props: true
    },
    {
      path: '/:category/:seriesName/add',
      name: 'lessonAdd',
      component: LessonAdd,
      props: true
    },
    {
      path: '/:category/:seriesName/:lessonName/edit',
      name: 'lessonEdit',
      component: LessonEdit,
      props: true
    },
    {
      path: '/:category/:seriesName/:lessonName/:section',
      name: 'lesson',
      component: Lesson,
      props: true
    },
    {
      path: '/:category/:seriesName/:lessonName/:sectionName/edit/:lessonItemKey',
      name: 'itemEdit',
      component: ItemEdit,
      props: true
    },
    {
      path: '/:category/:seriesName/:lessonName/:sectionName/add/',
      name: 'itemAdd',
      component: ItemAdd,
      props: true
    }
  ]
})

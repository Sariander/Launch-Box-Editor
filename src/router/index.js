import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Thrive from '@/components/Thrive'
import FollowUp from '@/components/FollowUp'
import Series from '@/components/Series'
import Lesson from '@/components/Lesson'
import ItemEdit from '@/components/ItemEdit'
import ItemAdd from '@/components/ItemAdd'

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
      path: '/:category/:seriesName',
      name: 'series',
      component: Series,
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
      name: 'edit',
      component: ItemEdit,
      props: true
    },
    {
      path: '/:category/:seriesName/:lessonName/:sectionName/add/',
      name: 'add',
      component: ItemAdd,
      props: true
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/HomeView'
import Thrive from '@/components/ThriveCategoryView'
import Series from '@/components/SeriesListView'
import Lesson from '@/components/LessonItemListView'
import ItemEdit from '@/components/ItemEdit'
import ItemAdd from '@/components/ItemAdd'
import SeriesAdd from '@/components/ThriveSeriesAdd'
import SeriesEdit from '@/components/ThriveSeriesEdit'
import LessonAdd from '@/components/SeriesLessonAdd'
import LessonEdit from '@/components/SeriesLessonEdit'
import Section from '@/components/Section'
import SectionEdit from '@/components/SectionEdit'
import SectionAdd from '@/components/SectionAdd'

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
      path: '/section/:sectionName',
      name: 'section',
      component: Section,
      props: true
    },
    {
      path: '/section/:sectionName/:sectionItemKey/edit',
      name: 'sectionEdit',
      component: SectionEdit,
      props: true
    },
    {
      path: '/section/:sectionName/add',
      name: 'sectionAdd',
      component: SectionAdd,
      props: true
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

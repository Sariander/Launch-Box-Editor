<template>
  <div id="app">
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span style="flex: 1" class="md-title">{{ title }}</span>
        <md-button v-if="seriesView" @click="addSeries()">Add Series</md-button>
        <md-button v-if="lessonView" @click="addLesson()">Add Lesson</md-button>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <md-list-item v-for="tab in tabs" v-bind:key="tab.id" @click="navigateToTab(tab.route, tab.text)">
            <md-icon>{{ tab.icon }}</md-icon>
            <span class="md-list-item-text">{{ tab.text }}</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Vue from 'vue'
import { MdApp, MdList, MdIcon, MdToolbar, MdDrawer, MdButton, MdContent, MdCard, MdRipple, MdProgress, MdBottomBar, MdTabs, MdDialog, MdSpeedDial, MdTooltip, MdField, MdMenu, MdSwitch } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(MdApp)
Vue.use(MdList)
Vue.use(MdIcon)
Vue.use(MdToolbar)
Vue.use(MdDrawer)
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdCard)
Vue.use(MdRipple)
Vue.use(MdProgress)
Vue.use(MdBottomBar)
Vue.use(MdTabs)
Vue.use(MdDialog)
Vue.use(MdField)
Vue.use(MdMenu)
Vue.use(MdSpeedDial)
Vue.use(MdTooltip)
Vue.use(MdSwitch)

export default {
  name: 'app',
  data () {
    return {
      showNavigation: false,
      title: 'Thrive Studies',
      tabs: [
        {
          id: 0,
          text: 'Home',
          route: 'Home',
          icon: 'home'
        },
        {
          id: 1,
          text: 'Follow Up',
          route: 'followup',
          icon: 'list'
        },
        {
          id: 2,
          text: 'Thrive 1',
          route: 'thrive',
          icon: 'looks_one'
        },
        {
          id: 3,
          text: 'Thrive 2',
          route: 'thrive',
          icon: 'looks_two'
        },
        {
          id: 4,
          text: 'Thrive 3',
          route: 'thrive',
          icon: 'looks_3'
        }
      ],
      lessonView: false,
      seriesView: false
    }
  },
  mounted () {
    this.setTitle(this.$route)
  },
  watch: {
    $route (to, from) {
      this.setTitle(to)
    }
  },
  methods: {
    addSeries () {
      let category = this.$route.params.category
      this.$router.push({ name: 'seriesAdd', params: { category: category } })
    },
    addLesson () {
      let category = this.$route.params.category
      let series = this.$route.params.seriesName
      this.$router.push({ name: 'lessonAdd', params: { category: category, seriesName: series } })
    },
    navigateToTab (route, text) {
      this.$router.push({ name: route, params: { category: text } })
    },
    setTitle (route) {
      this.lessonView = false
      this.seriesView = false
      switch (route.name) {
        case 'Home':
          this.title = 'Thrive Studies'
          break
        case 'followup':
          this.title = 'Follow Up'
          break
        case 'thrive':
          this.seriesView = true
          this.title = route.params.category
          break
        case 'seriesEdit':
          this.seriesView = true
          this.title = route.params.category + ' / ' + route.params.seriesName + ' / Edit'
          break
        case 'seriesAdd':
          this.seriesView = true
          this.title = route.params.category + ' / Add'
          break
        case 'series':
          this.lessonView = true
          this.title = route.params.category + ' / ' + route.params.seriesName
          break
        case 'lessonEdit':
          this.lessonView = true
          this.title = route.params.category + ' / ' + route.params.seriesName + ' / Edit'
          break
        case 'lessonAdd':
          this.lessonView = true
          this.title = route.params.category + ' / ' + route.params.seriesName + ' / Add'
          break
        case 'lesson':
          this.title = route.params.category + ' / ' + route.params.seriesName + ' / ' + route.params.lessonName
          break
        case 'itemEdit':
          this.title = route.params.category + ' / ' + route.params.seriesName + ' / ' + route.params.lessonName + ' / Edit'
          break
        case 'itemAdd':
          this.title = route.params.category + ' / ' + route.params.seriesName + ' / ' + route.params.lessonName + ' / Add'
          break
        default:
      }
    }
  }
}
</script>

<style lang="scss">
.md-app {
  height: 100vh;
  max-height: 100vh;
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-app-content {
  padding: 0px;
}

.orange-hightlight-text {
  color: orange
}
</style>

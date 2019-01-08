<template>
  <div class="lesson">
    <md-tabs :md-active-tab="currentTab" md-alignment="centered">
      <md-tab id="study" :to="studyRoute" replace md-label="The Study"></md-tab>
      <md-tab id="leaders" :to="leaderRoute" replace md-label="Leader's Guide"></md-tab>
      <md-tab id="idea" :to="ideaRoute" replace md-label="Idea Box"></md-tab>
      <md-tab id="review" :to="reviewRoute" replace md-label="Review Cards"></md-tab>
    </md-tabs>
    <span class=button-container>
      <md-switch v-model="canDrag">Reorder</md-switch>
      <br>
    </span>
    <draggable v-model="displayListSorted" :options="{disabled: !canDrag}" class="content-container">
      <div v-for="(item, index) of displayListSorted" :key="item['.key']">
        <div v-on:click="goToEdit(item['.key'])" class="item-container" v-bind:class="canDrag ? 'item-drag' : 'item-edit'">
          <template v-if="item.type == 'text'">
            <div v-bind:class="item.style" v-html="highlight(item.header, item.headerHighlights)">{{ item.header }}</div>
            <div v-if="item.style == 'detail' && item.details && item.details != ''" v-html="highlight(item.details, item.detailsHighlights)">{{ item.details }}</div>
          </template>
          <template v-else-if="item.type == 'video'">
            <div>{{ item.header }}</div>
            <img v-bind:src="'https://img.youtube.com/vi/' + item.url + '/0.jpg'">
          </template>
          <template v-else-if="item.type == 'image'">
            <img v-bind:src="item.url">
          </template>
        </div>
        <span class="material-divider" v-if="index != displayedList.length-1"></span>
      </div>
    </draggable>
    <md-speed-dial class="md-bottom-right">
      <md-speed-dial-target @click="goToAdd()">
        <md-icon>add</md-icon>
        <md-tooltip md-direction="left">Add Item</md-tooltip>
      </md-speed-dial-target>
    </md-speed-dial>
  </div>
</template>

<script>
import { db } from '../config/db'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    category: String,
    seriesName: String,
    lessonName: String,
    section: String
  },
  data () {
    return {
      currentTab: '',
      canDrag: false,
      lessonItems: [],
      displayedList: [],
      studyRoute: '',
      leaderRoute: '',
      ideaRoute: '',
      reviewRoute: ''
    }
  },
  computed: {
    displayListSorted: {
      get () {
        let sorted = [...this.displayedList]

        return sorted
      },
      set (value) {
        let updates = {}
        value.forEach((item, index) => {
          if (this.section === 'reviewCards') {
            db.ref('series').child(this.category).child(this.seriesName).child(this.section).on('value', function (snapshot) {
              updates[item['.key'] + '/order'] = index
            })
          } else {
            db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child(this.section).on('value', function (snapshot) {
              updates[item['.key'] + '/order'] = index
            })
          }
        })
        if (this.section === 'reviewCards') {
          db.ref('series').child(this.category).child(this.seriesName).child(this.section).update(updates)
        } else {
          db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child(this.section).update(updates)
        }
      }
    }
  },
  firebase () {
    return {
      studyList: db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('study').orderByChild('order'),
      leadersGuideList: db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('leadersGuide').orderByChild('order'),
      ideaBoxList: db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('ideaBox').orderByChild('order'),
      reviewCardsList: db.ref('series').child(this.category).child(this.seriesName).child('reviewCards').orderByChild('order')
    }
  },
  mounted () {
    this.studyRoute = '/thrive/' + this.category + '/' + this.seriesName + '/' + this.lessonName + '/study'
    this.leaderRoute = '/thrive/' + this.category + '/' + this.seriesName + '/' + this.lessonName + '/leadersGuide'
    this.ideaRoute = '/thrive/' + this.category + '/' + this.seriesName + '/' + this.lessonName + '/ideaBox'
    this.reviewRoute = '/thrive/' + this.category + '/' + this.seriesName + '/' + this.lessonName + '/reviewCards'
    this.$watch('section', () => {
      switch (this.section) {
        case 'study':
          this.currentTab = 'study'
          this.displayedList = this.studyList
          break
        case 'leadersGuide':
          this.currentTab = 'leaders'
          this.displayedList = this.leadersGuideList
          break
        case 'ideaBox':
          this.currentTab = 'idea'
          this.displayedList = this.ideaBoxList
          break
        case 'reviewCards':
          this.currentTab = 'review'
          this.displayedList = this.reviewCardsList
          break
        default:
      }
    }, {
      immediate: true
    })
  },
  methods: {
    highlight (content, highlights) {
      if (!highlights) {
        return content
      }
      highlights.forEach(function (highlight) {
        content = content.replace(new RegExp(highlight, 'gi'), match => {
          return '<span class="orange-hightlight-text">' + match + '</span>'
        })
      })
      return content
    },
    goToAdd: function () {
      this.$router.push({ name: 'itemAdd', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.section, order: this.displayListSorted.length } })
    },
    goToEdit (key) {
      if (!this.canDrag) {
        this.$router.push({ name: 'itemEdit', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.section, lessonItemKey: key } })
      }
    }
  }
}
</script>

<style scoped>
.bold {
  font-weight: bold;
}
.detail {
  font-weight: bold;
}
.orange {
  color: orange;
}
.content-container {
  width: 60%;
  margin: 0 auto;
}
.item-container {
  margin-top: 10px;
  margin-bottom: 5px;
}
.item-edit {
  cursor: pointer;
}
.item-drag {
  cursor: move;
}
.material-divider {
  display: block;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.12);
}
.md-dialog {
  width: 60%;
  padding-left: 10px;
  padding-right: 10px;
}
.button-container {
  position: fixed;
  right: 0;
  top: 64px;
}
</style>

<template>
  <div class="lesson">
    <md-tabs :md-active-tab="currentTab" md-alignment="centered">
      <md-tab id="study" :to="studyRoute" replace md-label="The Study"></md-tab>
      <md-tab id="leaders" :to="leaderRoute" replace md-label="Leader's Guide"></md-tab>
      <md-tab id="idea" :to="ideaRoute" replace md-label="Idea Box"></md-tab>
      <md-tab id="review" :to="reviewRoute" replace md-label="Review Cards"></md-tab>
    </md-tabs>
    <md-dialog-actions>
      <md-switch v-model="canDrag">Reorder</md-switch>
      <md-button class="md-primary" @click="updateList()">Save</md-button>
    </md-dialog-actions>

    <draggable v-model="displayedList" :options="{disabled: !canDrag}" class="content-container">
      <div v-for="(item, index) of displayedList" :key="item['.key']">
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
      showDialog: false,
      activeEditItem: {
        header: '',
        details: '',
        headerUrls: [''],
        headerHighlights: [''],
        detailsUrls: [''],
        detailsHighlights: ['']
      },
      studyRoute: '',
      leaderRoute: '',
      ideaRoute: '',
      reviewRoute: ''
    }
  },
  firebase () {
    return {
      studyList: db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('study'),
      leadersGuideList: db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('leadersGuide'),
      ideaBoxList: db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('ideaBox'),
      reviewCardsList: db.ref('series').child(this.category).child(this.seriesName).child('reviewCards')
    }
  },
  mounted () {
    this.studyRoute = '/' + this.category + '/' + this.seriesName + '/' + this.lessonName + '/study'
    this.leaderRoute = '/' + this.category + '/' + this.seriesName + '/' + this.lessonName + '/leadersGuide'
    this.ideaRoute = '/' + this.category + '/' + this.seriesName + '/' + this.lessonName + '/ideaBox'
    this.reviewRoute = '/' + this.category + '/' + this.seriesName + '/' + this.lessonName + '/reviewCards'
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
    changeSectionTab: function (sectionName) {
      this.section = sectionName
      this.$router.replace({ name: 'lesson', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.section } })
    },
    goToAdd: function () {
      this.$router.push({ name: 'add', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.section } })
    },
    goToEdit (key) {
      if (!this.canDrag) {
        this.$router.push({ name: 'edit', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.section, lessonItemKey: key } })
      }
    },
    updateItem: function (item, index) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      if (this.sectionName === 'reviewCards') {
        db.ref('series').child(this.category).child(this.seriesName).child(this.section).child(item['.key']).set(copy)
      } else {
        db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child(this.section).child(index).set(copy)
      }
    },
    updateList: function () {
      let self = this
      this.displayedList.forEach(function (value, index) {
        self.updateItem(value, index)
      })
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
</style>

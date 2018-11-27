<template>
  <div class="lesson">
    <md-tabs md-alignment="centered" md-sync-route>
      <md-tab v-on:click="changeSectionTab('study')" md-label="The Study"></md-tab>
      <md-tab v-on:click="changeSectionTab('leadersGuide')" md-label="Leader's Guide"></md-tab>
      <md-tab v-on:click="changeSectionTab('ideaBox')" md-label="Idea Box"></md-tab>
      <md-tab v-on:click="changeSectionTab('reviewCards')" md-label="Review Cards"></md-tab>
    </md-tabs>
    <div class="content-container">
      <div v-for="(item, index) of displayedList" :key="item['.key']">
        <div v-on:click="goToEdit(item['.key'])" class="item-container">
          <template v-if="item.type == 'text'">
            <div v-bind:class="item.style">{{ item.header }}</div>
            <div v-if="item.style == 'detail' && item.details && item.details != ''">{{ item.details }}</div>
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
    </div>
    <md-speed-dial class="md-bottom-right">
        <md-speed-dial-target @click="goToAdd()">
          <md-icon>add</md-icon>
        </md-speed-dial-target>
      </md-speed-dial>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  props: {
    category: String,
    seriesName: String,
    lessonName: String
  },
  data () {
    return {
      section: 'study',
      lessonItems: [],
      displayedList: [],
      showDialog: false,
      activeEditItem: {
        header: '',
        details: '',
        headerUrls: [''],
        headerHighlights: ['']
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
    switch (this.section) {
      case 'study':
        this.displayedList = this.studyList
        break
      case 'leadersGuide':
        this.displayedList = this.leadersGuideList
        break
      case 'ideaBox':
        this.displayedList = this.ideaBoxList
        break
      case 'reviewCards':
        this.displayedList = this.reviewCardsList
        break
      default:
    }
  },
  methods: {
    changeSectionTab: function (sectionName) {
      this.section = sectionName
      switch (this.section) {
        case 'study':
          this.displayedList = this.studyList
          break
        case 'leadersGuide':
          this.displayedList = this.leadersGuideList
          break
        case 'ideaBox':
          this.displayedList = this.ideaBoxList
          break
        case 'reviewCards':
          this.displayedList = this.reviewCardsList
          break
        default:
      }
    },
    goToAdd: function () {
      console.log('Add')
    },
    goToEdit (key) {
      this.$router.push({ name: 'edit', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.section, lessonItemKey: key } })
    },
    updateItem: function (item) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      if (this.category === 'reviewCards') {

      } else {
        db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('study').child(item['.key']).set(copy)
      }
      this.showDialog = false
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
  cursor: pointer;
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

<template>
  <div class="lesson">
    <md-tabs :md-active-tab="currentTab" md-alignment="centered">
    </md-tabs>
    <span class=button-container>
      <md-switch v-model="canDrag">Reorder</md-switch>
      <br>
    </span>
    <draggable v-model="displayListSorted" :options="{disabled: !canDrag}" class="content-container">
      <div v-for="(item, index) of displayListSorted" :key="item['.key']">
        <lesson-list-item @row-clicked="goToEdit" :item="item" :canDrag="canDrag" :hasDivider="index != displayedList.length-1"></lesson-list-item>
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
import { db } from '../../config/db'
import draggable from 'vuedraggable'
import store from '../../config/store'
import lessonListItem from './QuestionListItem'

export default {
  components: {
    draggable,
    'lesson-list-item': lessonListItem
  },
  props: {
    category: String,
    seriesName: String,
    lessonName: String,
    sectionName: String,
    questionItemKey: String
  },
  data () {
    return {
      currentTab: '',
      canDrag: false,
      editMode: false,
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
          db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName).child('chapters').child(this.lessonName).child('study').child(this.questionItemKey).child('list').on('value', function (snapshot) {
            updates[item['.key'] + '/order'] = index
          })
        })
        db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName).child('chapters').child(this.lessonName).child('study').child(this.questionItemKey).child('list').update(updates)
      }
    }
  },
  firebase () {
    return {
      studyList: db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName).child('chapters').child(this.lessonName).child('study').child(this.questionItemKey).child('list').orderByChild('order')
    }
  },
  mounted () {
    this.studyRoute = '/thrive/' + this.category + '/' + this.seriesName + '/' + this.lessonName + '/study'
    this.displayedList = this.studyList
  },
  methods: {
    goToAdd: function () {
      this.$router.replace({ name: 'questionAdd', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.sectionName, questionItemKey: this.questionItemKey, order: this.displayListSorted.length } })
    },
    goToEdit (key) {
      if (!this.canDrag) {
        this.$router.replace({ name: 'questionEdit', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.sectionName, questionItemKey: this.questionItemKey, questionKey: key } })
      }
    },
    changeTab (newSection) {
      this.$router.replace({ name: 'lesson', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, section: newSection } })
    }
  }
}
</script>

<style scoped>
.content-container {
  width: 60%;
  margin: 0 auto;
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

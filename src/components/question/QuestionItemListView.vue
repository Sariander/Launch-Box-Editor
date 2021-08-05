<template>
  <div class="lesson">
    <span class=button-container v-if="editor && editor.languages[activeLanguageCode].write">
      <md-switch v-model="canDrag">Reorder</md-switch>
    </span>
    <div class="header-container title">{{ header }}</div>
    <draggable v-model="displayListSorted" :disabled="!canDrag" class="content-container">
      <div v-for="(item, index) of displayListSorted" :key="item['.key']">
        <lesson-list-item @row-clicked="goToEdit" :item="item" :canEdit="editor.languages[activeLanguageCode].write" :canDrag="canDrag" :hasDivider="index != displayedList.length-1" :activeLanguageCode="activeLanguageCode"></lesson-list-item>
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
    seriesId: String,
    lessonId: String,
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
      studyList: [],
      studyRoute: '',
      leaderRoute: '',
      ideaRoute: '',
      reviewRoute: '',
      editor: null
    }
  },
  computed: {
    displayListSorted: {
      get () {
        const sorted = [...this.displayedList]

        return sorted
      },
      set (value) {
        const updates = {}
        value.forEach((item, index) => {
          db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(this.questionItemKey).child('list').on('value', function (snapshot) {
            updates[item['.key'] + '/order'] = index
          })
        })
        db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(this.questionItemKey).child('list').update(updates)
      }
    },
    activeLanguageCode: {
      get () {
        return store.getters.activeLanguageCode
      },
      set (newValue) {
        store.commit('setActiveLanguageCode', newValue)
      }
    },
    header: {
      get () {
        return store.getters.articleName
      },
      set (newValue) {
        store.commit('setArticleName', newValue)
      }
    }
  },
  firebase () {
    return {
      studyList: db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(this.questionItemKey).child('list').orderByChild('order')
    }
  },
  mounted () {
    this.$watch('user', () => {
      if (store.getters.editorId) {
        this.$rtdbBind('editor', db.ref('editors').child(store.getters.editorId))
      }
    }, {
      immediate: true
    })
    this.studyRoute = '/thrive/' + this.category + '/' + this.seriesId + '/' + this.lessonId + '/study'
    this.displayedList = this.studyList
  },
  methods: {
    goToAdd: function () {
      this.$router.push({ name: 'questionAdd', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.sectionName, questionItemKey: this.questionItemKey, order: this.displayListSorted.length } })
    },
    goToEdit (key) {
      if (!this.canDrag) {
        this.$router.push({ name: 'questionEdit', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.sectionName, questionItemKey: this.questionItemKey, questionKey: key } })
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
.header-container {
  width: 60%;
  margin: 10px auto 5px auto;
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
.title {
  font-size: 22px;
  font-weight: bold;
  color: gold;
}
</style>

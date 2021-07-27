<template>
  <div class="lesson">
    <span class=button-container v-if="editor && editor.languages[activeLanguageCode].write">
      <md-switch v-model="canDrag">Reorder</md-switch>
      <md-switch v-model="editMode">Edit</md-switch>
    </span>
    <draggable v-model="displayListSorted" :disabled="!canDrag" class="content-container">
      <div v-for="(item, index) of displayListSorted" :key="item['.key']">
        <lesson-list-item @row-clicked="goToEdit(item.header, item.type, item['.key'])" :item="item" :canDrag="canDrag" :hasDivider="index != displayedList.length-1"></lesson-list-item>
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
import lessonListItem from './LessonListItem'

export default {
  components: {
    draggable,
    'lesson-list-item': lessonListItem
  },
  props: {
    category: String,
    seriesId: String,
    lessonId: String,
    section: String
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
      reviewRoute: '',
      studyList: [],
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
          db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').on('value', function (snapshot) {
            updates[item['.key'] + '/order'] = index
          })
        })
        db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').update(updates)
      }
    },
    activeLanguageCode: {
      get () {
        return store.getters.activeLanguageCode
      },
      set (newValue) {
        store.commit('setActiveLanguageCode', newValue)
      }
    }
  },
  // firebase () {
  //   return {
  //     studyList: db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('studies').child(this.lessonId).child('study').orderByChild('order'),
  //     leadersGuideList: db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('studies').child(this.lessonId).child('leadersGuide').orderByChild('order'),
  //     ideaBoxList: db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('studies').child(this.lessonId).child('ideaBox').orderByChild('order'),
  //     reviewCardsList: db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('reviewCards').orderByChild('order')
  //   }
  // },
  mounted () {
    this.studyRoute = '/thrive/' + this.category + '/' + this.seriesId + '/' + this.lessonId + '/study'
    this.leaderRoute = '/thrive/' + this.category + '/' + this.seriesId + '/' + this.lessonId + '/leadersGuide'
    this.ideaRoute = '/thrive/' + this.category + '/' + this.seriesId + '/' + this.lessonId + '/ideaBox'
    this.reviewRoute = '/thrive/' + this.category + '/' + this.seriesId + '/' + this.lessonId + '/reviewCards'
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
    this.$watch('activeLanguageCode', () => {
      db.ref('header').child(store.getters.activeLanguageCode).child(this.section).on('value', snapshot => {
        this.headerImageUrl = snapshot.val()
      })
      this.$rtdbBind('studyList', db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').orderByChild('order'))
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
    this.$watch('user', () => {
      if (store.getters.editorId) {
        this.$rtdbBind('editor', db.ref('editors').child(store.getters.editorId))
      }
    }, {
      immediate: true
    })
  },
  methods: {
    goToAdd: function () {
      if (this.editor.languages[this.activeLanguageCode].write) {
        this.$router.push({ name: 'itemAdd', params: { category: this.category, seriesId: this.seriesId, lessonId: this.lessonId, sectionName: this.section, order: this.displayListSorted.length } })
      }
    },
    goToEdit (header, type, key) {
      if (!this.canDrag) {
        if (this.editMode) {
          this.$router.push({ name: 'itemEdit', params: { category: this.category, seriesId: this.seriesId, lessonId: this.lessonId, sectionName: 'study', lessonItemKey: key } })
        } else if (type === 'text') {
          this.$router.push({ name: 'question', params: { category: this.category, seriesId: this.seriesId, lessonId: this.lessonId, sectionName: 'study', questionItemKey: key } })
        }
      }
    },
    changeTab (newSection) {
      this.$router.replace({ name: 'lesson', params: { category: this.category, seriesId: this.seriesId, lessonId: this.lessonId, section: newSection } })
    }
  }
}
</script>

<style scoped>
.content-container {
  width: 60%;
  margin: 0 auto;
  padding: 0 4px;
}

.item-edit {
  cursor: pointer;
}

.no-edit {
  cursor: auto;
}

@media only screen and (max-width: 600px) {
  .content-container {
    width: 100%;
  }
}

@media only screen and (min-width: 600px) {
  .content-container {
    width: 100%;
  }
}

@media only screen and (min-width: 768px) {
  .content-container {
    width: 75%;
  }
}

@media only screen and (min-width: 992px) {
  .content-container {
    width: 60%;
  }
}

@media only screen and (min-width: 1200px) {
  .content-container {
    width: 50%;
  }
}
.item-container {
  margin-top: 10px;
  margin-bottom: 5px;
}
.md-dialog {
  width: 60%;
  padding-left: 10px;
  padding-right: 10px;
}
.button-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  top: 64px;
}
</style>

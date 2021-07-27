<template>
  <div class="series">
    <span class=button-container v-if="editor && editor.languages[activeLanguageCode].write">
      <md-switch v-model="canDrag">Reorder</md-switch>
      <md-switch v-model="editMode">Edit</md-switch>
    </span>
    <div v-if="lesson" class="video-container" v-bind:class="canDrag ? '' : 'item-edit'" @click="editSeriesVideo()">
      <img :src="(lesson.video != '' && lesson.video != null) ? lesson.video : require('../../../src/assets/placeholder_video.jpg')">
    </div>
    <draggable v-model="studyListSorted" :disabled="!canDrag" class="content-container">
      <div v-for="item of studyListSorted" :key="item['.key']" v-bind:class="canDrag ? 'item-drag' : 'item-edit'" class="container" v-on:click="goToSpecificLesson(item['.key'], item.title)">
        <img :src="item.image">
      </div>
    </draggable>
    <md-speed-dial v-if="editor && editor.languages[activeLanguageCode].write" class="md-bottom-right">
      <md-speed-dial-target @click="addLesson()">
        <md-icon>add</md-icon>
        <md-tooltip md-direction="left">Add Lesson</md-tooltip>
      </md-speed-dial-target>
    </md-speed-dial>
  </div>
</template>

<script>
import { db } from '../../config/db'
import draggable from 'vuedraggable'
import store from '../../config/store'

export default {
  components: {
    draggable
  },
  props: {
    category: String,
    seriesId: String
  },
  data () {
    return {
      editMode: false,
      canDrag: false,
      studyList: [],
      lesson: null,
      editor: null
    }
  },
  computed: {
    studyListSorted: {
      get () {
        const sorted = [...this.studyList]

        return sorted
      },
      set (value) {
        const updates = {}
        value.forEach((item, index) => {
          db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').on('value', function (snapshot) {
            updates[item['.key'] + '/lesson'] = index
          })
        })
        db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').update(updates)
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
  methods: {
    addLesson () {
      this.$router.push({ name: 'lessonAdd', params: { category: this.category, seriesId: this.seriesId, lesson: this.studyListSorted.length } })
    },
    goToSpecificLesson (lessonId, lessonName) {
      if (!this.canDrag) {
        store.commit('setLessonName', lessonName)
        if (this.editMode) {
          this.$router.push({ name: 'lessonEdit', params: { category: this.category, seriesId: this.seriesId, lessonId: lessonId } })
        } else {
          this.$router.push({ name: 'lesson', params: { category: this.category, seriesId: this.seriesId, lessonId: lessonId, section: 'study' } })
        }
      }
    },
    editSeriesVideo () {
      if (this.editMode) {
        this.$router.push({ name: 'seriesVideoEdit', params: { category: this.category, seriesId: this.seriesId } })
      }
    }
  },
  mounted () {
    this.$watch('activeLanguageCode', () => {
      this.$rtdbBind('lesson', db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId))
      this.$rtdbBind('studyList', db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').orderByChild('lesson'))
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
  }
}
</script>

<style scoped>
.container {
  position: relative;
  text-align: center;
  width: 40%;
  margin: auto;
  cursor: pointer;
  user-select: none;
  padding: 0 4px;
}

.video-container {
  position: relative;
  text-align: center;
  width: 40%;
  margin: auto;
  user-select: none;
  padding: 0 4px;
}

@media only screen and (max-width: 600px) {
  .container {
    width: 100%;
  }

  .video-container {
    width: 100%;
  }
}

@media only screen and (min-width: 600px) {
  .container {
    width: 75%;
  }
  .video-container {
    width: 75%;
  }
}

@media only screen and (min-width: 768px) {
  .container {
    width: 65%;
  }
  .video-container {
    width: 65%;
  }
}

@media only screen and (min-width: 992px) {
  .container {
    width: 50%;
  }
  .video-container {
    width: 50%;
  }
}

@media only screen and (min-width: 1200px) {
  .container {
    width: 35%;
  }
  .video-container {
    width: 35%;
  }
}

.container img {
  margin: 0px 0px 5px;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
}

.video-container img {
  margin: 0px 0px 5px;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
}

.centered {
  position: absolute;
  top: 45%;
  margin: 0 auto;
  font-size: 1.35em;
  text-align: center;
  width: 100%;
}

.item-edit {
  cursor: pointer;
}
.item-drag {
  cursor: move;
}

.button-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  top: 64px;
}
</style>

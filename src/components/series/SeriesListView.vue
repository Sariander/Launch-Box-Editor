<template>
  <div class="series">
    <span class=button-container>
      <md-switch v-model="canDrag">Reorder</md-switch>
      <br>
      <md-switch v-model="editMode">Edit</md-switch>
    </span>
    <div class="video-container">
      <img v-bind:src="lesson.video">
    </div>
    <draggable v-model="studyListSorted" :options="{disabled: !canDrag}" class="content-container">
      <div v-for="item of studyListSorted" :key="item['.key']" v-bind:class="canDrag ? 'item-drag' : 'item-edit'" class="container" v-on:click="goToSpecificLesson(item['.key'])">
        <img v-bind:src="item.image">
      </div>
    </draggable>
    <md-speed-dial class="md-bottom-right">
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
    seriesName: String
  },
  data () {
    return {
      editMode: false,
      canDrag: false
    }
  },
  computed: {
    studyListSorted: {
      get () {
        let sorted = [...this.studyList]

        return sorted
      },
      set (value) {
        let updates = {}
        value.forEach((item, index) => {
          db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName).child('chapters').on('value', function (snapshot) {
            updates[item['.key'] + '/lesson'] = index
          })
        })
        db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName).child('chapters').update(updates)
      }
    }
  },
  methods: {
    addLesson () {
      this.$router.push({ name: 'lessonAdd', params: { category: this.category, seriesName: this.seriesName, lesson: this.studyListSorted.length } })
    },
    goToSpecificLesson (lessonName) {
      if (!this.canDrag) {
        if (this.editMode) {
          this.$router.push({name: 'lessonEdit', params: { category: this.category, seriesName: this.seriesName, lessonName: lessonName }})
        } else {
          this.$router.push({name: 'lesson', params: { category: this.category, seriesName: this.seriesName, lessonName: lessonName, section: 'study' }})
        }
      }
    }
  },
  firebase () {
    return {
      lesson: {
        source: db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName),
        asObject: true
      },
      studyList: db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName).child('chapters').orderByChild('lesson')
    }
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
}

.video-container {
  position: relative;
  text-align: center;
  width: 40%;
  margin: auto;
  user-select: none;
}

@media only screen and (max-width: 600px) {
  .container {
    width: 55%;
  }

  .video-container {
    width: 55%;
  }
}

@media only screen and (min-width: 600px) {
  .container {
    width: 50%;
  }
  .video-container {
    width: 50%;
  }
}

@media only screen and (min-width: 768px) {
  .container {
    width: 45%;
  }
  .video-container {
    width: 45%;
  }
}

@media only screen and (min-width: 992px) {
  .container {
    width: 40%;
  }
  .video-container {
    width: 40%;
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
  position: fixed;
  right: 0;
  top: 64px;
}
</style>

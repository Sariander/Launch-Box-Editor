<template>
  <div class="lessonEdit">
      <div class="content-container">
        <md-card-actions>
          <md-button class="md-accent" @click="confirmDialogActive = true">Remove Lesson</md-button>
        </md-card-actions>
        <span class="md-caption">Lesson Title</span>
        <br>
        <span class="md-subheading">{{lessonItem.title}}</span>
        <md-field>
          <label>Lesson Image</label>
          <md-input v-model="lessonItem.image"></md-input>
        </md-field>
        <md-field>
          <label>Lesson Local Image</label>
          <md-input v-model="lessonItem.localImage"></md-input>
        </md-field>
        <md-card-actions>
          <md-button @click="cancel()">Cancel</md-button>
          <md-button class="md-primary" @click="showTitleChangeDialog()">Change Lesson Title</md-button>
          <md-button class="md-primary" @click="updateLesson(lessonItem)">Save</md-button>
        </md-card-actions>
        <md-dialog :md-active.sync="confirmDialogActive">
        <md-dialog-title>Are you sure you want to remove this lesson?</md-dialog-title>
        <md-dialog-actions>
          <md-button @click="confirmDialogActive = false">Cancel</md-button>
          <md-button class="md-accent" @click="removeLesson()">Confirm</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="changeDialogActive">
        <md-dialog-title>Change the title of this lesson</md-dialog-title>
        <md-dialog-content>
          <md-field>
            <label>Lesson Title</label>
            <md-input v-model="tempName"></md-input>
          </md-field>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button @click="changeDialogActive = false">Cancel</md-button>
          <md-button class="md-primary" @click="changeLessonTitle(lessonItem)">Confirm</md-button>
        </md-dialog-actions>
      </md-dialog>
      </div>
  </div>
</template>

<script>
import { db } from '../../config/db'
import store from '../../config/store'

export default {
  props: {
    category: String,
    seriesName: String,
    lessonName: String
  },
  data () {
    return {
      confirmDialogActive: false,
      changeDialogActive: false,
      lessonItem: {
        title: '',
        image: '',
        lesson: ''
      },
      tempName: ''
    }
  },
  methods: {
    showTitleChangeDialog: function () {
      this.changeDialogActive = true
      this.tempName = this.lessonItem.title
    },
    changeLessonTitle: function (item) {
      this.lessonItem.title = this.tempName
      var futureTitle = this.tempName.replace(/\s+/g, '-').toLowerCase()
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref(store.getters.activeLanguageCode).child('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).remove()
      db.ref(store.getters.activeLanguageCode).child('series').child(this.category).child(this.seriesName).child('studies').child(futureTitle).set(copy)
      this.$router.push({ name: 'series', params: { category: this.category, seriesName: this.seriesName } })
    },
    updateLesson: function (item) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref(store.getters.activeLanguageCode).child('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).set(copy)
      this.$router.push({ name: 'series', params: { category: this.category, seriesName: this.seriesName } })
    },
    removeLesson: function () {
      db.ref(store.getters.activeLanguageCode).child('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).remove()
      this.$router.push({ name: 'series', params: { category: this.category, seriesName: this.seriesName } })
    },
    cancel: function () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.$bindAsObject('lessonItem', db.ref(store.getters.activeLanguageCode).child('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName))
  }
}
</script>

<style scoped>
.container {
  position: relative;
  text-align: center;
  width: 35%;
  margin: auto;
}

.container img {
  margin: 0px 0px 5px;
  width: 100%;
  height: 250px;
}

.video-container {
  position: relative;
  text-align: center;
  width: 35%;
  margin: auto;
}

.video-container img {
  margin: 0px 0px 5px;
  width: 100%;
}

.centered {
  position: absolute;
  top: 45%;
  margin: 0 auto;
  font-size: 1.35em;
  text-align: center;
  width: 100%;
}

.content-container {
  width: 80%;
  margin: 0 auto;
}
</style>

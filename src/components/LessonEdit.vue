<template>
  <div class="lessonAdd">
      <div class="content-container">
        <md-card-actions>
          <md-button class="md-accent" @click="removeLesson(lessonItem)">Remove Lesson</md-button>
        </md-card-actions>
        <md-field>
          <label>Lesson Title</label>
          <md-input v-model="lessonItem.title"></md-input>
        </md-field>
        <md-field>
          <label>Lesson Number</label>
          <md-input v-model="lessonItem.lesson"></md-input>
        </md-field>
        <md-field>
          <label>Lesson Image</label>
          <md-input v-model="lessonItem.image"></md-input>
        </md-field>
        <md-card-actions>
          <md-button class="md-primary" @click="cancel()">Cancel</md-button>
          <md-button class="md-primary" @click="updateLesson(lessonItem)">Save</md-button>
        </md-card-actions>
      </div>
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
      lessonItem: {
        title: '',
        image: '',
        lesson: ''
      }
    }
  },
  methods: {
    updateLesson: function (item) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).set(copy)
      this.$router.push({ name: 'series', params: { category: this.category, seriesName: this.seriesName } })
    },
    removeLesson: function (item) {
      db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).remove()
      this.$router.push({ name: 'series', params: { category: this.category, seriesName: this.seriesName } })
    },
    cancel: function () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.$bindAsObject('lessonItem', db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName))
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

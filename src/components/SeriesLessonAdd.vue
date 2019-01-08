<template>
  <div class="lessonAdd">
      <div class="content-container">
        <md-field>
          <label>Lesson Title</label>
          <md-input v-model="lessonItem.title"></md-input>
        </md-field>
        <md-field>
          <label>Lesson Image</label>
          <md-input v-model="lessonItem.image"></md-input>
        </md-field>
        <md-card-actions>
          <md-button @click="cancel()">Cancel</md-button>
          <md-button class="md-primary" @click="addLesson(lessonItem)">Add</md-button>
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
    lesson: Number
  },
  data () {
    return {
      lessonItem: {
        title: '',
        image: '',
        lesson: this.lesson
      }
    }
  },
  methods: {
    addLesson: function (item) {
      if (this.lessonItem.lesson === undefined) {
        this.lessonItem.lesson = -1
      }
      let key = this.lessonItem.title
      key = key.replace(/\s+/g, '-').toLowerCase()
      db.ref('series').child(this.category).child(this.seriesName).child('studies').child(key).set(item)
      this.$router.push({ name: 'series', params: { category: this.category, seriesName: this.seriesName } })
    },
    cancel: function () {
      this.$router.go(-1)
    }
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

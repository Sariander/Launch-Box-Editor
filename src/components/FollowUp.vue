<template>
  <div class="thrive1">
    <span class=button-container>
      <md-switch v-model="editMode">Edit</md-switch>
    </span>
    <div class="video-container">
      <img v-bind:src="lesson.image">
    </div>
    <div v-for="item of studyList" :key="item['.key']" class="container" v-on:click="goToSpecificLesson(item['.key'])">
      <img v-bind:src="item.image">
    </div>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  data () {
    return {
      editMode: false,
      category: 'Follow Up',
      seriesName: 'Follow Up'
    }
  },
  firebase () {
    return {
      lesson: {
        source: db.ref('series').child('Follow Up').child('Follow Up'),
        asObject: true
      },
      studyList: db.ref('series').child('Follow Up').child('Follow Up').child('studies').orderByChild('order')
    }
  },
  methods: {
    goToSpecificLesson (lessonName) {
      if (this.editMode) {
        this.$router.push({name: 'lessonEdit', params: { category: this.category, seriesName: this.seriesName, lessonName: lessonName }})
      } else {
        this.$router.push({name: 'lesson', params: { category: this.category, seriesName: this.seriesName, lessonName: lessonName, section: 'study' }})
      }
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
  cursor: pointer;
  user-select: none;
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
  user-select: none;
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

.button-container {
  float: right;
}
</style>

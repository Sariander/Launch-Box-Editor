<template>
  <div class="thrive1">
    <div class="video-container">
      <img v-bind:src="lesson.image">
    </div>
    <div v-for="item of studyList" :key="item['.key']" class="container">
      <img v-bind:src="item.image">
    </div>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  firebase () {
    return {
      lesson: {
        source: db.ref('series').child('Follow Up').child('Follow Up'),
        asObject: true
      },
      studyList: db.ref('series').child('Follow Up').child('Follow Up').child('studies').orderByChild('order')
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
</style>

<template>
  <div class="home">
    <div class="content-container">
      <md-button class="md-raised wide-button" @click="goToSection('learning')">Learn To Use Thrive</md-button>
      <br>
      <md-button class="md-raised wide-button" @click="goToSection('leading')">Lead A Thrive Group</md-button>
    </div>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  components: {

  },
  data () {
    return {
      category: 'Thrive 1'
    }
  },
  firebase () {
    return {
      seriesList: db.ref('series').child(this.category).orderByChild('order')
    }
  },
  methods: {
    goToSection (sectionName) {
      this.$router.push({ name: 'section', params: { sectionName: sectionName } })
    }
  }
}
</script>

<style scoped>
.content-container {
  width: 60%;
  margin: 0 auto;
}

.wide-button {
  width: 100%;
  margin: 40px 0 0 0
}
</style>

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
export default {
  components: {

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

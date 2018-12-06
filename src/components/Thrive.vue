<template>
  <div class="thrive">
    <span class=button-container>
      <md-switch v-model="editMode">Edit</md-switch>
    </span>
    <div v-for="item of seriesList" :key="item['.key']" class="container" v-on:click="goToSpecificSeries(item['.key'])">
      <img v-bind:src="item.image">
      <div class="centered">{{ item['.key'] }}</div>
    </div>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  props: {
    category: String
  },
  data () {
    return {
      seriesList: [],
      editMode: false
    }
  },
  methods: {
    goToSpecificSeries: function (seriesName) {
      if (this.editMode) {
        this.$router.push({ name: 'seriesEdit', params: { category: this.category, seriesName: seriesName } })
      } else {
        this.$router.push({ name: 'series', params: { category: this.category, seriesName: seriesName } })
      }
    }
  },
  mounted () {
    this.$watch('category', () => {
      this.$bindAsArray('seriesList', db.ref('series').child(this.category).orderByChild('order'))
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
  color: white;
  margin: auto;
  width: 35%;
  cursor: pointer;
  user-select: none;
}

.container img {
  width: 100%;
  filter: brightness(75%);
  margin: 0px 0px 5px;
  object-fit: cover;
  height: 150px;
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

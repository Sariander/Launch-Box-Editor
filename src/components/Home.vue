<template>
  <div class="home">
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
  }
}
</script>

<style scoped>

</style>

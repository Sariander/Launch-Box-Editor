<template>
  <div class="editors">
    <div class="content-container">
      <span v-if="editors">
        <div class="editor-container" v-for="item of editors" :key="item['.key']">
          <span class="left-container">
            <div>{{item.name}}</div>
            <div>{{item.email}}</div>
          </span>
          <md-button @click="editEditor(item.id)" class="md-accent right-button">Edit</md-button>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  data () {
    return {
      editors: null
    }
  },
  components: {

  },
  methods: {
    editEditor (id) {
      this.$router.push({ name: 'editorsEdit', params: { editorId: id } })
    }
  },
  firebase () {
    return {
      editors: db.ref('editors')
    }
  }
}
</script>

<style scoped>
.content-container {
  width: 50%;
  margin: 8px auto;
}
.editor-container{
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #bbb;
}
.left-container {
  flex-basis: 80%;
}
.right-button {
  flex-basis: 20%;
}

.md-button {
  margin: 2px 0 0 0;
}
</style>

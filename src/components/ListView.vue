<template>
  <ul>
    <ListViewItem v-for="item in items" v-bind:key="item.id" v-bind:item="item"></ListViewItem>
  </ul>
</template>

<script>
import ListViewItem from './ListViewItem'

let nextTodoId = 1

export default {
  components: {
    ListViewItem
  },
  data () {
    return {
      items: [
        {
          id: nextTodoId++,
          text: 'Learn Vue'
        },
        {
          id: nextTodoId++,
          text: 'Learn about single-file components'
        },
        {
          id: nextTodoId++,
          text: 'Fall in love'
        }
      ]
    }
  },
  methods: {

  },
  computed: {

  }
}
</script>

<style scoped>
</style>

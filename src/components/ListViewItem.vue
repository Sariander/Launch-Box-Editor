<template>
  <li> {{ item.text }} </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

    }
  },
  methods: {

  },
  computed: {

  }
}
</script>

<style scoped>
  li {
    padding: 10px 0px;
  }
</style>

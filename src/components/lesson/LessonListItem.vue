<template>
  <div class="lessonListItem">
    <div v-on:click="onRowClicked()" class="item-container" v-bind:class="canDrag ? 'item-drag' : 'item-edit'">
      <template v-if="item.type == 'text'">
        <div v-bind:class="item.style" v-html="highlight(item.important ? '*' + item.header : item.header, item.headerHighlights)"></div>
        <div v-if="item.style == 'detail' && item.details && item.details != ''" v-html="highlight(item.details, item.detailsHighlights)">{{ item.details }}</div>
      </template>
      <template v-if="item.type == 'idea'">
        <div class="bold"> {{ item.header }} </div>
        <img v-if="item.ideaStyle == 'video'" v-bind:src="'https://img.youtube.com/vi/' + item.url + '/0.jpg'">
        <img v-if="item.ideaStyle == 'image'" v-bind:src="item.url">
        <div> {{ item.details }} </div>
        <div v-if="item.ideaStyle == 'link'" class="orange"> {{ item.urlTitle }} </div>
      </template>
      <template v-else-if="item.type == 'video'">
        <div>{{ item.header }}</div>
        <img v-bind:src="'https://img.youtube.com/vi/' + item.url + '/0.jpg'">
      </template>
      <template v-else-if="item.type == 'image'">
        <img v-bind:src="item.url">
      </template>
    </div>
    <span class="material-divider" v-if="hasDivider"></span>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    canDrag: Boolean,
    hasDivider: Boolean
  },
  methods: {
    highlight (content, highlights) {
      if (!highlights) {
        return content
      }
      highlights.forEach(function (highlight) {
        content = content.replace(new RegExp(highlight, 'gi'), match => {
          return '<span class="orange-hightlight-text">' + match + '</span>'
        })
      })
      return content
    },
    onRowClicked () {
      this.$emit('row-clicked', this.item['.key'])
    }
  }
}
</script>

<style scoped>
.bold {
  font-weight: bold;
}
.detail {
  font-weight: bold;
}
.orange {
  color: orange;
}
.item-edit {
  cursor: pointer;
}
.item-drag {
  cursor: move;
}
.item-container {
  margin-top: 10px;
  margin-bottom: 5px;
}
.material-divider {
  display: block;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.12);
}
</style>


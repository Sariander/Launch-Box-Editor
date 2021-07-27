<template>
  <div class="lessonListItem">
    <div v-on:click="onRowClicked()" class="item-container" v-bind:class="[{'no-edit': !canEdit }, canDrag ? 'item-drag' : 'item-edit']">
      <template v-if="item.type == 'text'">
        <div v-bind:class="item.style" v-html="highlight(item.header, item.headerHighlights, item.headerColoredHighlights, item.headerLinkHighlights)"></div>
        <div v-if="item.style == 'detail' && item.details && item.details != ''">{{ item.details }}</div>
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
    hasDivider: Boolean,
    activeLanguageCode: String,
    canEdit: Boolean
  },
  methods: {
    highlight (content, highlights, coloredHighlights, linkHighlights) {
      if (highlights) {
        highlights.forEach(function (highlight) {
          content = content.replace(new RegExp(highlight, 'gi'), match => {
            return '<span class="bold-highlight-text">' + match + '</span>'
          })
        })
      }
      if (coloredHighlights) {
        coloredHighlights.forEach(function (highlight) {
          content = content.replace(new RegExp(highlight, 'gi'), match => {
            return '<span class="gold-highlight-text">' + match + '</span>'
          })
        })
      }
      if (linkHighlights) {
        linkHighlights.forEach(function (highlight) {
          content = content.replace(new RegExp(highlight, 'gi'), match => {
            return '<span class="gold-highlight-text">' + match + '</span>'
          })
        })
      }
      return content
    },
    onRowClicked () {
      if (this.canEdit) {
        this.$emit('row-clicked', this.item['.key'])
      }
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
  color: gold;
}
.subtitle {
  font-size: 18px;
  font-weight: bold;
}
.title {
  font-size: 22px;
  font-weight: bold;
  color: gold;
}
.review {
  color: gray;
}
.item-edit {
  cursor: pointer;
}
.item-drag {
  cursor: move;
}
.no-edit {
  cursor: auto;
}
.item-container {
  margin-top: 10px;
  margin-bottom: 5px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.material-divider {
  display: block;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.12);
}
</style>

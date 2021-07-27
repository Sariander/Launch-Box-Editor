<template>
  <div class="lessonListItem">
    <div v-on:click="onRowClicked()" class="item-container" v-bind:class="canDrag ? 'item-drag' : 'item-edit'">
      <template v-if="item.type == 'checklist'">
        <div class="subtitle"> {{ item.header }} </div>
        <ul>
        <li v-for="check of item.list" :key="check.id">
          <div> {{ check.title }}</div>
        </li>
        </ul>
      </template>
      <template v-if="item.type == 'text'">
        <div class="bold">{{item.header}}</div>
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
    highlight (content, highlights, coloredHighlights) {
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
      return content
    },
    onRowClicked () {
      this.$emit('row-clicked', this.item['.key'])
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: square;
}

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

<template>
  <div class="thrive">
    <draggable v-model="seriesListSorted" :disabled="!canDrag" class="content-container">
      <div v-for="(item, index) of seriesListSorted" :key="item['.key']" v-bind:class="canDrag ? 'item-drag' : 'item-edit'" class="container" v-on:click="goToSpecificSeries(item['.key'], index)">
        <img v-bind:src="item.image">
        <div class="centered">{{ item.title }}</div>
      </div>
    </draggable>
    <span class=button-container v-if="editor && editor.languages[activeLanguageCode].write">
      <md-switch v-model="canDrag">Reorder</md-switch>
      <md-switch v-model="editMode">Edit</md-switch>
    </span>
    <md-speed-dial v-if="editor && editor.languages[activeLanguageCode].write" class="md-bottom-right">
      <md-speed-dial-target @click="addSeries()">
        <md-tooltip md-direction="left">Add Series</md-tooltip>
        <md-icon>add</md-icon>
      </md-speed-dial-target>
    </md-speed-dial>
  </div>
</template>

<script>
import { db } from '../../config/db'
import draggable from 'vuedraggable'
import store from '../../config/store'

export default {
  components: {
    draggable
  },
  props: {
    category: String
  },
  data () {
    return {
      seriesList: [],
      editMode: false,
      canDrag: false,
      editor: null
    }
  },
  computed: {
    seriesListSorted: {
      get () {
        const sorted = [...this.seriesList]

        return sorted
      },
      set (value) {
        const updates = {}
        value.forEach((item, index) => {
          db.ref('series').child(store.getters.activeLanguageCode).child(this.category).on('value', function (snapshot) {
            updates[item['.key'] + '/order'] = index
          })
        })
        db.ref('series').child(store.getters.activeLanguageCode).child(this.category).update(updates)
      }
    },
    activeLanguageCode: {
      get () {
        return store.getters.activeLanguageCode
      },
      set (newValue) {
        store.commit('setActiveLanguageCode', newValue)
      }
    }
  },
  methods: {
    addSeries () {
      this.$router.push({ name: 'seriesAdd', params: { category: this.category, order: this.seriesListSorted.length } })
    },
    goToSpecificSeries: function (seriesId, index) {
      if (!this.canDrag) {
        store.commit('setSeriesName', this.seriesListSorted[index].title)
        if (this.editMode) {
          this.$router.push({ name: 'seriesEdit', params: { category: this.category, seriesId: seriesId } })
        } else {
          this.$router.push({ name: 'series', params: { category: this.category, seriesId: seriesId } })
        }
      }
    }
  },
  mounted () {
    this.$watch('category', () => {
      this.$rtdbBind('seriesList', db.ref('section').child(store.getters.activeLanguageCode).child(this.category).orderByChild('order'))
    }, {
      immediate: true
    })
    this.$watch('activeLanguageCode', () => {
      this.$rtdbBind('seriesList', db.ref('section').child(store.getters.activeLanguageCode).child(this.category).orderByChild('order'))
    }, {
      immediate: true
    })
    this.$watch('user', () => {
      if (store.getters.editorId) {
        this.$rtdbBind('editor', db.ref('editors').child(store.getters.editorId))
      }
    }, {
      immediate: true
    })
  }
}
</script>

<style lang="scss" scoped>
.content-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: auto;
}

.container {
  flex-basis: 100%;
  position: relative;
  text-align: center;
  color: white;
  cursor: pointer;
  user-select: none;
}

@media only screen and (max-width: 600px) {
  .content-container {
    width: 90%;
  }
}

@media only screen and (min-width: 600px) {
  .content-container {
    width: 70%;
  }
}

@media only screen and (min-width: 768px) {
  .content-container {
    width: 65%;
  }
}

@media only screen and (min-width: 992px) {
  .content-container {
    width: 60%;
  }
}

@media only screen and (min-width: 1200px) {
  .content-container {
    width: 50%;
  }
}

.container img {
  width: 100%;
  padding: 5px;
  object-fit: contain;
  // height: 150px;
  height: calc(19vh);
}

.centered {
  position: absolute;
  padding: 0px 0px 0px 12px;
  top: 4%;
  font-size: 2em;
  text-align: left;
  width: 100%;
  line-height: 1em;
  word-spacing: 100vw;
  font-weight: bold;
  text-shadow: 1px 1px #000000;
}

.item-edit {
  cursor: pointer;
}
.item-drag {
  cursor: move;
}

.button-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  top: 64px;
}
</style>

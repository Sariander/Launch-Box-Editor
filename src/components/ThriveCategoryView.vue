<template>
  <div class="thrive">
    <span class=button-container>
      <md-switch v-model="canDrag">Reorder</md-switch>
      <br>
      <md-switch v-model="editMode">Edit</md-switch>
    </span>
    <draggable v-model="seriesListSorted" :options="{disabled: !canDrag}" class="content-container">
      <div v-for="item of seriesListSorted" :key="item['.key']" v-bind:class="canDrag ? 'item-drag' : 'item-edit'" class="container" v-on:click="goToSpecificSeries(item['.key'])">
        <img v-bind:src="item.image">
        <div class="centered">{{ item['.key'] }}</div>
      </div>
    </draggable>
    <md-speed-dial class="md-bottom-right">
      <md-speed-dial-target @click="addSeries()">
        <md-tooltip md-direction="left">Add Series</md-tooltip>
        <md-icon>add</md-icon>
      </md-speed-dial-target>
    </md-speed-dial>
  </div>
</template>

<script>
import { db } from '../config/db'
import draggable from 'vuedraggable'

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
      canDrag: false
    }
  },
  computed: {
    seriesListSorted: {
      get () {
        let sorted = [...this.seriesList]

        return sorted
      },
      set (value) {
        let updates = {}
        value.forEach((item, index) => {
          db.ref('series').child(this.category).on('value', function (snapshot) {
            updates[item['.key'] + '/order'] = index
          })
        })
        db.ref('series').child(this.category).update(updates)
      }
    }
  },
  methods: {
    addSeries () {
      this.$router.push({ name: 'seriesAdd', params: { category: this.category, order: this.seriesListSorted.length } })
    },
    goToSpecificSeries: function (seriesName) {
      if (!this.canDrag) {
        if (this.editMode) {
          this.$router.push({ name: 'seriesEdit', params: { category: this.category, seriesName: seriesName } })
        } else {
          this.$router.push({ name: 'series', params: { category: this.category, seriesName: seriesName } })
        }
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

.item-edit {
  cursor: pointer;
}
.item-drag {
  cursor: move;
}

.button-container {
  float: right;
}
</style>

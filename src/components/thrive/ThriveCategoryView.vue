<template>
  <div class="thrive">
    <draggable v-model="seriesListSorted" :options="{disabled: !canDrag}" class="content-container">
      <div v-for="item of seriesListSorted" :key="item['.key']" v-bind:class="canDrag ? 'item-drag' : 'item-edit'" class="container" v-on:click="goToSpecificSeries(item['.key'])">
        <img v-bind:src="item.image">
      </div>
    </draggable>
    <span class=button-container>
      <md-switch v-model="canDrag">Reorder</md-switch>
      <br>
      <md-switch v-model="editMode">Edit</md-switch>
    </span>
    <md-speed-dial class="md-bottom-right">
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
          db.ref(store.getters.activeLanguageCode).child('launch').on('value', function (snapshot) {
            updates[item['.key'] + '/order'] = index
          })
        })
        db.ref(store.getters.activeLanguageCode).child('launch').update(updates)
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
      this.$bindAsArray('seriesList', db.ref(store.getters.activeLanguageCode).child('launch').orderByChild('order'))
    }, {
      immediate: true
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  text-align: center;
  color: white;
  margin: auto;
  width: 55%;
  cursor: pointer;
  user-select: none;
}

@media only screen and (max-width: 600px) {
  .container {
    width: 60%;
  }
}

@media only screen and (min-width: 600px) {
  .container {
    width: 60%;
  }
}

@media only screen and (min-width: 768px) {
  .container {
    width: 65%;
  }
}

@media only screen and (min-width: 992px) {
  .container {
    width: 70%;
  }
}

@media only screen and (min-width: 1200px) {
  .container {
    width: 70%;
  }
}

.container img {
  width: 100%;
  margin: 0px 0px 5px;
  object-fit: cover;
  height: 160px;
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
  position: fixed;
  right: 0;
  top: 64px;
}
</style>

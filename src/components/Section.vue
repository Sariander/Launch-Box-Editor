<template>
  <div class="home">
    <span class=button-container>
      <md-switch v-model="canDrag">Reorder</md-switch>
      <md-button class="md-primary" @click="updateList()">Save Order</md-button>
      <br>
      <md-switch v-model="canNavigate">Navigate</md-switch>
    </span>
    <div class="content-container">
    <draggable v-model="sectionList" :options="{disabled: !canDrag}" class="content-container">
      <div v-for="(item, index) of sectionList" :key="item['.key']">
        <div v-on:click="goToSectionOrEdit(item.sectionName, item['.key'])" class="item-container" v-bind:class="canDrag ? 'item-drag' : 'item-edit'">
          <template v-if="item.type == 'text'">
            <div v-bind:class="item.style">{{ item.header }}</div>
            <div v-if="item.style == 'detail' && item.details && item.details != ''">{{ item.details }}</div>
          </template>
          <template v-if="item.type == 'setting'">
            <md-switch>{{ item.title }}</md-switch>
          </template>
          <template v-if="item.type == 'section'">
            <div v-bind:class="'orange'">{{ item.sectionHeader }}</div>
          </template>
          <template v-if="item.type == 'link'">
            <div>{{ item.sectionHeader }}</div>
          </template>
          <template v-else-if="item.type == 'video'">
            <div>{{ item.header }}</div>
            <img v-bind:src="'https://img.youtube.com/vi/' + item.url + '/0.jpg'">
          </template>
          <template v-else-if="item.type == 'image'">
            <img v-bind:src="item.url">
          </template>
        </div>
        <span class="material-divider" v-if="index != sectionList.length-1"></span>
      </div>
    </draggable>
    <md-speed-dial class="md-bottom-right">
      <md-speed-dial-target @click="goToAdd()">
        <md-icon>add</md-icon>
      </md-speed-dial-target>
    </md-speed-dial>
    </div>
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
    sectionName: String
  },
  data () {
    return {
      canDrag: false,
      canNavigate: false,
      sectionList: []
    }
  },
  mounted () {
    this.$watch('sectionName', () => {
      this.$bindAsArray('sectionList', db.ref(this.sectionName).child('items'))
    }, {
      immediate: true
    })
  },
  methods: {
    goToSectionOrEdit: function (sectionName, key) {
      if (sectionName) {
        if (!this.canNavigate && !this.canDrag) {
          this.$router.push({ name: 'sectionEdit', params: { sectionName: this.sectionName, sectionItemKey: key } })
        } else if (this.canNavigate && !this.canDrag) {
          this.$router.push({ name: 'section', params: { sectionName: sectionName } })
        }
      } else {
        if (!this.canNavigate && !this.canDrag) {
          this.$router.push({ name: 'sectionEdit', params: { sectionName: this.sectionName, sectionItemKey: key } })
        }
      }
    },
    goToAdd: function () {
      this.$router.push({name: 'sectionAdd', params: { sectionName: this.sectionName }})
    },
    updateItem: function (item, index) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref(this.sectionName).child('items').child(index).set(copy)
    },
    updateList: function () {
      let self = this
      this.sectionList.forEach(function (value, index) {
        self.updateItem(value, index)
      })
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
.material-divider {
  display: block;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.12);
}
.item-container {
  margin-top: 10px;
  margin-bottom: 5px;
}
.content-container {
  width: 60%;
  margin: 0 auto;
}

.button-container {
  float: right;
}

.wide-button {
  width: 100%
}
</style>

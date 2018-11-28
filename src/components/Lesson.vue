<template>
  <div class="lesson">
    <md-tabs md-alignment="centered" md-sync-route>
      <md-tab v-on:click="changeSectionTab('study')" md-label="The Study"></md-tab>
      <md-tab v-on:click="changeSectionTab('leadersGuide')" md-label="Leader's Guide"></md-tab>
      <md-tab v-on:click="changeSectionTab('ideaBox')" md-label="Idea Box"></md-tab>
      <md-tab v-on:click="changeSectionTab('reviewCards')" md-label="Review Cards"></md-tab>
    </md-tabs>
    <md-dialog-actions>
      <md-switch v-model="canDrag">Reorder</md-switch>
      <md-button class="md-primary" @click="updateList()">Save</md-button>
    </md-dialog-actions>

    <draggable v-model="displayedList" :options="{disabled: !canDrag}" class="content-container">
      <div v-for="(item, index) of displayedList" :key="item['.key']">
        <div v-on:click="goToEdit(item['.key'])" class="item-container" v-bind:class="canDrag ? 'item-drag' : 'item-edit'">
          <template v-if="item.type == 'text'">
            <div v-bind:class="item.style">{{ item.header }}</div>
            <div v-if="item.style == 'detail' && item.details && item.details != ''">{{ item.details }}</div>
          </template>
          <template v-else-if="item.type == 'video'">
            <div>{{ item.header }}</div>
            <img v-bind:src="'https://img.youtube.com/vi/' + item.url + '/0.jpg'">
          </template>
          <template v-else-if="item.type == 'image'">
            <img v-bind:src="item.url">
          </template>
        </div>
        <span class="material-divider" v-if="index != displayedList.length-1"></span>
      </div>
    </draggable>
    <md-speed-dial class="md-bottom-right">
        <md-speed-dial-target @click="goToAdd()">
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
    category: String,
    seriesName: String,
    lessonName: String
  },
  data () {
    return {
      tempItem: null,
      canDrag: false,
      section: 'study',
      lessonItems: [],
      displayedList: [],
      showDialog: false,
      activeEditItem: {
        header: '',
        details: '',
        headerUrls: [''],
        headerHighlights: ['']
      }
    }
  },
  firebase () {
    return {
      studyList: db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('study'),
      leadersGuideList: db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('leadersGuide'),
      ideaBoxList: db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child('ideaBox'),
      reviewCardsList: db.ref('series').child(this.category).child(this.seriesName).child('reviewCards')
    }
  },
  mounted () {
    switch (this.section) {
      case 'study':
        this.displayedList = this.studyList
        break
      case 'leadersGuide':
        this.displayedList = this.leadersGuideList
        break
      case 'ideaBox':
        this.displayedList = this.ideaBoxList
        break
      case 'reviewCards':
        this.displayedList = this.reviewCardsList
        break
      default:
    }
  },
  methods: {
    changeSectionTab: function (sectionName) {
      this.section = sectionName
      switch (this.section) {
        case 'study':
          this.displayedList = this.studyList
          break
        case 'leadersGuide':
          this.displayedList = this.leadersGuideList
          break
        case 'ideaBox':
          this.displayedList = this.ideaBoxList
          break
        case 'reviewCards':
          this.displayedList = this.reviewCardsList
          break
        default:
      }
    },
    goToAdd: function () {
      this.$router.push({ name: 'add', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.section } })
    },
    goToEdit (key) {
      if (!this.canDrag) {
        this.$router.push({ name: 'edit', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, sectionName: this.section, lessonItemKey: key } })
      }
    },
    updateItem: function (item, index) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      if (this.sectionName === 'reviewCards') {
        db.ref('series').child(this.category).child(this.seriesName).child(this.section).child(item['.key']).set(copy)
      } else {
        db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child(this.section).child(index).set(copy)
      }
    },
    updateList: function () {
      let self = this
      this.displayedList.forEach(function (value, index) {
        self.updateItem(value, index)
      })
    }
  }
}
</script>
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
.content-container {
  width: 60%;
  margin: 0 auto;
}
.item-container {
  margin-top: 10px;
  margin-bottom: 5px;
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
.md-dialog {
  width: 60%;
  padding-left: 10px;
  padding-right: 10px;
}
</style>

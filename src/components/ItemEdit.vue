<template>
  <div class="lesson">
    <div class="content-container">
      <md-card-actions>
        <md-button class="md-accent" @click="removeItem(lessonItem)">Remove Item</md-button>
      </md-card-actions>
      <md-field>
        <label for="type">Type</label>
        <md-select v-model="lessonItem.type" name="type" id="type">
          <md-option value="text">Text</md-option>
          <md-option value="video">Video</md-option>
          <md-option value="image">Image</md-option>
        </md-select>
      </md-field>
      <md-field>
        <label>Header</label>
        <md-textarea v-model="lessonItem.header"></md-textarea>
      </md-field>
      <md-field v-if="lessonItem.type == 'text'">
        <label>Details</label>
        <md-textarea v-model="lessonItem.details"></md-textarea>
      </md-field>
      <md-field v-if="lessonItem.type == 'video'">
        <label>Video Url</label>
        <md-textarea v-model="lessonItem.url"></md-textarea>
      </md-field>
      <md-field v-if="lessonItem.type == 'image'">
        <label>Image Url</label>
        <md-textarea v-model="lessonItem.url"></md-textarea>
      </md-field>
      <md-card-actions v-if="lessonItem.type == 'text'">
        <md-button class="md-primary" @click="openHeaderDialog()">Add Header Highlight</md-button>
      </md-card-actions>
      <span v-if="lessonItem.type == 'text'" v-for="(item, index) of lessonItem.headerHighlights" :key="item['.key']">
        <md-field>
          <label>Header Highlight {{ index + 1 }}</label>
          <md-input v-model="lessonItem.headerHighlights[index]"></md-input>
        </md-field>
        <md-field>
          <label>Header Url {{ index + 1 }}</label>
          <md-input v-model="lessonItem.headerUrls[index]"></md-input>
        </md-field>
        <md-card-actions>
          <md-button class="md-accent" @click="removeHeaderItem(index)">Remove</md-button>
        </md-card-actions>
      </span>
      <md-card-actions v-if="lessonItem.type == 'text'">
        <md-button class="md-primary" @click="openDetailDialog()">Add Detail Highlight</md-button>
      </md-card-actions>
      <span v-if="lessonItem.type == 'text'" v-for="(item, index) of lessonItem.detailsHighlights" :key="item['.key']">
        <md-field>
          <label>Detail Highlight {{ index + 1 }}</label>
          <md-input v-model="lessonItem.detailsHighlights[index]"></md-input>
        </md-field>
        <md-field>
          <label>Detail Url {{ index + 1 }}</label>
          <md-input v-model="lessonItem.detailsUrls[index]"></md-input>
        </md-field>
        <md-card-actions>
          <md-button class="md-accent" @click="removeDetailItem(index)">Remove</md-button>
        </md-card-actions>
      </span>
      <md-field v-if="lessonItem.type == 'text'">
        <label for="style">Style</label>
        <md-select v-model="lessonItem.style" name="style" id="style">
          <md-option value="regular">Regular Header</md-option>
          <md-option value="bold">Bold Header</md-option>
          <md-option value="detail">Header and Details</md-option>
          <md-option value="orange">Orange Header</md-option>
        </md-select>
      </md-field>
      <md-card-actions>
        <md-button class="md-primary" @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="updateItem(lessonItem)">Save</md-button>
      </md-card-actions>
      <md-dialog :md-active.sync="headerDialogActive">
        <md-dialog-title>New Header Highlight</md-dialog-title>
        <md-field>
          <label>Header Highlight</label>
          <md-input v-model="newHeaderHighlight"></md-input>
        </md-field>
        <md-field>
          <label>Header Url</label>
          <md-input v-model="newHeaderUrl"></md-input>
        </md-field>
        <md-dialog-actions>
          <md-button class="md-primary" @click="clearHeaderFieldsAndClose()">Cancel</md-button>
          <md-button class="md-primary" @click="addHeaderItem()">Save</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="detailDialogActive">
        <md-dialog-title>New Detail Highlight</md-dialog-title>
        <md-field>
          <label>Detail Highlight</label>
          <md-input v-model="newDetailHighlight"></md-input>
        </md-field>
        <md-field>
          <label>Detail Url</label>
          <md-input v-model="newDetailUrl"></md-input>
        </md-field>
        <md-dialog-actions>
          <md-button class="md-primary" @click="clearDetailFieldsAndClose()">Cancel</md-button>
          <md-button class="md-primary" @click="addDetailItem()">Save</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  props: {
    category: String,
    seriesName: String,
    lessonName: String,
    sectionName: String,
    lessonItemKey: String
  },
  data () {
    return {
      headerDialogActive: false,
      detailDialogActive: false,
      newHeaderHighlight: '',
      newHeaderUrl: '',
      newDetailHighlight: '',
      newDetailUrl: '',
      lessonItem: {
        type: 'text',
        header: '',
        details: '',
        headerUrls: [],
        headerHighlights: [],
        detailsHighlights: [],
        detailsUrls: []
      }
    }
  },
  mounted () {
    this.$watch('sectionName', () => {
      if (this.sectionName === 'reviewCards') {
        this.$bindAsObject('lessonItem', db.ref('series').child(this.category).child(this.seriesName).child(this.sectionName).child(this.lessonItemKey))
      } else {
        this.$bindAsObject('lessonItem', db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child(this.sectionName).child(this.lessonItemKey))
      }
    }, {
      immediate: true
    })
  },
  methods: {
    cancel: function () {
      this.$router.go(-1)
    },
    addHeaderItem: function () {
      if (!this.lessonItem.headerHighlights) {
        this.$set(this.lessonItem, 'headerHighlights', [])
      }
      this.lessonItem.headerHighlights.push(this.newHeaderHighlight)
      if (!this.lessonItem.headerUrls) {
        this.$set(this.lessonItem, 'headerUrls', [])
      }
      this.lessonItem.headerUrls.push(this.newHeaderUrl)
      this.headerDialogActive = false
    },
    addDetailItem: function () {
      if (!this.lessonItem.detailsHighlights) {
        this.$set(this.lessonItem, 'detailsHighlights', [])
      }
      this.lessonItem.detailsHighlights.push(this.newDetailHighlight)
      if (!this.lessonItem.detailsUrls) {
        this.$set(this.lessonItem, 'detailsUrls', [])
      }
      this.lessonItem.detailsUrls.push(this.newDetailUrl)
      this.detailDialogActive = false
    },
    removeHeaderItem: function (index) {
      this.lessonItem.headerHighlights.splice(index, 1)
      this.lessonItem.headerUrls.splice(index, 1)
    },
    removeDetailItem: function (index) {
      this.lessonItem.detailsHighlights.splice(index, 1)
      this.lessonItem.detailsUrls.splice(index, 1)
    },
    openHeaderDialog: function () {
      this.newHeaderHighlight = ''
      this.newHeaderUrl = ''
      this.headerDialogActive = true
    },
    clearHeaderFieldsAndClose: function () {
      this.newHeaderHighlight = ''
      this.newHeaderUrl = ''
      this.headerDialogActive = false
    },
    openDetailDialog: function () {
      this.newDetailHighlight = ''
      this.newDetailUrl = ''
      this.detailDialogActive = true
    },
    clearDetailFieldsAndClose: function () {
      this.newDetailHighlight = ''
      this.newDetailUrl = ''
      this.detailDialogActive = false
    },
    updateItem: function (item) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      if (this.sectionName === 'reviewCards') {
        db.ref('series').child(this.category).child(this.seriesName).child(this.sectionName).child(item['.key']).set(copy)
      } else {
        db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child(this.sectionName).child(item['.key']).set(copy)
      }
      this.$router.push({ name: 'lesson', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, section: this.sectionName } })
    },
    removeItem: function (item) {
      if (this.sectionName === 'reviewCards') {
        db.ref('series').child(this.category).child(this.seriesName).child(this.sectionName).child(item['.key']).remove()
      } else {
        db.ref('series').child(this.category).child(this.seriesName).child('studies').child(this.lessonName).child(this.sectionName).child(item['.key']).remove()
      }
      this.$router.push({ name: 'lesson', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, section: this.sectionName } })
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
  width: 80%;
  margin: 0 auto;
  padding-top: 10px;
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

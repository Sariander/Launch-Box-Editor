<template>
  <div class="lesson">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <div class="content-container">
      <md-card-actions>
        <md-button class="md-accent" @click="confirmDialogActive = true">Remove Item</md-button>
      </md-card-actions>
      <md-field>
        <label for="type">Type</label>
        <md-select v-model="lessonItem.type" name="type" id="type">
          <md-option value="text">Text</md-option>
          <md-option value="checklist">Checklist</md-option>
        </md-select>
      </md-field>
      <md-field>
        <label>Header</label>
        <md-textarea v-model="lessonItem.header"></md-textarea>
      </md-field>
      <md-field v-if="lessonItem.type == 'text'">
        <label>ID</label>
        <md-textarea v-model="lessonItem.id"></md-textarea>
      </md-field>
      <md-card-actions v-if="lessonItem.type == 'checklist'">
        <md-button class="md-primary" @click="openHeaderDialog()">Add Checklist Item</md-button>
      </md-card-actions>
      <div v-if="lessonItem.type == 'checklist'" class="md-layout md-gutter md-alignment-center-left">
        <span v-for="(item, index) of lessonItem.list" :key="item['.key']" class="md-layout-item md-xlarge-size-33 md-large-size-50 md-medium-size-50 md-small-size-100 md-xsmall-size-100">
          <md-field>
            <label>Checklist Title {{ index + 1 }}</label>
            <md-input v-model="item.title"></md-input>
          </md-field>
          <md-field>
            <label>Checklist ID {{ index + 1 }}</label>
            <md-input v-model="item.id"></md-input>
          </md-field>
          <md-card-actions>
            <md-button class="md-accent" @click="removeHeaderItem(index)">Remove</md-button>
          </md-card-actions>
        </span>
      </div>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="updateItem(lessonItem)">Save</md-button>
      </md-card-actions>
      <md-dialog :md-active.sync="headerDialogActive">
        <md-dialog-title>New Checklist Item</md-dialog-title>
        <md-field>
          <label>Checklist Title</label>
          <md-input v-model="newItemTitle"></md-input>
        </md-field>
        <md-field>
          <label>Checklist ID</label>
          <md-input v-model="newItemID"></md-input>
        </md-field>
        <md-dialog-actions>
          <md-button @click="clearHeaderFieldsAndClose()">Cancel</md-button>
          <md-button class="md-primary" @click="addListItem()">Save</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="confirmDialogActive">
        <md-dialog-title>Are you sure you want to remove this item?</md-dialog-title>
        <md-dialog-actions>
          <md-button @click="confirmDialogActive = false">Cancel</md-button>
          <md-button class="md-accent" @click="removeItem(lessonItem)">Confirm</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
import { db, firestorage } from '../../config/db'
import store from '../../config/store'

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
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      confirmDialogActive: false,
      headerDialogActive: false,
      detailDialogActive: false,
      newItemTitle: '',
      newItemID: '',
      lessonItem: {
        type: 'text',
        header: '',
        list: []
      }
    }
  },
  mounted () {
    this.$watch('sectionName', () => {
      this.$bindAsObject('lessonItem', db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName).child('chapters').child(this.lessonName).child('study').child(this.lessonItemKey))
    }, {
      immediate: true
    })
  },
  watch: {
    uploadTask: function () {
      this.uploadTask.on('state_changed', sp => {
        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      },
      null,
      () => {
        this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          this.uploadEnd = true
          this.downloadURL = downloadURL
          this.lessonItem.url = this.downloadURL
          this.$emit('downloadURL', downloadURL)
        })
      })
    }
  },
  methods: {
    cancel: function () {
      if (this.uploadEnd) {
        this.deleteImage(true)
      } else {
        this.$router.replace({ name: 'lesson', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, section: this.sectionName } })
      }
    },
    addListItem: function () {
      if (!this.lessonItem.list) {
        this.$set(this.lessonItem, 'list', [])
      }
      this.lessonItem.list.push({title: this.newItemTitle, id: this.newItemID})
      this.headerDialogActive = false
    },
    removeHeaderItem: function (index) {
      this.lessonItem.list.splice(index, 1)
    },
    openHeaderDialog: function () {
      this.newItemTitle = ''
      this.newItemID = ''
      this.headerDialogActive = true
    },
    clearHeaderFieldsAndClose: function () {
      this.newItemTitle = ''
      this.newItemID = ''
      this.headerDialogActive = false
    },
    updateItem: function (item) {
      this.prepareItemForSending()
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName).child('chapters').child(this.lessonName).child('study').child(item['.key']).set(copy)
      this.$router.replace({ name: 'lesson', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, section: this.sectionName } })
    },
    removeItem: function (item) {
      db.ref(store.getters.activeLanguageCode).child('launch').child(this.seriesName).child('chapters').child(this.lessonName).child('study').child(item['.key']).remove()
      this.$router.replace({ name: 'lesson', params: { category: this.category, seriesName: this.seriesName, lessonName: this.lessonName, section: this.sectionName } })
    },
    selectFile () {
      this.$refs.uploadInput.click()
    },
    detectFiles (e) {
      let fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    upload (file) {
      this.fileName = file.name
      this.uploading = true
      this.uploadTask = firestorage.ref(this.seriesName + '/' + this.lessonName + '/' + file.name).put(file)
    },
    deleteImage (navigate) {
      firestorage
        .ref(this.seriesName + '/' + this.lessonName + '/' + this.fileName)
        .delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          this.lessonItem.url = ''
          if (navigate) {
            this.$router.go(-1)
          }
        })
        .catch((error) => {
          console.error(`file delete error occured: ${error}`)
        })
    },
    YouTubeGetID (url) {
      var ID = ''
      url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
      if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_-]/i)
        ID = ID[0]
      } else if (url[0] !== undefined) {
        ID = url[0]
      } else {
        ID = url
      }
      return ID
    },
    prepareItemForSending () {
      if (this.lessonItem.order === undefined) {
        this.lessonItem.order = -1
      }
      this.lessonItem.header = this.lessonItem.header || ''
      switch (this.lessonItem.type) {
        case 'idea':
          this.lessonItem.details = this.lessonItem.details || ''
          this.lessonItem.url = this.lessonItem.url || ''
          this.lessonItem.ideaStyle = this.lessonItem.ideaStyle || 'text'
          this.lessonItem.urlTitle = this.lessonItem.urlTitle || ''
          if (this.lessonItem.ideaStyle === 'video') {
            this.lessonItem.url = this.YouTubeGetID(this.lessonItem.url)
          }
          break
        case 'video':
          this.lessonItem.url = this.lessonItem.url || ''
          this.lessonItem.url = this.YouTubeGetID(this.lessonItem.url)
          break
        case 'image':
          this.lessonItem.url = this.lessonItem.url || ''
          break
        default:
          break
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
  width: 40%;
  padding-left: 10px;
  padding-right: 10px;
}
input[type="file"] {
  position: absolute;
  clip: rect(0,0,0,0);
}

.md-layout-item.md-size-2 {
    min-width: 2%;
    max-width: 2%;
    flex: 0 1 2%;
}

.md-tooltip {
  font-size: 12px;
}

</style>

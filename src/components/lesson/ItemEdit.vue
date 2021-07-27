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
        <md-content>
          <md-field>
            <label>Checklist Title</label>
            <md-input v-model="newItemTitle"></md-input>
          </md-field>
          <md-field>
            <label>Checklist ID</label>
            <md-input v-model="newItemID"></md-input>
          </md-field>
        </md-content>
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
    seriesId: String,
    lessonId: String,
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
      },
      editor: null
    }
  },
  mounted () {
    this.$watch('sectionName', () => {
      this.$rtdbBind('lessonItem', db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(this.lessonItemKey))
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
        this.$router.go(-1)
      }
    },
    addListItem: function () {
      if (!this.lessonItem.list) {
        this.$set(this.lessonItem, 'list', [])
      }
      this.lessonItem.list.push({ title: this.newItemTitle, id: this.newItemID })
      this.headerDialogActive = false
    },
    removeHeaderItem: function (index) {
      this.lessonItem.list.splice(index, 1)
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
    updateItem: function (item) {
      this.prepareItemForSending()
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']

      db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(item['.key']).set(copy)
      this.$router.go(-1)
    },
    removeItem: function (item) {
      db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(item['.key']).remove()
      this.$router.go(-1)
    },
    onTypeSelect (type) {
      if (type === 'video') {
        if (this.lessonItem.url) {
          this.lessonItem.url = this.lessonItem.url || ''
          this.lessonItem.url = this.YouTubeGetID(this.lessonItem.url)
          this.thumbnailUrl = 'https://img.youtube.com/vi/' + this.lessonItem.url + '/0.jpg'
        }
      }
    },
    loadThumbnail () {
      this.lessonItem.url = this.lessonItem.url || ''
      this.lessonItem.url = this.YouTubeGetID(this.lessonItem.url)
      this.thumbnailUrl = 'https://img.youtube.com/vi/' + this.lessonItem.url + '/0.jpg'
    },
    selectFile () {
      this.$refs.uploadInput.click()
    },
    detectFiles (e) {
      const fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    upload (file) {
      this.fileName = file.name
      this.uploading = true
      this.uploadTask = firestorage.ref(this.seriesId + '/' + this.lessonId + '/' + store.getters.activeLanguageCode + '/' + file.name).put(file)
    },
    deleteImage (navigate) {
      firestorage
        .ref(this.seriesId + '/' + this.lessonId + '/' + store.getters.activeLanguageCode + '/' + this.fileName)
        .delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          if (!navigate) {
            if (this.sectionName === 'reviewCards') {
              db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child(this.sectionName).child(this.lessonItemKey).child('url').once('value', snapshot => {
                this.lessonItem.url = snapshot.val()
              })
            } else {
              db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('studies').child(this.lessonId).child(this.sectionName).child(this.lessonItemKey).child('url').once('value', snapshot => {
                this.lessonItem.url = snapshot.val()
              })
            }
          }
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
        case 'text':
          this.lessonItem.details = this.lessonItem.details || ''
          this.lessonItem.style = this.lessonItem.style || 'regular'
          break
        case 'checklist':
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
input[type="file"] {
  position: absolute;
  clip: rect(0,0,0,0);
}

.md-content {
  padding: 0px 8px;
}

.md-tooltip {
  font-size: 12px;
}

</style>

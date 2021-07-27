<template>
  <div class="lesson">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <div class="content-container">
      <md-card-actions>
        <md-button class="md-accent" @click="confirmDialogActive = true">Remove Item</md-button>
      </md-card-actions>
      <md-field>
        <label for="type">Type</label>
        <md-select v-model="lessonItem.type" @md-selected="onTypeSelect" name="type" id="type">
          <md-option value="text">Text</md-option>
          <md-option v-if="editor && editor.admin" value="idea">Idea</md-option>
          <md-option value="video">Youtube Video</md-option>
          <md-option value="image">Image</md-option>
        </md-select>
      </md-field>
      <md-field v-if="lessonItem.type == 'text' || lessonItem.type == 'idea'">
        <label>Header</label>
        <md-textarea v-model="lessonItem.header"></md-textarea>
      </md-field>
      <md-field v-if="(lessonItem.type == 'text' && lessonItem.style == 'detail') || lessonItem.type == 'idea'">
        <label>Details</label>
        <md-textarea v-model="lessonItem.details"></md-textarea>
      </md-field>
      <span v-if="lessonItem.type == 'video'">
        <div class="md-caption">Thumbnail</div>
        <img :src="thumbnailUrl" width="30%" />
        <div>
          <md-button class="md-primary" @click="loadThumbnail">Load Thumbnail</md-button>
        </div>
      </span>
      <md-field v-if="lessonItem.type == 'video'">
        <label>Video ID</label>
        <md-textarea v-model="lessonItem.url"></md-textarea>
      </md-field>
      <span v-if="lessonItem.type == 'image'">
        <div class="md-caption">Image</div>
        <img :src="lessonItem.url" width="20%" />
        <div v-if="!uploadEnd && !uploading">
          <md-button class="md-primary" @click="selectFile">Upload New Image</md-button>
        </div>
        <input id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)"/>
        <md-progress-bar v-if="uploading && !uploadEnd" md-mode="determinate" :md-value="progressUpload"></md-progress-bar>
        <div v-if="uploadEnd">
          <md-button class="md-accent" @click="deleteImage(false)">Revert To Previous Image</md-button>
        </div>
      </span>
      <md-field v-if="lessonItem.type == 'image'">
        <label>Local Image Filename</label>
        <md-textarea v-model="lessonItem.localUrl"></md-textarea>
      </md-field>
      <md-card-actions v-if="lessonItem.type == 'text'">
        <md-button class="md-primary" @click="openHeaderDialog()">Add Header Highlight</md-button>
      </md-card-actions>
      <div v-if="lessonItem.type == 'text'" class="md-layout md-gutter md-alignment-center-left">
        <span v-for="(item, index) of lessonItem.headerHighlights" :key="item['.key']" class="md-layout-item md-xlarge-size-33 md-large-size-50 md-medium-size-50 md-small-size-100 md-xsmall-size-100">
          <md-field>
            <label>Header Highlight {{ index + 1 }}</label>
            <md-input v-model="lessonItem.headerHighlights[index]"></md-input>
          </md-field>
          <md-card-actions>
            <md-button class="md-accent" @click="removeHeaderItem(index)">Remove</md-button>
          </md-card-actions>
        </span>
      </div>
      <md-card-actions v-if="lessonItem.type == 'text'">
        <md-button class="md-primary" @click="openDetailDialog()">Add Header Colored Highlight</md-button>
      </md-card-actions>
      <div v-if="lessonItem.type == 'text'" class="md-layout md-gutter md-alignment-center-left">
        <span v-for="(item, index) of lessonItem.headerColoredHighlights" :key="item['.key']" class="md-layout-item md-xlarge-size-33 md-large-size-50 md-medium-size-50 md-small-size-100 md-xsmall-size-100">
          <md-field>
            <label>Header Colored Highlight {{ index + 1 }}</label>
            <md-input v-model="lessonItem.headerColoredHighlights[index]"></md-input>
          </md-field>
          <md-card-actions>
            <md-button class="md-accent" @click="removeColoredHeaderItem(index)">Remove</md-button>
          </md-card-actions>
        </span>
      </div>
      <md-card-actions v-if="lessonItem.type == 'text'">
        <md-button class="md-primary" @click="openHeaderLinkDialog()">Add Header Link Highlight</md-button>
      </md-card-actions>
      <div v-if="lessonItem.type == 'text'" class="md-layout md-gutter md-alignment-center-left">
        <span v-for="(item, index) of lessonItem.headerLinkHighlights" :key="item['.key']" class="md-layout-item md-xlarge-size-33 md-large-size-50 md-medium-size-50 md-small-size-100 md-xsmall-size-100">
          <md-field>
            <label>Header Link {{ index + 1 }}</label>
            <md-input v-model="lessonItem.headerLinkHighlights[index]"></md-input>
          </md-field>
          <md-card-actions>
            <md-button class="md-accent" @click="removeHeaderLinkItem(index)">Remove</md-button>
          </md-card-actions>
        </span>
      </div>
      <md-card-actions v-if="lessonItem.type == 'text'">
        <md-button class="md-primary" @click="openHeaderUrlDialog()">Add Header Link Url</md-button>
      </md-card-actions>
      <div v-if="lessonItem.type == 'text'" class="md-layout md-gutter md-alignment-center-left">
        <span v-for="(item, index) of lessonItem.headerLinkUrls" :key="item['.key']" class="md-layout-item md-xlarge-size-33 md-large-size-50 md-medium-size-50 md-small-size-100 md-xsmall-size-100">
          <md-field>
            <label>Header Url {{ index + 1 }}</label>
            <md-input v-model="lessonItem.headerLinkUrls[index]"></md-input>
          </md-field>
          <md-card-actions>
            <md-button class="md-accent" @click="removeHeaderUrlItem(index)">Remove</md-button>
          </md-card-actions>
        </span>
      </div>
      <md-field v-if="lessonItem.type == 'idea'">
        <label for="ideaStyle">Idea Type</label>
        <md-select v-model="lessonItem.ideaStyle" name="ideaStyle" id="ideaStyle">
          <md-option value="text">Text</md-option>
          <md-option value="link">Link</md-option>
          <md-option value="image">Image</md-option>
          <md-option value="video">Video</md-option>
        </md-select>
      </md-field>
      <md-field v-if="lessonItem.type == 'idea' && lessonItem.ideaStyle == 'link'">
        <label>Link Title</label>
        <md-input v-model="lessonItem.urlTitle"></md-input>
      </md-field>
      <md-field v-if="lessonItem.type == 'idea' && lessonItem.ideaStyle == 'link'">
        <label>Link Url</label>
        <md-input v-model="lessonItem.url"></md-input>
      </md-field>
      <md-field v-if="lessonItem.type == 'idea' && lessonItem.ideaStyle == 'image'">
        <label>Image Url</label>
        <md-input v-model="lessonItem.url"></md-input>
      </md-field>
      <md-field v-if="lessonItem.type == 'idea' && lessonItem.ideaStyle == 'video'">
        <label>Video ID</label>
        <md-input v-model="lessonItem.url"></md-input>
      </md-field>
      <md-field v-if="lessonItem.type == 'text'">
        <label for="style">Style</label>
        <md-select v-model="lessonItem.style" name="style" id="style">
          <md-option value="regular">Regular Header</md-option>
          <md-option value="bold">Bold Header</md-option>
          <md-option value="subtitle">Subtitle Header</md-option>
          <md-option value="title">Title Header</md-option>
          <md-option value="detail">Header and Details</md-option>
        </md-select>
      </md-field>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="updateItem(lessonItem)">Save</md-button>
      </md-card-actions>
      <md-dialog :md-active.sync="headerDialogActive">
        <md-dialog-title>New Header Highlight</md-dialog-title>
        <md-field>
          <label>Header Highlight</label>
          <md-input v-model="newHeaderHighlight"></md-input>
        </md-field>
        <md-dialog-actions>
          <md-button @click="clearHeaderFieldsAndClose()">Cancel</md-button>
          <md-button class="md-primary" @click="addHeaderItem()">Save</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="detailDialogActive">
        <md-dialog-title>New Header Colored Highlight</md-dialog-title>
        <md-field>
          <label>Header Colored Highlight</label>
          <md-input v-model="newHeaderColoredHighlight"></md-input>
        </md-field>
        <md-dialog-actions>
          <md-button @click="clearDetailFieldsAndClose()">Cancel</md-button>
          <md-button class="md-primary" @click="addHeaderColoredItem()">Save</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="confirmDialogActive">
        <md-dialog-title>Are you sure you want to remove this item?</md-dialog-title>
        <md-dialog-actions>
          <md-button @click="confirmDialogActive = false">Cancel</md-button>
          <md-button class="md-accent" @click="removeItem(lessonItem)">Confirm</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="headerLinkDialogActive">
        <md-dialog-title>New Header Link Highlight</md-dialog-title>
        <md-field>
          <label>Header Link Highlight</label>
          <md-input v-model="newHeaderLink"></md-input>
        </md-field>
        <md-dialog-actions>
          <md-button @click="clearHeaderLinkFieldsAndClose()">Cancel</md-button>
          <md-button class="md-primary" @click="addHeaderLinkItem()">Save</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="headerUrlDialogActive">
        <md-dialog-title>New Header Link Url</md-dialog-title>
        <md-field>
          <label>Header Url</label>
          <md-input v-model="newHeaderUrl"></md-input>
        </md-field>
        <md-dialog-actions>
          <md-button @click="clearHeaderUrlFieldsAndClose()">Cancel</md-button>
          <md-button class="md-primary" @click="addHeaderUrlItem()">Save</md-button>
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
    questionItemKey: String,
    questionKey: String
  },
  data () {
    return {
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      thumbnailUrl: '',
      confirmDialogActive: false,
      headerDialogActive: false,
      detailDialogActive: false,
      headerLinkDialogActive: false,
      headerUrlDialogActive: false,
      newHeaderHighlight: '',
      newHeaderColoredHighlight: '',
      newHeaderLink: '',
      newHeaderUrl: '',
      lessonItem: {
        type: 'text',
        header: '',
        details: '',
        headerHighlights: [],
        headerColoredHighlights: []
      },
      editor: null
    }
  },
  mounted () {
    this.$watch('sectionName', () => {
      this.$rtdbBind('lessonItem', db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(this.questionItemKey).child('list').child(this.questionKey))
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
    addHeaderItem: function () {
      if (!this.lessonItem.headerHighlights) {
        this.$set(this.lessonItem, 'headerHighlights', [])
      }
      this.lessonItem.headerHighlights.push(this.newHeaderHighlight)
      this.headerDialogActive = false
    },
    addHeaderColoredItem: function () {
      if (!this.lessonItem.headerColoredHighlights) {
        this.$set(this.lessonItem, 'headerColoredHighlights', [])
      }
      this.lessonItem.headerColoredHighlights.push(this.newHeaderColoredHighlight)
      this.detailDialogActive = false
    },
    addHeaderLinkItem: function () {
      if (!this.lessonItem.headerLinkHighlights) {
        this.$set(this.lessonItem, 'headerLinkHighlights', [])
      }
      this.lessonItem.headerLinkHighlights.push(this.newHeaderLink)
      this.headerLinkDialogActive = false
    },
    addHeaderUrlItem: function () {
      if (!this.lessonItem.headerLinkUrls) {
        this.$set(this.lessonItem, 'headerLinkUrls', [])
      }
      this.lessonItem.headerLinkUrls.push(this.newHeaderUrl)
      this.headerUrlDialogActive = false
    },
    removeHeaderItem: function (index) {
      this.lessonItem.headerHighlights.splice(index, 1)
    },
    removeColoredHeaderItem: function (index) {
      this.lessonItem.headerColoredHighlights.splice(index, 1)
    },
    removeHeaderLinkItem: function (index) {
      this.lessonItem.headerLinkHighlights.splice(index, 1)
    },
    removeHeaderUrlItem: function (index) {
      this.lessonItem.headerLinkUrls.splice(index, 1)
    },
    openHeaderDialog: function () {
      this.newHeaderHighlight = ''
      this.headerDialogActive = true
    },
    clearHeaderFieldsAndClose: function () {
      this.newHeaderHighlight = ''
      this.headerDialogActive = false
    },
    openDetailDialog: function () {
      this.newHeaderColoredHighlight = ''
      this.detailDialogActive = true
    },
    clearDetailFieldsAndClose: function () {
      this.newHeaderColoredHighlight = ''
      this.detailDialogActive = false
    },
    openHeaderLinkDialog: function () {
      this.newHeaderLink = ''
      this.headerLinkDialogActive = true
    },
    clearHeaderLinkFieldsAndClose: function () {
      this.newHeaderLink = ''
      this.headerLinkDialogActive = false
    },
    openHeaderUrlDialog: function () {
      this.newHeaderUrl = ''
      this.headerUrlDialogActive = true
    },
    clearHeaderUrlFieldsAndClose: function () {
      this.newHeaderUrl = ''
      this.headerUrlDialogActive = false
    },
    updateItem: function (item) {
      this.prepareItemForSending()
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(this.questionItemKey).child('list').child(item['.key']).set(copy)
      this.$router.go(-1)
    },
    removeItem: function (item) {
      db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(this.questionItemKey).child('list').child(item['.key']).remove()
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
      this.uploadTask = firestorage.ref(this.seriesId + '/' + this.lessonId + '/' + store.getters.activeLanguageCode + '/' + this.questionItemKey + '/' + file.name).put(file)
    },
    deleteImage (navigate) {
      firestorage
        .ref(this.seriesId + '/' + this.lessonId + '/' + store.getters.activeLanguageCode + '/' + this.questionItemKey + '/' + this.fileName)
        .delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          this.lessonItem.url = ''
          if (!navigate) {
            db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('study').child(this.questionItemKey).child('list').child(this.questionKey).child('url').once('value', snapshot => {
              this.lessonItem.url = snapshot.val()
            })
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
.md-content {
  padding: 0px 8px;
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

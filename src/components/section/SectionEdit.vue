<template>
  <div class="sectionEdit">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <div class="content-container">
      <md-card-actions v-if="sectionItem.type != 'dropdown'">
        <md-button class="md-accent" @click="confirmDialogActive = true">Remove Item</md-button>
      </md-card-actions>
      <md-field v-if="sectionItem.type != 'dropdown'">
        <label for="type">Type</label>
        <md-select v-model="sectionItem.type" name="type" id="type">
          <md-option value="section">Section</md-option>
          <md-option value="text">Text</md-option>
          <md-option value="video">Video</md-option>
          <md-option value="image">Image</md-option>
          <md-option value="link">Link</md-option>
          <md-option v-if="editor && editor.admin" value="setting">Setting</md-option>
        </md-select>
      </md-field>
      <md-field v-if="sectionItem.type != 'dropdown'">
        <label>Header</label>
        <md-textarea v-model="sectionItem.header"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'text'">
        <label>Details</label>
        <md-textarea v-model="sectionItem.details"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'video'">
        <label>Video Url</label>
        <md-textarea v-model="sectionItem.url"></md-textarea>
      </md-field>
      <span v-if="sectionItem.type == 'image'">
        <div class="md-caption">Image</div>
        <img :src="sectionItem.url" width="20%" />
        <div v-if="!uploadEnd && !uploading">
          <md-button class="md-primary" @click="selectFile">Upload New Image</md-button>
        </div>
        <input id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)"/>
        <md-progress-bar v-if="uploading && !uploadEnd" md-mode="determinate" :md-value="progressUpload"></md-progress-bar>
        <div v-if="uploadEnd">
          <md-button class="md-accent" @click="deleteImage(false)">Revert To Previous Image</md-button>
        </div>
      </span>
      <md-field v-if="sectionItem.type == 'section'">
        <label>Section Name</label>
        <md-textarea v-model="sectionItem.sectionName"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'section'">
        <label>Section Local Filename</label>
        <md-textarea v-model="sectionItem.localUrl"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'link'">
        <label>Link Url</label>
        <md-textarea v-model="sectionItem.linkUrl"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'setting'">
        <label>Setting Key</label>
        <md-textarea v-model="sectionItem.key"></md-textarea>
      </md-field>
      <span v-if="sectionItem.type == 'text'" class="md-layout md-alignment-center-left">
        <md-switch v-model="sectionItem.expandable" class="md-primary md-layout-item md-xlarge-size-15 md-large-size-15 md-medium-size-20 md-small-size-30 md-xsmall-size-35">Expandable</md-switch>
        <span class="md-layout-item md-size-2">
          <md-icon class="far fa-question-circle"></md-icon>
          <md-tooltip md-direction="right">Expand to view Details will be enabled.</md-tooltip>
        </span>
      </span>
      <md-field v-if="sectionItem.type == 'text'">
        <label for="style">Style</label>
        <md-select v-model="sectionItem.style" name="style" id="style">
          <md-option value="regular">Regular Header</md-option>
          <md-option value="bold">Bold Header</md-option>
          <md-option value="detail">Header and Details</md-option>
          <md-option value="orange">Orange Header</md-option>
          <md-option value="detail_orange">Orange Header and Details</md-option>
        </md-select>
      </md-field>
      <md-card-actions v-if="sectionItem.type == 'dropdown'">
        <md-button class="md-primary" @click="openOptionDialog()">Add Language</md-button>
      </md-card-actions>
      <span v-if="sectionItem.type == 'dropdown'">
        <span v-for="(item, index) of sectionItem.optionValues" :key="item['.key']">
          <md-field>
            <label>Language Title {{ index + 1 }}</label>
            <md-input v-model="sectionItem.optionTitles[index]"></md-input>
          </md-field>
          <md-field>
            <label>Language Code {{ index + 1 }}</label>
            <md-input v-model="sectionItem.optionValues[index]"></md-input>
          </md-field>
          <md-switch v-model="sectionItem.optionEnabled[index]" class="md-primary">Language Enabled</md-switch>
          <md-card-actions>
            <md-button class="md-accent" @click="removeOptionItem(index)">Remove</md-button>
          </md-card-actions>
        </span>
      </span>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="updateItem(sectionItem)">Save</md-button>
      </md-card-actions>
      <md-dialog :md-active.sync="confirmDialogActive">
        <md-dialog-title>Are you sure you want to remove this item?</md-dialog-title>
        <md-dialog-actions>
          <md-button @click="confirmDialogActive = false">Cancel</md-button>
          <md-button class="md-accent" @click="removeItem(sectionItem)">Confirm</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="optionDialogActive">
        <md-dialog-title>New Language</md-dialog-title>
        <md-dialog-content>
          <md-field>
            <label>Language Title</label>
            <md-input v-model="newOptionTitle"></md-input>
          </md-field>
          <md-field>
            <label>Language Code</label>
            <md-input v-model="newOptionValue"></md-input>
          </md-field>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button @click="clearOptionFieldsAndClose()">Cancel</md-button>
          <md-button class="md-primary" @click="addOptionItem()">Add</md-button>
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
    sectionName: String,
    sectionItemKey: String
  },
  data () {
    return {
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      editor: null,
      optionDialogActive: false,
      newOptionTitle: '',
      newOptionValue: '',
      confirmDialogActive: false,
      sectionItem: {
        type: '',
        order: '',
        lesson: ''
      }
    }
  },
  methods: {
    clearOptionFieldsAndClose: function () {
      this.newOptionTitle = ''
      this.newOptionValue = ''
      this.optionDialogActive = false
    },
    openOptionDialog: function () {
      this.newOptionTitle = ''
      this.newOptionValue = ''
      this.optionDialogActive = true
    },
    addOptionItem: function () {
      if (!this.sectionItem.optionValues) {
        this.$set(this.sectionItem, 'optionValues', [])
      }
      this.sectionItem.optionValues.push(this.newOptionValue)
      if (!this.sectionItem.optionTitles) {
        this.$set(this.sectionItem, 'optionTitles', [])
      }
      this.sectionItem.optionTitles.push(this.newOptionTitle)
      if (!this.sectionItem.optionEnabled) {
        this.$set(this.sectionItem, 'optionEnabled', [])
      }
      this.sectionItem.optionEnabled.push(false)
      this.optionDialogActive = false
    },
    removeOptionItem: function (index) {
      this.sectionItem.optionTitles.splice(index, 1)
      this.sectionItem.optionValues.splice(index, 1)
      this.sectionItem.optionEnabled.splice(index, 1)
    },
    updateItem: function (item) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      if (this.sectionItem.type === 'dropdown') {
        for (const language in this.sectionItem.optionValues) {
          db.ref('section').child(this.sectionItem.optionValues[language]).child(this.sectionName).child('items').child(this.sectionItemKey).set(copy)
          db.ref('editors').once('value', snapshot => {
            snapshot.forEach((child) => {
              var childData = child.val()
              console.log(childData.languages)
            })
          })
        }
      } else {
        db.ref('section').child(store.getters.activeLanguageCode).child(this.sectionName).child('items').child(this.sectionItemKey).set(copy)
      }
      this.$router.go(-1)
    },
    removeItem: function (item) {
      if (this.sectionItem.type === 'dropdown') {
        for (const language in this.sectionItem.optionValues) {
          db.ref('section').child(this.sectionItem.optionValues[language]).child(this.sectionName).child('items').child(this.sectionItemKey).remove()
        }
      } else {
        db.ref('section').child(store.getters.activeLanguageCode).child(this.sectionName).child('items').child(this.sectionItemKey).remove()
      }
      this.$router.replace({ name: 'section', params: { sectionName: this.sectionName } })
    },
    cancel: function () {
      if (this.uploadEnd) {
        this.deleteImage(true)
      } else {
        this.$router.go(-1)
      }
    },
    selectFile () {
      this.$refs.uploadInput.click()
    },
    detectFiles (e) {
      const fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
      e.target.value = ''
    },
    upload (file) {
      this.fileName = file.name
      this.uploading = true
      this.uploadTask = firestorage.ref(this.sectionName + '/' + store.getters.activeLanguageCode + '/' + file.name).put(file)
    },
    deleteImage (navigate) {
      firestorage
        .ref(this.sectionName + '/' + store.getters.activeLanguageCode + '/' + this.fileName)
        .delete()
        .then(() => {
          this.fileName = ''
          this.progressUpload = 0
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          if (!navigate) {
            db.ref('section').child(store.getters.activeLanguageCode).child(this.sectionName).child('items').child(this.sectionItemKey).child('url').once('value', snapshot => {
              this.sectionItem.url = snapshot.val()
            })
          }
          if (navigate) {
            this.$router.go(-1)
          }
        })
        .catch((error) => {
          console.error(`file delete error occured: ${error}`)
        })
    }
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
          this.sectionItem.url = this.downloadURL
          this.$emit('downloadURL', downloadURL)
        })
      })
    }
  },
  mounted () {
    this.$rtdbBind('sectionItem', db.ref('section').child(store.getters.activeLanguageCode).child(this.sectionName).child('items').child(this.sectionItemKey))
    this.$watch('user', () => {
      this.$rtdbBind('editor', db.ref('editors').child(store.getters.editorId))
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
  width: 35%;
  margin: auto;
}

.container img {
  margin: 0px 0px 5px;
  width: 100%;
  height: 250px;
}

.video-container {
  position: relative;
  text-align: center;
  width: 35%;
  margin: auto;
}

.video-container img {
  margin: 0px 0px 5px;
  width: 100%;
}

.centered {
  position: absolute;
  top: 45%;
  margin: 0 auto;
  font-size: 1.35em;
  text-align: center;
  width: 100%;
}

.content-container {
  width: 80%;
  margin: 0 auto;
  padding-top: 10px;
}

.md-layout-item.md-size-2 {
    min-width: 2%;
    max-width: 2%;
    flex: 0 1 2%;
}

.md-tooltip {
  font-size: 12px;
}

input[type="file"] {
  position: absolute;
  clip: rect(0,0,0,0);
}
</style>

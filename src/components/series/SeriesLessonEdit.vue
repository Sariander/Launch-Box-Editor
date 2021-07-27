<template>
  <div class="lessonEdit">
      <div class="content-container">
        <md-card-actions>
          <md-button class="md-accent" @click="confirmDialogActive = true">Remove Chapter</md-button>
        </md-card-actions>
        <span v-if="lessonItem">
          <md-field>
            <label>Chapter Title</label>
            <md-input v-model="lessonItem.title"></md-input>
          </md-field>
          <div class="md-caption">Chapter Unread Image</div>
          <img :src="lessonItem.image" width="20%" />
          <div class="md-layout md-alignment-center-left md-layout-item" v-if="!uploadEnd && !uploading">
          <md-button class="md-primary" @click="selectFile(false)">Upload New Image</md-button>
          <span class="md-layout-item md-size-2">
            <md-icon class="far fa-question-circle"></md-icon>
            <md-tooltip md-direction="right">Recommended Size 0px x 0px</md-tooltip>
          </span>
        </div>
          <input id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event, false)"/>
          <md-progress-bar v-if="uploading && !uploadEnd" md-mode="determinate" :md-value="progressUpload"></md-progress-bar>
          <div v-if="uploadEnd">
            <md-button class="md-accent" @click="deleteImage(false)">Revert To Previous Image</md-button>
          </div>
          <md-field>
            <label>Chapter Unread Local Image Name</label>
            <md-input v-model="lessonItem.localImage"></md-input>
          </md-field>
          <div class="md-caption">Chapter Read Image</div>
          <img :src="lessonItem.imageRead" width="20%" />
          <div class="md-layout md-alignment-center-left md-layout-item" v-if="!uploadEndRead && !uploadingRead">
          <md-button class="md-primary" @click="selectFile(true)">Upload New Image</md-button>
          <span class="md-layout-item md-size-2">
            <md-icon class="far fa-question-circle"></md-icon>
            <md-tooltip md-direction="right">Recommended Size 0px x 0px</md-tooltip>
          </span>
        </div>
          <input id="files" type="file" name="file" ref="uploadInputRead" accept="image/*" :multiple="false" @change="detectFiles($event, true)"/>
          <md-progress-bar v-if="uploadingRead && !uploadEndRead" md-mode="determinate" :md-value="progressUploadRead"></md-progress-bar>
          <div v-if="uploadEndRead">
            <md-button class="md-accent" @click="deleteImageRead(false)">Revert To Previous Image</md-button>
          </div>
          <md-field>
            <label>Chapter Read Local Image Name</label>
            <md-input v-model="lessonItem.localImageRead"></md-input>
          </md-field>
        </span>
        <md-card-actions>
          <md-button @click="cancel()">Cancel</md-button>
          <md-button class="md-primary" @click="updateLesson(lessonItem)">Save</md-button>
        </md-card-actions>
        <md-dialog :md-active.sync="confirmDialogActive">
        <md-dialog-title>Are you sure you want to remove this chapter?</md-dialog-title>
        <md-dialog-actions>
          <md-button @click="confirmDialogActive = false">Cancel</md-button>
          <md-button class="md-accent" @click="removeLesson()">Confirm</md-button>
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
    lessonId: String
  },
  data () {
    return {
      confirmDialogActive: false,
      progressUpload: 0,
      progressUploadRead: 0,
      fileName: '',
      fileNameRead: '',
      uploadTask: '',
      uploadTaskRead: '',
      uploading: false,
      uploadEnd: false,
      uploadingRead: false,
      uploadEndRead: false,
      downloadURL: '',
      lessonItem: {
        title: '',
        image: '',
        lesson: ''
      }
    }
  },
  computed: {
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
    showTitleChangeDialog: function () {
      this.changeDialogActive = true
      this.tempName = this.lessonItem.title
    },
    // changeLessonTitle: function (item) {
    //   this.lessonItem.title = this.tempName
    //   var futureTitle = this.tempName.replace(/\s+/g, '-').toLowerCase()
    //   // create a copy of the item
    //   const copy = { ...item }
    //   // remove the .key attribute
    //   delete copy['.key']
    //   db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('studies').child(this.lessonId).remove()
    //   db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('studies').child(futureTitle).set(copy)
    //   this.$router.push({ name: 'series', params: { category: this.category, seriesId: this.seriesId } })
    // },
    updateLesson: function (item) {
      this.prepareItemForSending()
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).set(copy)
      this.$router.push({ name: 'series', params: { category: this.category, seriesId: this.seriesId } })
    },
    removeLesson: function () {
      db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).remove()
      this.$router.push({ name: 'series', params: { category: this.category, seriesId: this.seriesId } })
    },
    cancel: function () {
      if (this.uploadEnd) {
        this.deleteImage(true)
      }
      if (this.uploadEndRead) {
        this.deleteImageRead(true)
      }
      this.$router.go(-1)
    },
    selectFile (read) {
      if (read) {
        this.$refs.uploadInputRead.click()
      } else {
        this.$refs.uploadInput.click()
      }
    },
    detectFiles (e, read) {
      const fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x], read)
      })
      e.target.value = ''
    },
    upload (file, read) {
      if (read) {
        this.fileNameRead = file.name
        this.uploadingRead = true
        this.uploadTaskRead = firestorage.ref(this.seriesId + '/' + store.getters.activeLanguageCode + '/' + this.lessonId + '/' + file.name).put(file)
      } else {
        this.fileName = file.name
        this.uploading = true
        this.uploadTask = firestorage.ref(this.seriesId + '/' + store.getters.activeLanguageCode + '/' + this.lessonId + '/' + file.name).put(file)
      }
    },
    deleteImage (navigate) {
      firestorage
        .ref(this.seriesId + '/' + store.getters.activeLanguageCode + '/' + this.lessonId + '/' + this.fileName)
        .delete()
        .then(() => {
          this.fileName = ''
          this.progressUpload = 0
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          if (!navigate) {
            db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('image').once('value', snapshot => {
              this.lessonItem.image = snapshot.val()
            })
          }
        })
        .catch((error) => {
          console.error(`file delete error occured: ${error}`)
        })
    },
    deleteImageRead (navigate) {
      firestorage
        .ref(this.seriesId + '/' + store.getters.activeLanguageCode + '/' + this.lessonId + '/' + this.fileNameRead)
        .delete()
        .then(() => {
          this.fileNameRead = ''
          this.progressUploadRead = 0
          this.uploadingRead = false
          this.uploadEndRead = false
          this.downloadURL = ''
          if (!navigate) {
            db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId).child('imageRead').once('value', snapshot => {
              this.lessonItem.imageRead = snapshot.val()
            })
          }
        })
        .catch((error) => {
          console.error(`file delete error occured: ${error}`)
        })
    },
    prepareItemForSending () {
      this.lessonItem.title = this.lessonItem.title || ''
      this.lessonItem.localImage = this.lessonItem.localImage || ''
      this.lessonItem.localImageRead = this.lessonItem.localImageRead || ''
      this.lessonItem.image = this.lessonItem.image || ''
      this.lessonItem.imageRead = this.lessonItem.imageRead || ''
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
          this.lessonItem.image = this.downloadURL
          this.$emit('downloadURL', downloadURL)
        })
      })
    },
    uploadTaskRead: function () {
      this.uploadTaskRead.on('state_changed', sp => {
        this.progressUploadRead = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      },
      null,
      () => {
        this.uploadTaskRead.snapshot.ref.getDownloadURL().then(downloadURL => {
          this.uploadEndRead = true
          this.downloadURL = downloadURL
          this.lessonItem.imageRead = this.downloadURL
          this.$emit('downloadURL', downloadURL)
        })
      })
    }
  },
  mounted () {
    this.$watch('activeLanguageCode', () => {
      this.$rtdbBind('lessonItem', db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('chapters').child(this.lessonId))
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
}

input[type="file"] {
  position: absolute;
  clip: rect(0,0,0,0);
}
</style>

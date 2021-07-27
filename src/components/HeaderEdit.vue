<template>
  <div class="headerEdit">
    <div class="content-container">
      <div class="title md-caption">Header Image</div>
      <img :src="headerImageUrl" width="30%" />
      <div class="md-layout md-alignment-center-left md-layout-item" v-if="!uploadEnd && !uploading">
        <md-button class="md-primary" @click="selectFile">Upload New Image</md-button>
        <span class="md-layout-item md-size-2">
          <md-icon class="far fa-question-circle"></md-icon>
          <md-tooltip md-direction="right">Recommended Size 0px x 0px</md-tooltip>
        </span>
      </div>
      <input id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)"/>
      <md-progress-bar v-if="uploading && !uploadEnd" md-mode="determinate" :md-value="progressUpload"></md-progress-bar>
      <div v-if="uploadEnd">
        <md-button class="md-accent" @click="deleteImage(false)">Revert To Previous Image</md-button>
      </div>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="updateHeader()">Save</md-button>
      </md-card-actions>
    </div>
  </div>
</template>

<script>
import { db, firestorage } from '../config/db'
import store from '../config/store'

export default {
  props: {
    category: String,
    seriesId: String,
    lessonId: String,
    sectionName: String
  },
  data () {
    return {
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      headerImageUrl: '',
      editor: null
    }
  },
  mounted () {
    this.$watch('activeLanguageCode', () => {
      db.ref('header').child(store.getters.activeLanguageCode).child(this.sectionName).on('value', snapshot => {
        this.headerImageUrl = snapshot.val()
      })
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
  components: {

  },
  methods: {
    updateHeader () {
      db.ref('header').child(store.getters.activeLanguageCode).child(this.sectionName).set(this.headerImageUrl)
      this.$router.go(-1)
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
      this.uploadTask = firestorage.ref('header/' + store.getters.activeLanguageCode + '/' + this.sectionName + '/' + file.name).put(file)
    },
    deleteImage (navigate) {
      firestorage
        .ref('header/' + store.getters.activeLanguageCode + '/' + this.sectionName + '/' + this.fileName)
        .delete()
        .then(() => {
          this.fileName = ''
          this.progressUpload = 0
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          if (!navigate) {
            db.ref('header').child(store.getters.activeLanguageCode).child(this.sectionName).once('value', snapshot => {
              this.headerImageUrl = snapshot.val()
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
          this.headerImageUrl = this.downloadURL
          this.$emit('downloadURL', downloadURL)
        })
      })
    }
  },
  computed: {
    activeLanguageCode: {
      get () {
        return store.getters.activeLanguageCode
      }
    }
  }
}
</script>

<style scoped>
.title {
  padding-top: 8px;
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

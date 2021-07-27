<template>
  <div class="background-edit">
    <div class="content-container">
      <span>
        <div class="title md-caption">Background Image</div>
        <img :src="backgroundUrl" width="20%" />
        <div v-if="!uploadEnd && !uploading">
          <md-button class="md-primary" @click="selectFile">Upload New Image</md-button>
        </div>
        <input id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)"/>
        <md-progress-bar v-if="uploading && !uploadEnd" md-mode="determinate" :md-value="progressUpload"></md-progress-bar>
        <div v-if="uploadEnd">
          <md-button class="md-accent" @click="deleteImage(false)">Revert To Previous Image</md-button>
        </div>
      </span>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-accent" @click="updateBackground(backgroundUrl)">Save</md-button>
      </md-card-actions>
    </div>
  </div>
</template>

<script>
import { db, firestorage } from '../config/db'
import store from '../config/store'

export default {
  data () {
    return {
      backgroundUrl: '',
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      editor: null
    }
  },
  components: {

  },
  mounted () {
    this.$watch('activeLanguageCode', () => {
      db.ref('home').child(store.getters.activeLanguageCode).child('backgroundUrl').once('value', snapshot => {
        this.backgroundUrl = snapshot.val()
      })
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
          this.backgroundUrl = this.downloadURL
          this.$emit('downloadURL', downloadURL)
        })
      })
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
    cancel: function () {
      if (this.uploadEnd) {
        this.deleteImage(true)
      } else {
        this.$router.go(-1)
      }
    },
    updateBackground (item) {
      db.ref('home').child(store.getters.activeLanguageCode).child('backgroundUrl').set(item)
      this.$router.go(-1)
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
      this.uploadTask = firestorage.ref('home/' + store.getters.activeLanguageCode + '/' + file.name).put(file)
    },
    deleteImage (navigate) {
      firestorage
        .ref('home/' + store.getters.activeLanguageCode + '/' + this.fileName)
        .delete()
        .then(() => {
          this.fileName = ''
          this.progressUpload = 0
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          if (!navigate) {
            db.ref('home').child(store.getters.activeLanguageCode).child('backgroundUrl').once('value', snapshot => {
              this.backgroundUrl = snapshot.val()
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

<template>
  <div class="ad-edit-two">
    <div class="content-container">
      <span>
        <div class="title md-caption">Ad Image 2</div>
        <img class="ad-image" v-if="ad" :src="ad.adUrl" width="20%" />
        <div class="md-layout md-alignment-center-left md-layout-item" v-if="!uploadEnd && !uploading">
          <md-button class="md-primary" @click="selectFile">Upload New Image</md-button>
          <md-button v-if="ad && ad.adUrl" class="md-accent" @click="deleteImage(false)">Delete Image</md-button>
          <span class="md-layout-item md-size-2">
            <md-icon class="far fa-question-circle"></md-icon>
            <md-tooltip md-direction="right">Square Image Recommended</md-tooltip>
          </span>
        </div>
        <div v-if="uploadEnd">
          <md-button class="md-accent" @click="revertImage(false)">Revert To Previous Image</md-button>
        </div>
        <input id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)"/>
        <md-progress-bar v-if="uploading && !uploadEnd" md-mode="determinate" :md-value="progressUpload"></md-progress-bar>
      </span>
      <md-field v-if="ad">
        <label>Ad Link 2</label>
        <md-input v-model="ad.adLinkUrl"></md-input>
      </md-field>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-accent" @click="updateAd()">Save</md-button>
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
      ad: {
        adUrl: null,
        adLinkUrl: null
      },
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: ''
    }
  },
  components: {

  },
  mounted () {
    this.$watch('activeLanguageCode', () => {
      db.ref('home').child(store.getters.activeLanguageCode).child('two').once('value', snapshot => {
        if (snapshot.exists()) {
          this.ad = snapshot.val()
        }
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
          this.ad.adUrl = this.downloadURL
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
        this.revertImage(true)
      } else {
        this.$router.go(-1)
      }
    },
    updateAd () {
      db.ref('home').child(store.getters.activeLanguageCode).child('two').set(this.ad)
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
      this.uploadTask = firestorage.ref('home/' + store.getters.activeLanguageCode + '/ad/two/' + file.name).put(file)
    },
    revertImage (navigate) {
      firestorage
        .ref('home/' + store.getters.activeLanguageCode + '/ad/two/' + this.fileName)
        .delete()
        .then(() => {
          this.fileName = ''
          this.progressUpload = 0
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          if (!navigate) {
            db.ref('home').child(store.getters.activeLanguageCode).child('two').child('adUrl').once('value', snapshot => {
              if (snapshot.exists()) {
                this.ad.adUrl = snapshot.val()
              } else {
                this.ad.adUrl = ''
              }
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
    deleteImage () {
      this.ad.adUrl = ''
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

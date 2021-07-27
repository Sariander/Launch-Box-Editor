<template>
  <div class="seriesVideoEdit">
    <div class="content-container">
      <span v-if="seriesItem">
        <div class="title md-caption">Section Video Image</div>
        <img :src="seriesItem.video" width="30%" />
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
        <md-field>
          <label>Video ID</label>
          <md-input v-model="seriesItem.videoID"></md-input>
        </md-field>
        <md-field>
          <label>Section Video Local Image Name</label>
          <md-input v-model="seriesItem.localVideo"></md-input>
        </md-field>
      </span>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="updateSeries(seriesItem)">Save</md-button>
      </md-card-actions>
    </div>
  </div>
</template>

<script>
import { db, firestorage } from '../../config/db'
import store from '../../config/store'

export default {
  props: {
    category: String,
    seriesId: String
  },
  data () {
    return {
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      seriesItem: {
        title: '',
        image: '',
        localImage: '',
        video: '',
        videoID: '',
        localVideo: '',
        category: '',
        order: '',
        summary: ''
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
    updateSeries: function (item) {
      this.prepareItemForSending()
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).set(copy)
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
      this.uploadTask = firestorage.ref(this.seriesId + '/' + store.getters.activeLanguageCode + '/' + file.name).put(file)
    },
    deleteImage (navigate) {
      firestorage
        .ref(this.seriesId + '/' + store.getters.activeLanguageCode + '/' + this.fileName)
        .delete()
        .then(() => {
          this.fileName = ''
          this.progressUpload = 0
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('video').once('value', snapshot => {
            this.seriesItem.video = snapshot.val()
          })
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
      this.seriesItem.localVideo = this.seriesItem.localVideo || ''
      this.seriesItem.videoID = this.YouTubeGetID(this.seriesItem.videoID)
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
          this.seriesItem.video = this.downloadURL
          this.$emit('downloadURL', downloadURL)
        })
      })
    }
  },
  mounted () {
    this.$watch('activeLanguageCode', () => {
      this.$rtdbBind('seriesItem', db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId))
    }, {
      immediate: true
    })
  }
}
</script>

<style scoped>
.title {
  padding-top: 8px;
}

.container {
  position: relative;
  text-align: center;
  color: white;
  margin: auto;
  width: 35%;
}

.container img {
  width: 100%;
  filter: brightness(75%);
  margin: 0px 0px 5px;
  object-fit: cover;
  height: 150px
}

.centered {
  position: absolute;
  top: 45%;
  margin: 0 auto;
  font-size: 1.35em;
  text-align: center;
  width: 100%;
  user-select: none;
}

.content-container {
  width: 80%;
  margin: 0 auto;
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

</style>

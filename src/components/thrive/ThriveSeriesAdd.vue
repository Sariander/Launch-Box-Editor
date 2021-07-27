<template>
  <div class="seriesAdd">
    <div class="content-container">
    <md-field>
        <label>Section Title</label>
        <md-input v-model="seriesItem.title"></md-input>
      </md-field>
      <div class="md-caption">Section Image</div>
        <img :src="seriesItem.image" width="20%" />
        <div class="md-layout md-alignment-center-left md-layout-item" v-if="!uploadEnd && !uploading">
          <md-button class="md-primary" @click="selectFile">Upload Image</md-button>
          <span class="md-layout-item md-size-2">
            <md-icon class="far fa-question-circle"></md-icon>
            <md-tooltip md-direction="right">Tooltip</md-tooltip>
          </span>
        </div>
        <input id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)"/>
        <md-progress-bar v-if="uploading && !uploadEnd" md-mode="determinate" :md-value="progressUpload"></md-progress-bar>
        <div v-if="uploadEnd">
          <md-button class="md-accent" @click="deleteImage(false)">Delete Image</md-button>
        </div>
      <md-field>
        <label>Local Section Image Filename</label>
        <md-input v-model="seriesItem.localImage"></md-input>
      </md-field>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="addSeries(seriesItem)">Add</md-button>
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
    order: Number
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
        localVideo: '',
        category: '',
        order: this.order,
        summary: ''
      }
    }
  },
  mounted () {
    db.ref('section').child(store.getters.activeLanguageCode).child(this.category).once('value', snapshot => {
      this.seriesItem.order = Object.keys(snapshot.val()).length
    })
  },
  methods: {
    addSeries: function (item) {
      this.prepareItemForSending()
      if (this.seriesItem.order === undefined) {
        this.seriesItem.order = -1
      }
      item.category = this.category
      db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesItem.order).set(item)
      this.$router.push({ name: 'thrive', params: { category: this.category } })
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
      this.uploadTask = firestorage.ref(this.order + '/' + store.getters.activeLanguageCode + '/' + file.name).put(file)
    },
    deleteImage (navigate) {
      firestorage
        .ref(this.order + '/' + store.getters.activeLanguageCode + '/' + this.fileName)
        .delete()
        .then(() => {
          this.fileName = ''
          this.progressUpload = 0
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          this.seriesItem.image = ''
          if (navigate) {
            this.$router.go(-1)
          }
        })
        .catch((error) => {
          console.error(`file delete error occured: ${error}`)
        })
    },
    prepareItemForSending () {
      this.seriesItem.title = this.seriesItem.title || ''
      this.seriesItem.localImage = this.seriesItem.localImage || ''
      this.seriesItem.image = this.seriesItem.image || ''
      this.seriesItem.printUrl = this.seriesItem.printUrl || ''
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
          this.seriesItem.image = this.downloadURL
          this.$emit('downloadURL', downloadURL)
        })
      })
    }
  }
}
</script>

<style scoped>
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

</style>

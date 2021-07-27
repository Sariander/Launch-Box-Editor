<template>
  <div class="seriesAdd">
    <div class="content-container">
      <md-card-actions>
        <md-button class="md-accent" @click="confirmDialogActive = true">Remove Section</md-button>
      </md-card-actions>
      <span v-if="seriesItem">
        <md-field>
          <label>Section Title</label>
          <md-input v-model="seriesItem.title"></md-input>
        </md-field>
        <div class="md-caption">Section Image</div>
        <img :src="seriesItem.image" width="20%" />
        <div class="md-layout md-alignment-center-left md-layout-item" v-if="!uploadEnd && !uploading">
          <md-button class="md-primary" @click="selectFile">Upload New Image</md-button>
          <span class="md-layout-item md-size-2">
            <md-icon class="far fa-question-circle"></md-icon>
            <md-tooltip md-direction="right">Tooltip</md-tooltip>
          </span>
        </div>
        <input id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)"/>
        <md-progress-bar v-if="uploading && !uploadEnd" md-mode="determinate" :md-value="progressUpload"></md-progress-bar>
        <div v-if="uploadEnd">
          <md-button class="md-accent" @click="deleteImage(false)">Revert To Previous Image</md-button>
        </div>
        <md-field>
          <label>Local Section Image Filename</label>
          <md-input v-model="seriesItem.localImage"></md-input>
        </md-field>
      </span>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="updateSeries(seriesItem)">Save</md-button>
      </md-card-actions>
      <md-dialog :md-active.sync="confirmDialogActive">
        <md-dialog-title>Are you sure you want to remove this section?</md-dialog-title>
        <md-dialog-actions>
          <md-button @click="confirmDialogActive = false">Cancel</md-button>
          <md-button class="md-accent" @click="removeSeries()">Confirm</md-button>
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
      confirmDialogActive: false,
      seriesItem: {
        title: '',
        image: '',
        localImage: '',
        video: '',
        localVideo: '',
        category: '',
        order: '',
        summary: ''
      },
      tempCategory: this.category
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
      this.$router.push({ name: 'thrive', params: { category: this.category } })
    },
    removeSeries: function () {
      db.ref('section').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).remove()
      this.$router.push({ name: 'thrive', params: { category: this.category } })
    },
    showCategoryDialog: function () {
      this.tempCategory = this.category
      this.changeDialogActive = true
    },
    // changeCategory: function (item) {
    //   // create a copy of the item
    //   const copy = { ...item }
    //   // remove the .key attribute
    //   delete copy['.key']
    //   db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).remove()
    //   db.ref('series').child(store.getters.activeLanguageCode).child(this.tempCategory).child(this.seriesId).set(copy)
    //   this.$router.push({ name: 'thrive', params: { category: this.tempCategory } })
    // },
    // showTitleChangeDialog: function () {
    //   this.titleDialogActive = true
    //   this.tempName = this.seriesItem.title
    // },
    // changeSeriesTitle: function (item) {
    //   this.seriesItem.title = this.tempName
    //   var futureTitle = this.tempName.replace(/\s+/g, '-').toLowerCase()
    //   // create a copy of the item
    //   const copy = { ...item }
    //   // remove the .key attribute
    //   delete copy['.key']
    //   db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).remove()
    //   db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(futureTitle).set(copy)
    //   this.$router.push({ name: 'thrive', params: { category: this.tempCategory } })
    // },
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
          if (!navigate) {
            db.ref('series').child(store.getters.activeLanguageCode).child(this.category).child(this.seriesId).child('image').once('value', snapshot => {
              this.seriesItem.image = snapshot.val()
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

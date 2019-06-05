<template>
  <div class="seriesAdd">
    <div class="content-container">
      <md-card-actions>
        <md-button class="md-accent" @click="confirmDialogActive = true">Remove Series</md-button>
      </md-card-actions>
      <md-field>
        <label>Series Title</label>
        <md-input v-model="seriesItem.title"></md-input>
      </md-field>
      <md-field>
        <label>Series Header Image Url</label>
        <md-input v-model="seriesItem.image"></md-input>
      </md-field>
      <md-field>
        <label>Local Series Header Image Filename</label>
        <md-input v-model="seriesItem.localImage"></md-input>
      </md-field>
      <md-field>
        <label>Series Video Image Url</label>
        <md-input v-model="seriesItem.video"></md-input>
      </md-field>
      <md-field>
        <label>Local Series Video Image Filename</label>
        <md-input v-model="seriesItem.localVideo"></md-input>
      </md-field>
      <md-field>
        <label>Summary</label>
        <md-textarea v-model="seriesItem.summary"></md-textarea>
      </md-field>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="showCategoryDialog()">Change Category</md-button>
        <md-button class="md-primary" @click="updateSeries(seriesItem)">Save</md-button>
      </md-card-actions>
      <md-dialog :md-active.sync="confirmDialogActive">
        <md-dialog-title>Are you sure you want to remove this series?</md-dialog-title>
        <md-dialog-actions>
          <md-button @click="confirmDialogActive = false">Cancel</md-button>
          <md-button class="md-accent" @click="removeSeries()">Confirm</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="changeDialogActive">
        <md-dialog-title>Change the category of this series</md-dialog-title>
        <md-dialog-content>
          <md-field>
            <label for="category">Category</label>
              <md-select v-model="tempCategory" name="category" id="category">
                <md-option value="follow-up">Follow Up</md-option>
                <md-option value="thrive-1">Thrive 1</md-option>
                <md-option value="thrive-2">Thrive 2</md-option>
                <md-option value="thrive-3">Thrive 3</md-option>
              </md-select>
          </md-field>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button @click="changeDialogActive = false">Cancel</md-button>
          <md-button class="md-primary" @click="changeCategory(seriesItem)">Confirm</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
import { db } from '../../config/db'
import store from '../../config/store'

export default {
  props: {
    category: String,
    seriesName: String
  },
  data () {
    return {
      confirmDialogActive: false,
      changeDialogActive: false,
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
  methods: {
    updateSeries: function (item) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref(store.getters.activeLanguageCode).child('series').child(this.category).child(this.seriesName).set(copy)
      this.$router.push({ name: 'thrive', params: { category: this.category } })
    },
    removeSeries: function () {
      db.ref(store.getters.activeLanguageCode).child('series').child(this.category).child(this.seriesName).remove()
      this.$router.push({ name: 'thrive', params: { category: this.category } })
    },
    showCategoryDialog: function () {
      this.tempCategory = this.category
      this.changeDialogActive = true
    },
    changeCategory: function (item) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref(store.getters.activeLanguageCode).child('series').child(this.category).child(this.seriesName).remove()
      db.ref(store.getters.activeLanguageCode).child('series').child(this.tempCategory).child(this.seriesName).set(copy)
      this.$router.push({ name: 'thrive', params: { category: this.tempCategory } })
    },
    cancel: function () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.$bindAsObject('seriesItem', db.ref(store.getters.activeLanguageCode).child('series').child(this.category).child(this.seriesName))
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

</style>

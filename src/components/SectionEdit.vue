<template>
  <div class="sectionEdit">
    <div class="content-container">
      <md-card-actions>
        <md-button
          class="md-accent"
          @click="removeItem(sectionItem)"
        >Remove Item</md-button>
      </md-card-actions>
      <md-field>
        <label for="type">Type</label>
        <md-select v-model="sectionItem.type" name="type" id="type">
          <md-option value="section">Section</md-option>
          <md-option value="text">Text</md-option>
          <md-option value="video">Video</md-option>
          <md-option value="image">Image</md-option>
          <md-option value="link">Link</md-option>
          <md-option value="setting">Setting</md-option>
        </md-select>
      </md-field>
      <md-field>
        <label>Header</label>
        <md-textarea v-model="sectionItem.header"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'text'">
        <label>Details</label>
        <md-textarea v-model="sectionItem.details"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'text'">
        <label for="style">Style</label>
        <md-select v-model="sectionItem.style" name="style" id="style">
          <md-option value="regular">Regular Header</md-option>
          <md-option value="bold">Bold Header</md-option>
          <md-option value="detail">Header and Details</md-option>
          <md-option value="orange">Orange Header</md-option>
        </md-select>
      </md-field>
      <md-field v-if="sectionItem.type == 'video'">
        <label>Video Url</label>
        <md-textarea v-model="sectionItem.url"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'image'">
        <label>Image Url</label>
        <md-textarea v-model="sectionItem.url"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'link'">
        <label>Link Url</label>
        <md-textarea v-model="sectionItem.linkUrl"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'setting'">
        <label>Setting Title</label>
        <md-textarea v-model="sectionItem.title"></md-textarea>
      </md-field>
      <md-field v-if="sectionItem.type == 'setting'">
        <label>Setting Key</label>
        <md-textarea v-model="sectionItem.key"></md-textarea>
      </md-field>
      <md-card-actions>
        <md-button @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="updateItem(sectionItem)">Save</md-button>
      </md-card-actions>
    </div>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  props: {
    sectionName: String,
    sectionItemKey: String
  },
  data () {
    return {
      sectionItem: {
        type: '',
        order: '',
        lesson: ''
      }
    }
  },
  methods: {
    updateItem: function (item) {
      // create a copy of the item
      const copy = { ...item }
      // remove the .key attribute
      delete copy['.key']
      db.ref(this.sectionName).child('items').child(this.sectionItemKey).set(copy)
      this.$router.push({ name: 'section', params: { sectionName: this.sectionName } })
    },
    removeItem: function (item) {
      db.ref(this.sectionName).child('items').child(this.sectionItemKey).remove()
      this.$router.push({ name: 'section', params: { sectionName: this.sectionName } })
    },
    cancel: function () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.$bindAsObject('sectionItem', db.ref(this.sectionName).child('items').child(this.sectionItemKey))
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
</style>

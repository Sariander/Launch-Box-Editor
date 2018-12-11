<template>
  <div class="lessonAdd">
    <div class="content-container">
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
      <md-field v-if="sectionItem.type == 'section'">
        <label>Section Header</label>
        <md-input v-model="sectionItem.sectionHeader"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'section'">
        <label>Section Title</label>
        <md-input v-model="sectionItem.sectionTitle"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'section'">
        <label>Section Name</label>
        <md-input v-model="sectionItem.sectionName"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'text'">
        <label>Header</label>
        <md-input v-model="sectionItem.header"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'text'">
        <label>Details</label>
        <md-input v-model="sectionItem.details"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'video'">
        <label>Video Url</label>
        <md-input v-model="sectionItem.url"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'image'">
        <label>Image Url</label>
        <md-input v-model="sectionItem.url"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'link'">
        <label>Link Header</label>
        <md-input v-model="sectionItem.sectionHeader"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'link'">
        <label>Link Url</label>
        <md-input v-model="sectionItem.linkUrl"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'setting'">
        <label>Setting Title</label>
        <md-input v-model="sectionItem.title"></md-input>
      </md-field>
      <md-field v-if="sectionItem.type == 'setting'">
        <label>Setting Key</label>
        <md-input v-model="sectionItem.key"></md-input>
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
      <md-card-actions>
        <md-button class="md-primary" @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="addItem(sectionItem)">Add</md-button>
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
        title: '',
        image: '',
        lesson: '',
        type: 'section'
      }
    }
  },
  methods: {
    addItem: function (item) {
      // let key = this.lessonItem.title
      // key = key.replace(/\s+/g, '-').toLowerCase()
      db.ref(this.sectionName).child('items').push(item)
      this.$router.push({ name: 'section', params: { sectionName: this.sectionName } })
    },
    cancel: function () {
      this.$router.go(-1)
    }
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

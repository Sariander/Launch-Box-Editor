<template>
  <div class="seriesAdd">
    <div class="content-container">
    <md-field>
        <label>Series Title</label>
        <md-input v-model="seriesItem.title"></md-input>
      </md-field>
      <md-field>
        <label for="category">Category</label>
        <md-select v-model="seriesItem.category" name="category" id="category">
          <md-option value="thrive 1">Thrive 1</md-option>
          <md-option value="thrive 2">Thrive 2</md-option>
          <md-option value="thrive 3">Thrive 3</md-option>
        </md-select>
      </md-field>
      <md-field>
        <label>Series Order</label>
        <md-input v-model="seriesItem.order"></md-input>
      </md-field>
      <md-field>
        <label>Series Header Image Url</label>
        <md-input v-model="seriesItem.image"></md-input>
      </md-field>
      <md-field>
        <label>Series Video Image Url</label>
        <md-input v-model="seriesItem.video"></md-input>
      </md-field>
      <md-field>
        <label>Series Summary</label>
        <md-textarea v-model="seriesItem.summary"></md-textarea>
      </md-field>
      <md-card-actions>
        <md-button class="md-primary" @click="cancel()">Cancel</md-button>
        <md-button class="md-primary" @click="addSeries(seriesItem)">Add</md-button>
      </md-card-actions>
    </div>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  props: {
    category: String
  },
  data () {
    return {
      seriesItem: {
        title: '',
        image: '',
        video: '',
        category: '',
        order: '',
        summary: ''
      }
    }
  },
  methods: {
    addSeries: function (item) {
      let key = this.seriesItem.title
      key = key.replace(/\s+/g, '-').toLowerCase()
      db.ref('series').child(this.category).child(key).set(item)
      this.$router.push({ name: 'thrive', params: { category: this.category } })
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

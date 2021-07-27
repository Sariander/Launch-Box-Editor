<template>
  <div class="links">
    <div class="content-container">
      <span v-if="activeLanguageCode == 'en'">
        <h1 class="header">Welcome to the Launch Box App Editor!</h1>
        <p class="intro-text">Below are some links that you'll find helpful including training for how to edit the app.</p>
        <ul class="md-subheading">
          <li><a target="_blank">Instructions for editing the Launch Box App</a></li>
          <!-- <li><a href="https://docs.google.com/spreadsheets/d/13UFHUH5nZuEM0uNxjULwIfxdjdlto5aC-bltHxUbq2k/edit?usp=sharing" target="_blank">See User Feedback for your Language</a></li> -->
          <li><a target="_blank">Send Notifications to all Users</a></li> <!-- Firebase notifications-->
          <li><a target="_blank">See Stats for your Language</a></li> <!-- Firebase analytics-->
          <li><a target="_blank">Questions?</a></li>
        </ul>
      </span>
      <span v-if="activeLanguageCode == 'es'">
        <h1 class="header">Welcome to the Thrive Studies App Editor! - ES</h1>
        <div><a target="_blank">INSTRUCTIONS FOR EDITING THE THRIVE APP - ES</a></div>
        <div><a href="https://docs.google.com/forms/d/1MVEVR900tYPi8-L-595eTU73aZdkbB5OsGk27nc_pKE/edit" target="_blank">SEE USER FEEDBACK FOR YOUR LANGUAGE - ES</a></div>
      </span>
      <span v-if="activeLanguageCode == 'vi'">
        <h1 class="header">Welcome to the Thrive Studies App Editor! - VI</h1>
        <div><a target="_blank">INSTRUCTIONS FOR EDITING THE THRIVE APP - VI</a></div>
        <div><a href="https://docs.google.com/forms/d/12FOIc8PYkgDwo9--UCWHR1-fpdDdKTUgxIh-XSUruKw/edit" target="_blank">SEE USER FEEDBACK FOR YOUR LANGUAGE - VI</a></div>
      </span>
      <span v-if="activeLanguageCode == 'sq'">
        <h1 class="header">Welcome to the Thrive Studies App Editor! - SQ</h1>
        <div><a target="_blank">INSTRUCTIONS FOR EDITING THE THRIVE APP - SQ</a></div>
        <div><a href="https://docs.google.com/forms/d/1UCjPxvlYuMWXNClpJCacWH8Np_UpStTFQNKlTqIzgHI/edit" target="_blank">SEE USER FEEDBACK FOR YOUR LANGUAGE - SQ</a></div>
      </span>
    </div>
  </div>
</template>

<script>
import store from '../config/store'

export default {
  components: {

  },
  methods: {
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
.content-container {
  width: 93%;
  margin: 5em auto;
  display: block;
}

.header {
  color: #F5BE19;
}

.intro-text {
  width: 45%;
}
</style>

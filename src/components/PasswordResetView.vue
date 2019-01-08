<template>
  <div class="login">
    <div class=container>
      <template>
        <div class="form">
        <md-field>
          <label>E-mail</label>
          <md-input v-model="login.email"></md-input>
        </md-field>
      </div>

      <div class="actions md-layout md-alignment-center-right">
        <md-button class="md-raised md-primary" @click="resetPassword()">Reset Password</md-button>
      </div>
      </template>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
import store from '../config/store'

export default {
  name: 'app',
  beforeCreate: function () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        store.commit('login')
        this.$router.push({ name: 'Home', params: {} })
      } else {
        store.commit('logout')
      }
      this.loading = false
    })
  },
  data () {
    return {
      login: {
        email: ''
      },
      user: null
    }
  },
  methods: {
    resetPassword: function () {
      firebase.auth().sendPasswordResetEmail(this.login.email).then((result) => {

      }).catch(error => console.log(error))
    }
  }
}
</script>

<style lang="scss">
.container {
  position: relative;
  text-align: center;
  margin: auto;
  width: 35%;
}
</style>

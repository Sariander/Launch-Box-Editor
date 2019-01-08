<template>
  <div class="login">
    <div class=container>
      <p v-if="loading">Loading...</p>
      <template v-if="!user && !loading">
        <md-button class="md-raised" @click="signInWithGoogle">Sign in with Google</md-button>
        <div class="form">
          <form novalidate class="md-layout" @submit.prevent="validateUser">
              <md-field :class="getValidationClass('email')">
                <label for="email">Email</label>
                <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email"/>
                <span class="md-error" v-if="!$v.form.email.required">Email is required</span>
                <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
              </md-field>
              <md-field :class="getValidationClass('password')" :md-toggle-password="false">
                <label for="password">Password</label>
                <md-input type="password" name="password" id="password" autocomplete="password" v-model="form.password" />
                <span class="md-error" v-if="!$v.form.password.required">Password is required</span>
              </md-field>
              <div class="actions md-layout md-alignment-center-space-between">
                <md-button class="md-primary" @click="goToPasswordReset()">Reset password</md-button>
                <md-button type="submit" class="md-raised md-primary">Log in</md-button>
              </div>
          </form>
          <h3 class="error" v-if="loginFailed">Invalid email or password</h3>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
import store from '../config/store'
import { validationMixin } from 'vuelidate'
import {
  required,
  email,
  minLength
} from 'vuelidate/lib/validators'

export default {
  name: 'app',
  mixins: [validationMixin],
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
      form: {
        email: null,
        password: null
      },
      loginFailed: false,
      loading: true,
      user: null
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    signInWithEmail: function () {
      firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password).then((result) => {
        this.user = result.user
        store.commit('login')
      }).catch(error => {
        this.loginFailed = true
        console.log(error)
      })
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.loginFailed = false
        this.signInWithEmail()
      }
    },
    signInWithGoogle: function () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider).then((result) => {
        this.user = result.user
        store.commit('login')
      }).catch(error => console.log(error))
    },
    signOut: function () {
      firebase.auth().signOut().then(() => {
        this.user = null
        store.commit('logout')
      }).catch(error => console.log(error))
    },
    goToPasswordReset: function () {
      this.$router.push({ name: 'Reset' })
    }
  }
}
</script>

<style lang="scss">
.error {
  color: #ff1744;
}
.container {
  position: relative;
  text-align: center;
  margin: auto;
  width: 35%;
}
</style>

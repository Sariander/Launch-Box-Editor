<template>
  <div class="login">
    <div class=container>
      <p v-if="loading">Loading...</p>
      <template v-if="!user && !loading">
        <md-button class="md-raised" @click="signInWithGoogle">Sign in with Google</md-button>
      </template>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
import { db } from '../config/db'
import store from '../config/store'
import { validationMixin } from 'vuelidate'

export default {
  name: 'app',
  mixins: [validationMixin],
  beforeCreate: function () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        db.ref('editors').child(this.user.uid).get().then(snapshot => {
          if (snapshot.exists()) {
            db.ref('editors').child(this.user.uid).update({
              name: this.user.displayName,
              email: this.user.email,
              id: this.user.uid,
              profileUrl: this.user.photoURL
            })
          } else {
            db.ref('editors').child(this.user.uid).update({
              name: this.user.displayName,
              email: this.user.email,
              id: this.user.uid,
              profileUrl: this.user.photoURL,
              admin: false,
              languages: {
                en: {
                  language: 'en',
                  read: true,
                  write: false
                }
              }
            })
          }
        })
        store.commit('setEditorId', this.user.uid)
        store.commit('login')
        this.$router.push({ name: 'links', params: {} })
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

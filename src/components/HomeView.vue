<template>
  <div class="home" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }">
    <span class="ad-edit-container-right">
      <img @click="goToEditAdOne()" class="ad-edit-button" :src="(adUrlOne != '' && adUrlOne != null) ? adUrlOne : require('../../src/assets/placeholder.png')" v-bind:class="{'item-edit': editor && editor.languages[this.activeLanguageCode].write}">
      <img @click="goToEditAdTwo()" class="ad-edit-button" :src="(adUrlTwo != '' && adUrlTwo != null) ? adUrlTwo : require('../../src/assets/placeholder.png')" v-bind:class="{'item-edit': editor && editor.languages[this.activeLanguageCode].write}">
    </span>
    <span class="ad-edit-container-left">
      <img @click="goToEditAdThree()" class="ad-edit-button" :src="(adUrlThree != '' && adUrlThree != null) ? adUrlThree : require('../../src/assets/placeholder.png')" v-bind:class="{'item-edit': editor && editor.languages[this.activeLanguageCode].write}">
      <img @click="goToEditAdFour()" class="ad-edit-button" :src="(adUrlFour != '' && adUrlFour != null) ? adUrlFour : require('../../src/assets/placeholder.png')" v-bind:class="{'item-edit': editor && editor.languages[this.activeLanguageCode].write}">
    </span>
    <!-- <div class="content-container">
      <span>
        <md-button
          class="md-raised wide-button"
          @click="goToSection('learning')"
        >{{ buttonText[activeLanguageCode].learn }}</md-button>
        <br>
        <md-button
          class="md-raised wide-button"
          @click="goToSection('leading')"
        >{{ buttonText[activeLanguageCode].lead }}</md-button>
      </span>
    </div> -->
    <span class=button-container v-if="editor && editor.languages[activeLanguageCode].write">
      <md-button class="md-raised" @click="goToEditBackground()">{{ buttonText[activeLanguageCode].background }}</md-button>
    </span>
  </div>
</template>

<script>
import { db } from '../config/db'
import store from '../config/store'

export default {
  data () {
    return {
      backgroundUrl: '',
      adUrlOne: '',
      adUrlTwo: '',
      adUrlThree: '',
      adUrlFour: '',
      editor: null,
      buttonText: {
        en: {
          learn: 'Learn To Use Thrive',
          lead: 'Lead A Thrive Group',
          background: 'Edit Background Image'
        },
        es: {
          learn: 'Aprende a usar Thrive',
          lead: 'Lidera un Grupo de Crecimiento',
          background: 'Editar imagen de fondo'
        },
        vi: {
          learn: 'CÁCH SỬ DỤNG THRIVE',
          lead: 'HƯỚNG DẪN NHÓM HỌC THRIVE',
          background: 'Chỉnh sửa hình nền'
        },
        sq: {
          learn: 'MËSO TË PËRDORËSH “THRIVE”',
          lead: 'DREJTO NJË GRUP “THRIVE”',
          background: 'Redakto imazhin e sfondit'
        },
        fr: {
          learn: 'Learn To Use Thrive',
          lead: 'Lead A Thrive Group',
          background: 'Edit Background Image'
        }
      }
    }
  },
  components: {

  },
  computed: {
    activeLanguageCode: {
      get () {
        return store.getters.activeLanguageCode
      }
    }
  },
  methods: {
    goToSection (sectionName) {
      this.$router.push({ name: 'section', params: { sectionName: sectionName } })
    },
    goToEditAdOne () {
      if (this.editor && this.editor.languages[this.activeLanguageCode].write) {
        this.$router.push({ name: 'ad-edit-one' })
      }
    },
    goToEditAdTwo () {
      if (this.editor && this.editor.languages[this.activeLanguageCode].write) {
        this.$router.push({ name: 'ad-edit-two' })
      }
    },
    goToEditAdThree () {
      if (this.editor && this.editor.languages[this.activeLanguageCode].write) {
        this.$router.push({ name: 'ad-edit-three' })
      }
    },
    goToEditAdFour () {
      if (this.editor && this.editor.languages[this.activeLanguageCode].write) {
        this.$router.push({ name: 'ad-edit-four' })
      }
    },
    goToEditBackground () {
      this.$router.push({ name: 'background-edit' })
    }
  },
  mounted () {
    this.$watch('user', () => {
      if (store.getters.editorId) {
        this.$rtdbBind('editor', db.ref('editors').child(store.getters.editorId))
      }
    }, {
      immediate: true
    })
    this.$watch('activeLanguageCode', () => {
      db.ref('home').child(store.getters.activeLanguageCode).child('backgroundUrl').once('value', snapshot => {
        this.backgroundUrl = snapshot.val()
      })
    }, {
      immediate: true
    })
    this.$watch('activeLanguageCode', () => {
      db.ref('home').child(store.getters.activeLanguageCode).child('one').child('adUrl').once('value', snapshot => {
        this.adUrlOne = snapshot.val()
      })
    }, {
      immediate: true
    })
    this.$watch('activeLanguageCode', () => {
      db.ref('home').child(store.getters.activeLanguageCode).child('two').child('adUrl').once('value', snapshot => {
        this.adUrlTwo = snapshot.val()
      })
    }, {
      immediate: true
    })
    this.$watch('activeLanguageCode', () => {
      db.ref('home').child(store.getters.activeLanguageCode).child('three').child('adUrl').once('value', snapshot => {
        this.adUrlThree = snapshot.val()
      })
    }, {
      immediate: true
    })
    this.$watch('activeLanguageCode', () => {
      db.ref('home').child(store.getters.activeLanguageCode).child('four').child('adUrl').once('value', snapshot => {
        this.adUrlFour = snapshot.val()
      })
    }, {
      immediate: true
    })
  }
}
</script>

<style scoped>
.home {
  /* The image used */
  /* background-image: url("../../src/assets/orange_bulbs.jpg"); */

  /* Full height */
  height: calc(100vh - 64px);

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.ad-edit-container-right {
  position: absolute;
  right: 0;
  top: 64px;
  min-width: 250px;
  max-width: 20%;
  /* -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; */
}

.ad-edit-container-left {
  position: absolute;
  top: 64px;
  min-width: 250px;
  max-width: 20%;
  /* -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; */
}

.ad-edit-button {
  min-width: 100%;
}

.item-edit {
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .home {
    height: calc(100vh - 56px);
  }
  .ad-edit-container-right {
    top: 56px;
  }
  .ad-edit-container-left {
    top: 56px;
  }
}

@media only screen and (min-width: 600px) {
  .home {
    height: calc(100vh - 48px);
  }
  .ad-edit-container-right {
    top: 48px;
  }
  .ad-edit-container-left {
    top: 48px;
  }
}

@media only screen and (min-width: 768px) {
  .home {
    height: calc(100vh - 48px);
  }
  .ad-edit-container-right {
    top: 48px;
  }
  .ad-edit-container-left {
    top: 48px;
  }
}

@media only screen and (min-width: 960px) {
  .home {
    height: calc(100vh - 64px);
  }
  .ad-edit-container-right {
    top: 64px;
  }
  .ad-edit-container-left {
    top: 64px;
  }
}

@media only screen and (min-width: 1200px) {
  .home {
    height: calc(100vh - 64px);
  }
  .ad-edit-container-right {
    top: 64px;
  }
  .ad-edit-container-left {
    top: 64px;
  }
}

.content-container {
  width: 60%;
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50px;
}

.wide-button {
  width: 100%;
  margin: 40px 0 0 0;
}

.button-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  bottom: 8px;
}
</style>

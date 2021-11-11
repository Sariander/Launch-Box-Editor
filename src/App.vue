<template>
  <div id="app">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible && isLoggedIn">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title app-title">{{ title }}</span>
        <md-field class="md-layout-item skinny-dropdown" v-if="isLoggedIn && languageDropdown != null && this.$route.name !='itemAdd' && this.$route.name !='itemEdit'">
          <md-select v-if="editor" v-on:click.stop="stopEvent" :name="languageDropdown.title" :id="languageDropdown.title" v-model="activeLanguageCode">
            <md-option v-for="subItem of languageDropdown" :key="subItem['.key']" :value="subItem.language" :disabled="editor.languages[subItem.language] && !editor.languages[subItem.language].read">{{ isoLangs[subItem.language].nativeName }} ({{ isoLangs[subItem.language].name }})</md-option>
          </md-select>
        </md-field>
        <span class="md-subheading" v-if="this.$route.name =='itemAdd' || this.$route.name =='itemEdit'">{{ isoLangs[activeLanguageCode].nativeName }} ({{ isoLangs[activeLanguageCode].name }})</span>
        <md-avatar v-if="editor && isLoggedIn">
          <img v-bind:src="editor.profileUrl">
        </md-avatar>
        <md-button v-if="isLoggedIn" @click="signOut()">Logout</md-button>
        <md-button v-if="!isLoggedIn" @click="goToSignIn()">Login</md-button>
      </md-app-toolbar>
      <md-app-drawer v-if="isLoggedIn" :md-active.sync="menuVisible" md-persistent="mini">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navigation</span>
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>
        <md-list>
          <md-list-item @click="navigateToTab('Home', 'home')">
            <md-icon :class="this.$route.name == 'Home' ? 'active-item' : 'black-icon'">home</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>
          <md-list-item @click="navigateToTab('thrive', 'launch')">
            <md-icon :class="this.$route.params.category == 'launch' ? 'active-item' : 'black-icon'" :md-src="require('../src/assets/launch.svg')"/>
            <span class="md-list-item-text">Launch</span>
          </md-list-item>
          <md-divider></md-divider>
          <md-list-item @click="navigateToTab('links', null)">
            <md-icon :class="this.$route.name == 'links' ? 'active-item' : 'black-icon'">link</md-icon>
            <span class="md-list-item-text">Links</span>
          </md-list-item>
          <md-list-item v-if="editor && editor.admin" @click="navigateToTab('editors', null)">
            <md-icon :class="this.$route.name == 'editors' ? 'active-item' : 'black-icon'">account_circle</md-icon>
            <span class="md-list-item-text">Editors</span>
          </md-list-item>
          <md-list-item v-if="editor && editor.admin" @click="navigateToTab('languages', null)">
            <md-icon :class="this.$route.name == 'languages' ? 'active-item' : 'black-icon'">language</md-icon>
            <span class="md-list-item-text">Languages</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import firebase from 'firebase'
import store from './config/store'
import { db } from './config/db'

Vue.use(VueMaterial)

export default {
  name: 'app',
  beforeCreate: function () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        store.commit('login')
      }
      this.loading = false
    })
  },
  data () {
    return {
      toggleDropbown: false,
      menuVisible: false,
      loading: true,
      user: null,
      editor: null,
      languageDropdown: null,
      showNavigation: false,
      title: 'Launch Box',
      isoLangs: {
        ab: {
          name: 'Abkhaz',
          nativeName: 'аҧсуа'
        },
        aa: {
          name: 'Afar',
          nativeName: 'Afaraf'
        },
        af: {
          name: 'Afrikaans',
          nativeName: 'Afrikaans'
        },
        ak: {
          name: 'Akan',
          nativeName: 'Akan'
        },
        sq: {
          name: 'Albanian',
          nativeName: 'Shqip'
        },
        am: {
          name: 'Amharic',
          nativeName: 'አማርኛ'
        },
        ar: {
          name: 'Arabic',
          nativeName: 'العربية'
        },
        an: {
          name: 'Aragonese',
          nativeName: 'Aragonés'
        },
        hy: {
          name: 'Armenian',
          nativeName: 'Հայերեն'
        },
        as: {
          name: 'Assamese',
          nativeName: 'অসমীয়া'
        },
        av: {
          name: 'Avaric',
          nativeName: 'авар мацӀ, магӀарул мацӀ'
        },
        ae: {
          name: 'Avestan',
          nativeName: 'avesta'
        },
        ay: {
          name: 'Aymara',
          nativeName: 'aymar aru'
        },
        az: {
          name: 'Azerbaijani',
          nativeName: 'azərbaycan dili'
        },
        bm: {
          name: 'Bambara',
          nativeName: 'bamanankan'
        },
        ba: {
          name: 'Bashkir',
          nativeName: 'башҡорт теле'
        },
        eu: {
          name: 'Basque',
          nativeName: 'euskara'
        },
        be: {
          name: 'Belarusian',
          nativeName: 'Беларуская'
        },
        bn: {
          name: 'Bengali',
          nativeName: 'বাংলা'
        },
        bh: {
          name: 'Bihari',
          nativeName: 'भोजपुरी'
        },
        bi: {
          name: 'Bislama',
          nativeName: 'Bislama'
        },
        bs: {
          name: 'Bosnian',
          nativeName: 'bosanski jezik'
        },
        br: {
          name: 'Breton',
          nativeName: 'brezhoneg'
        },
        bg: {
          name: 'Bulgarian',
          nativeName: 'български език'
        },
        my: {
          name: 'Burmese',
          nativeName: 'ဗမာစာ'
        },
        ca: {
          name: 'Catalan; Valencian',
          nativeName: 'Català'
        },
        ch: {
          name: 'Chamorro',
          nativeName: 'Chamoru'
        },
        ce: {
          name: 'Chechen',
          nativeName: 'нохчийн мотт'
        },
        ny: {
          name: 'Chichewa; Chewa; Nyanja',
          nativeName: 'chiCheŵa, chinyanja'
        },
        zh: {
          name: 'Chinese',
          nativeName: '中文 (Zhōngwén), 汉语, 漢語'
        },
        cv: {
          name: 'Chuvash',
          nativeName: 'чӑваш чӗлхи'
        },
        kw: {
          name: 'Cornish',
          nativeName: 'Kernewek'
        },
        co: {
          name: 'Corsican',
          nativeName: 'corsu, lingua corsa'
        },
        cr: {
          name: 'Cree',
          nativeName: 'ᓀᐦᐃᔭᐍᐏᐣ'
        },
        hr: {
          name: 'Croatian',
          nativeName: 'hrvatski'
        },
        cs: {
          name: 'Czech',
          nativeName: 'česky'
        },
        da: {
          name: 'Danish',
          nativeName: 'dansk'
        },
        dv: {
          name: 'Divehi;',
          nativeName: 'ދިވެހި'
        },
        nl: {
          name: 'Dutch',
          nativeName: 'Nederlands'
        },
        en: {
          name: 'English',
          nativeName: 'English'
        },
        eo: {
          name: 'Esperanto',
          nativeName: 'Esperanto'
        },
        et: {
          name: 'Estonian',
          nativeName: 'eesti'
        },
        ee: {
          name: 'Ewe',
          nativeName: 'Eʋegbe'
        },
        fo: {
          name: 'Faroese',
          nativeName: 'føroyskt'
        },
        fj: {
          name: 'Fijian',
          nativeName: 'vosa Vakaviti'
        },
        fi: {
          name: 'Finnish',
          nativeName: 'suomi'
        },
        fr: {
          name: 'French',
          nativeName: 'Français'
        },
        ff: {
          name: 'Fula',
          nativeName: 'Fulfulde'
        },
        gl: {
          name: 'Galician',
          nativeName: 'Galego'
        },
        ka: {
          name: 'Georgian',
          nativeName: 'ქართული'
        },
        de: {
          name: 'German',
          nativeName: 'Deutsch'
        },
        el: {
          name: 'Greek, Modern',
          nativeName: 'Ελληνικά'
        },
        gn: {
          name: 'Guaraní',
          nativeName: 'Avañeẽ'
        },
        gu: {
          name: 'Gujarati',
          nativeName: 'ગુજરાતી'
        },
        ht: {
          name: 'Haitian',
          nativeName: 'Kreyòl ayisyen'
        },
        ha: {
          name: 'Hausa',
          nativeName: 'Hausa'
        },
        he: {
          name: 'Hebrew (modern)',
          nativeName: 'עברית'
        },
        hz: {
          name: 'Herero',
          nativeName: 'Otjiherero'
        },
        hi: {
          name: 'Hindi',
          nativeName: 'हिन्दी, हिंदी'
        },
        ho: {
          name: 'Hiri Motu',
          nativeName: 'Hiri Motu'
        },
        hu: {
          name: 'Hungarian',
          nativeName: 'Magyar'
        },
        ia: {
          name: 'Interlingua',
          nativeName: 'Interlingua'
        },
        id: {
          name: 'Indonesian',
          nativeName: 'Bahasa Indonesia'
        },
        ie: {
          name: 'Interlingue',
          nativeName: 'Originally called Occidental; then Interlingue after WWII'
        },
        ga: {
          name: 'Irish',
          nativeName: 'Gaeilge'
        },
        ig: {
          name: 'Igbo',
          nativeName: 'Asụsụ Igbo'
        },
        ik: {
          name: 'Inupiaq',
          nativeName: 'Iñupiaq'
        },
        io: {
          name: 'Ido',
          nativeName: 'Ido'
        },
        is: {
          name: 'Icelandic',
          nativeName: 'Íslenska'
        },
        it: {
          name: 'Italian',
          nativeName: 'Italiano'
        },
        iu: {
          name: 'Inuktitut',
          nativeName: 'ᐃᓄᒃᑎᑐᑦ'
        },
        ja: {
          name: 'Japanese',
          nativeName: '日本語 (にほんご／にっぽんご)'
        },
        jv: {
          name: 'Javanese',
          nativeName: 'basa Jawa'
        },
        kl: {
          name: 'Kalaallisut, Greenlandic',
          nativeName: 'kalaallisut'
        },
        kn: {
          name: 'Kannada',
          nativeName: 'ಕನ್ನಡ'
        },
        kr: {
          name: 'Kanuri',
          nativeName: 'Kanuri'
        },
        ks: {
          name: 'Kashmiri',
          nativeName: 'कश्मीरी, كشميري‎'
        },
        kk: {
          name: 'Kazakh',
          nativeName: 'Қазақ тілі'
        },
        km: {
          name: 'Khmer',
          nativeName: 'ភាសាខ្មែរ'
        },
        ki: {
          name: 'Kikuyu, Gikuyu',
          nativeName: 'Gĩkũyũ'
        },
        rw: {
          name: 'Kinyarwanda',
          nativeName: 'Ikinyarwanda'
        },
        ky: {
          name: 'Kirghiz, Kyrgyz',
          nativeName: 'кыргыз тили'
        },
        kv: {
          name: 'Komi',
          nativeName: 'коми кыв'
        },
        kg: {
          name: 'Kongo',
          nativeName: 'KiKongo'
        },
        ko: {
          name: 'Korean',
          nativeName: '한국어 (韓國語), 조선말 (朝鮮語)'
        },
        ku: {
          name: 'Kurdish',
          nativeName: 'Kurdî, كوردی‎'
        },
        kj: {
          name: 'Kwanyama, Kuanyama',
          nativeName: 'Kuanyama'
        },
        la: {
          name: 'Latin',
          nativeName: 'latine, lingua latina'
        },
        lb: {
          name: 'Luxembourgish, Letzeburgesch',
          nativeName: 'Lëtzebuergesch'
        },
        lg: {
          name: 'Luganda',
          nativeName: 'Luganda'
        },
        li: {
          name: 'Limburgish, Limburgan, Limburger',
          nativeName: 'Limburgs'
        },
        ln: {
          name: 'Lingala',
          nativeName: 'Lingála'
        },
        lo: {
          name: 'Lao',
          nativeName: 'ພາສາລາວ'
        },
        lt: {
          name: 'Lithuanian',
          nativeName: 'lietuvių kalba'
        },
        lu: {
          name: 'Luba-Katanga',
          nativeName: ''
        },
        lv: {
          name: 'Latvian',
          nativeName: 'latviešu valoda'
        },
        gv: {
          name: 'Manx',
          nativeName: 'Gaelg, Gailck'
        },
        mk: {
          name: 'Macedonian',
          nativeName: 'македонски јазик'
        },
        mg: {
          name: 'Malagasy',
          nativeName: 'Malagasy fiteny'
        },
        ms: {
          name: 'Malay',
          nativeName: 'bahasa Melayu, بهاس ملايو‎'
        },
        ml: {
          name: 'Malayalam',
          nativeName: 'മലയാളം'
        },
        mt: {
          name: 'Maltese',
          nativeName: 'Malti'
        },
        mi: {
          name: 'Māori',
          nativeName: 'te reo Māori'
        },
        mr: {
          name: 'Marathi (Marāṭhī)',
          nativeName: 'मराठी'
        },
        mh: {
          name: 'Marshallese',
          nativeName: 'Kajin M̧ajeļ'
        },
        mn: {
          name: 'Mongolian',
          nativeName: 'монгол'
        },
        na: {
          name: 'Nauru',
          nativeName: 'Ekakairũ Naoero'
        },
        nv: {
          name: 'Navajo, Navaho',
          nativeName: 'Diné bizaad'
        },
        nb: {
          name: 'Norwegian Bokmål',
          nativeName: 'Norsk bokmål'
        },
        nd: {
          name: 'North Ndebele',
          nativeName: 'isiNdebele'
        },
        ne: {
          name: 'Nepali',
          nativeName: 'नेपाली'
        },
        ng: {
          name: 'Ndonga',
          nativeName: 'Owambo'
        },
        nn: {
          name: 'Norwegian Nynorsk',
          nativeName: 'Norsk nynorsk'
        },
        no: {
          name: 'Norwegian',
          nativeName: 'Norsk'
        },
        ii: {
          name: 'Nuosu',
          nativeName: 'ꆈꌠ꒿ Nuosuhxop'
        },
        nr: {
          name: 'South Ndebele',
          nativeName: 'isiNdebele'
        },
        oc: {
          name: 'Occitan',
          nativeName: 'Occitan'
        },
        oj: {
          name: 'Ojibwe, Ojibwa',
          nativeName: 'ᐊᓂᔑᓈᐯᒧᐎᓐ'
        },
        cu: {
          name: 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic',
          nativeName: 'ѩзыкъ словѣньскъ'
        },
        om: {
          name: 'Oromo',
          nativeName: 'Afaan Oromoo'
        },
        or: {
          name: 'Oriya',
          nativeName: 'ଓଡ଼ିଆ'
        },
        os: {
          name: 'Ossetian, Ossetic',
          nativeName: 'ирон æвзаг'
        },
        pa: {
          name: 'Panjabi, Punjabi',
          nativeName: 'ਪੰਜਾਬੀ, پنجابی‎'
        },
        pi: {
          name: 'Pāli',
          nativeName: 'पाऴि'
        },
        fa: {
          name: 'Persian',
          nativeName: 'فارسی'
        },
        pl: {
          name: 'Polish',
          nativeName: 'polski'
        },
        ps: {
          name: 'Pashto, Pushto',
          nativeName: 'پښتو'
        },
        pt: {
          name: 'Portuguese',
          nativeName: 'Português'
        },
        qu: {
          name: 'Quechua',
          nativeName: 'Runa Simi, Kichwa'
        },
        rm: {
          name: 'Romansh',
          nativeName: 'rumantsch grischun'
        },
        rn: {
          name: 'Kirundi',
          nativeName: 'kiRundi'
        },
        ro: {
          name: 'Romanian, Moldavian, Moldovan',
          nativeName: 'română'
        },
        ru: {
          name: 'Russian',
          nativeName: 'русский язык'
        },
        sa: {
          name: 'Sanskrit (Saṁskṛta)',
          nativeName: 'संस्कृतम्'
        },
        sc: {
          name: 'Sardinian',
          nativeName: 'sardu'
        },
        sd: {
          name: 'Sindhi',
          nativeName: 'सिन्धी, سنڌي، سندھی‎'
        },
        se: {
          name: 'Northern Sami',
          nativeName: 'Davvisámegiella'
        },
        sm: {
          name: 'Samoan',
          nativeName: 'gagana faa Samoa'
        },
        sg: {
          name: 'Sango',
          nativeName: 'yângâ tî sängö'
        },
        sr: {
          name: 'Serbian',
          nativeName: 'српски језик'
        },
        gd: {
          name: 'Scottish Gaelic; Gaelic',
          nativeName: 'Gàidhlig'
        },
        sn: {
          name: 'Shona',
          nativeName: 'chiShona'
        },
        si: {
          name: 'Sinhala, Sinhalese',
          nativeName: 'සිංහල'
        },
        sk: {
          name: 'Slovak',
          nativeName: 'slovenčina'
        },
        sl: {
          name: 'Slovene',
          nativeName: 'slovenščina'
        },
        so: {
          name: 'Somali',
          nativeName: 'Soomaaliga, af Soomaali'
        },
        st: {
          name: 'Southern Sotho',
          nativeName: 'Sesotho'
        },
        es: {
          name: 'Spanish',
          nativeName: 'Español'
        },
        su: {
          name: 'Sundanese',
          nativeName: 'Basa Sunda'
        },
        sw: {
          name: 'Swahili',
          nativeName: 'Kiswahili'
        },
        ss: {
          name: 'Swati',
          nativeName: 'SiSwati'
        },
        sv: {
          name: 'Swedish',
          nativeName: 'svenska'
        },
        ta: {
          name: 'Tamil',
          nativeName: 'தமிழ்'
        },
        te: {
          name: 'Telugu',
          nativeName: 'తెలుగు'
        },
        tg: {
          name: 'Tajik',
          nativeName: 'тоҷикӣ, toğikī, تاجیکی‎'
        },
        th: {
          name: 'Thai',
          nativeName: 'ไทย'
        },
        ti: {
          name: 'Tigrinya',
          nativeName: 'ትግርኛ'
        },
        bo: {
          name: 'Tibetan Standard, Tibetan, Central',
          nativeName: 'བོད་ཡིག'
        },
        tk: {
          name: 'Turkmen',
          nativeName: 'Türkmen, Түркмен'
        },
        tl: {
          name: 'Tagalog',
          nativeName: 'Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔'
        },
        tn: {
          name: 'Tswana',
          nativeName: 'Setswana'
        },
        to: {
          name: 'Tonga (Tonga Islands)',
          nativeName: 'faka Tonga'
        },
        tr: {
          name: 'Turkish',
          nativeName: 'Türkçe'
        },
        ts: {
          name: 'Tsonga',
          nativeName: 'Xitsonga'
        },
        tt: {
          name: 'Tatar',
          nativeName: 'татарча, tatarça, تاتارچا‎'
        },
        tw: {
          name: 'Twi',
          nativeName: 'Twi'
        },
        ty: {
          name: 'Tahitian',
          nativeName: 'Reo Tahiti'
        },
        ug: {
          name: 'Uighur, Uyghur',
          nativeName: 'Uyƣurqə, ئۇيغۇرچە‎'
        },
        uk: {
          name: 'Ukrainian',
          nativeName: 'українська'
        },
        ur: {
          name: 'Urdu',
          nativeName: 'اردو'
        },
        uz: {
          name: 'Uzbek',
          nativeName: 'zbek, Ўзбек, أۇزبېك‎'
        },
        ve: {
          name: 'Venda',
          nativeName: 'Tshivenḓa'
        },
        vi: {
          name: 'Vietnamese',
          nativeName: 'Tiếng Việt'
        },
        vo: {
          name: 'Volapük',
          nativeName: 'Volapük'
        },
        wa: {
          name: 'Walloon',
          nativeName: 'Walon'
        },
        cy: {
          name: 'Welsh',
          nativeName: 'Cymraeg'
        },
        wo: {
          name: 'Wolof',
          nativeName: 'Wollof'
        },
        fy: {
          name: 'Western Frisian',
          nativeName: 'Frysk'
        },
        xh: {
          name: 'Xhosa',
          nativeName: 'isiXhosa'
        },
        yi: {
          name: 'Yiddish',
          nativeName: 'ייִדיש'
        },
        yo: {
          name: 'Yoruba',
          nativeName: 'Yorùbá'
        },
        za: {
          name: 'Zhuang, Chuang',
          nativeName: 'Saɯ cueŋƅ, Saw cuengh'
        }
      },
      lessonAdd: false,
      seriesAdd: false,
      sectionAdd: false
    }
  },
  computed: {
    isLoggedIn () {
      return store.getters.isLoggedIn
    },
    activeLanguageCode: {
      get () {
        return store.getters.activeLanguageCode
      },
      set (newValue) {
        store.commit('setActiveLanguageCode', newValue)
        this.languageChanged()
      }
    }
  },
  mounted () {
    this.setTitle(this.$route)
    this.$watch('activeLanguageCode', () => {
      this.$rtdbBind('languageDropdown', db.ref('languages'))
    }, {
      immediate: true
    })
    this.$watch('user', () => {
      if (store.getters.editorId) {
        this.$rtdbBind('editor', db.ref('editors').child(store.getters.editorId))
      }
    }, {
      immediate: true
    })
  },
  watch: {
    $route (to, from) {
      this.setTitle(to)
    }
  },
  methods: {
    toggle () {
      this.toggleDropbown = !this.toggleDropbown
    },
    languageChanged () {
      const route = this.$route
      switch (route.name) {
        case 'series':
        case 'seriesEdit':
          this.setSeries()
          break
        case 'lesson':
        case 'lessonEdit':
        case 'lessonAdd':
          this.setSeries()
          this.setLesson()
          break
        default:
      }
    },
    setSeries () {
      db.ref('series').child(store.getters.activeLanguageCode).child(store.getters.category).child(this.$route.params.seriesId).child('title').once('value', snapshot => {
        store.commit('setSeriesName', snapshot.val())
        this.setTitle(this.$route)
      })
    },
    setLesson () {
      db.ref('series').child(store.getters.activeLanguageCode).child(store.getters.category).child(this.$route.params.seriesId).child('studies').child(this.$route.params.lessonId).child('title').once('value', snapshot => {
        store.commit('setLessonName', snapshot.val())
        this.setTitle(this.$route)
      })
    },
    stopEvent: function () {

    },
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    },
    signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider).then((result) => {
        this.user = result.user
      }).catch(error => console.log(error))
    },
    signOut () {
      firebase.auth().signOut().then(() => {
        this.user = null
        store.commit('logout')
        store.commit('setEditorId', null)
        this.$router.push({ name: 'Login', params: {} })
      }).catch(error => console.log(error))
    },
    navigateToTab (route, key) {
      store.commit('setCategory', key)
      this.$router.push({ name: route, params: { category: key } }).catch(error => {
        if (error.name !== 'NavigationDuplicated') {
          throw error
        }
      })
    },
    goToSignIn () {
      this.$router.push({ name: 'Login' }).catch(error => {
        if (error.name !== 'NavigationDuplicated') {
          throw error
        }
      })
    },
    convertTitle (str) {
      str = str.replace(/-/g, ' ')
      var splitStr = str.toLowerCase().split(' ')
      for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
      }
      return splitStr.join(' ')
    },
    setTitle (route) {
      this.lessonAdd = false
      this.seriesAdd = false
      this.sectionAdd = false
      switch (route.name) {
        case 'Home':
        case 'Login':
          this.title = 'Launch Box Editor'
          break
        case 'links':
          this.title = 'Links'
          break
        case 'languages':
          this.title = 'Languages'
          break
        case 'editors':
          this.title = 'Editors'
          break
        case 'editorsEdit':
          this.title = 'Editors / Edit'
          break
        case 'ad-edit':
          this.title = 'Edit Ad'
          break
        case 'background-edit':
          this.title = 'Edit Background'
          break
        case 'section':
          this.title = 'Launch Box Editor'
          this.sectionAdd = true
          break
        case 'sectionEdit':
          this.title = 'Launch Box Editor'
          break
        case 'sectionAdd':
          this.title = 'Launch Box Editor'
          break
        case 'followup':
          this.lessonAdd = true
          this.title = 'Follow Up'
          break
        case 'thrive':
          this.seriesAdd = true
          this.title = store.getters.category
          break
        case 'seriesEdit':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / Edit Section'
          break
        case 'seriesVideoEdit':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / Edit Section Video'
          break
        case 'seriesAdd':
          this.title = store.getters.category + ' / Add Section'
          break
        case 'series':
          this.lessonAdd = true
          this.title = store.getters.category + ' / ' + store.getters.seriesName
          break
        case 'lesson':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / ' + store.getters.lessonName
          break
        case 'lessonEdit':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / Edit Chapter'
          break
        case 'lessonAdd':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / Add Chapter'
          break
        case 'itemEdit':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / ' + store.getters.lessonName + ' / Edit Item'
          break
        case 'itemAdd':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / ' + store.getters.lessonName + ' / Add Item'
          break
        case 'question':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / ' + store.getters.lessonName + ' / ' + 'Article'
          break
        case 'questionEdit':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / ' + store.getters.lessonName + ' / ' + 'Article' + ' / Edit Item'
          break
        case 'questionAdd':
          this.title = store.getters.category + ' / ' + store.getters.seriesName + ' / ' + store.getters.lessonName + ' / ' + 'Article' + ' / Add Item'
          break
        default:
      }
    }
  }
}
</script>

<style lang="scss">
@import url("//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons");

@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme("default", (
  primary: #F5BE19, // The primary color of your application
  accent: #F5BE19, // The accent or secondary color
));

@import "~vue-material/dist/theme/all"; // Apply the theme
//383F43
.app-title {
  flex: 10;
  text-transform: capitalize;
}

.skinny-dropdown {
  min-height: 0px;
  margin: 0px;
  padding-top: 0px;
}

.md-app {
  height: 100vh;
  max-height: 100vh;
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-app-content {
  padding: 0px;
}

.active-item {
  filter: invert(86%) sepia(22%) saturate(4892%) hue-rotate(348deg) brightness(104%) contrast(92%);
}

.black-icon {
  color: black !important;
}

.gold-highlight-text {
  color: gold;
  font-weight: bold;
}
.bold-highlight-text {
  font-weight: bold;
}

.profile-image {
  max-height: 32px;
  border-radius: 50%;
}

.md-layout-item.md-size-2 {
    min-width: 2%;
    max-width: 2%;
    flex: 0 1 2%;
}

</style>

<template>
  <div class="section">
    <span v-if="editor && editor.languages[activeLanguageCode].write" class=button-container>
      <md-switch v-model="canDrag">Reorder</md-switch>
      <md-switch v-model="editMode">Edit</md-switch>
    </span>
    <div class="content-container">
      <div class="content-container filler" v-if="sectionName == 'applanguage'">Nothing to view here.</div>
      <draggable v-model="sectionListSorted" :disabled="!canDrag" class="content-container">
        <div v-for="(item, index) of sectionListSorted" :key="item['.key']">
          <section-list-item @row-clicked="goToSectionOrEdit" @dropdown-clicked="languageChanged" :item="item" :canDrag="canDrag" :hasDivider="index != sectionList.length-1">
          </section-list-item>
        </div>
      </draggable>
      <md-speed-dial v-if="editor && editor.languages[activeLanguageCode].write && sectionName != 'applanguage'" class="md-bottom-right">
        <md-speed-dial-target @click="goToAdd()">
          <md-icon>add</md-icon>
          <md-tooltip md-direction="left">Add Item</md-tooltip>
        </md-speed-dial-target>
      </md-speed-dial>
    </div>
  </div>
</template>

<script>
import { db } from '../../config/db'
import draggable from 'vuedraggable'
import store from '../../config/store'
import sectionListItem from './SectionListItem'

export default {
  components: {
    draggable,
    'section-list-item': sectionListItem
  },
  props: {
    sectionName: String
  },
  data () {
    return {
      editor: null,
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
          nativeName: 'français'
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
          nativeName: 'español'
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
      canDrag: false,
      editMode: false,
      sectionList: []
    }
  },
  computed: {
    activeLanguageCode: {
      get () {
        return store.getters.activeLanguageCode
      },
      set (newValue) {
        store.commit('setActiveLanguageCode', newValue)
      }
    },
    sectionListSorted: {
      get () {
        const sorted = [...this.sectionList]

        return sorted
      },
      set (value) {
        const updates = {}

        value.forEach((item, index) => {
          db.ref('section').child(store.getters.activeLanguageCode).child(this.sectionName).child('items').on('value', function (snapshot) {
            updates[item['.key'] + '/order'] = index
          })
        })

        db.ref('section').child(store.getters.activeLanguageCode).child(this.sectionName).child('items').update(updates)
      }
    }
  },
  mounted () {
    this.$watch('sectionName', () => {
      this.$rtdbBind('sectionList', db.ref('section').child(store.getters.activeLanguageCode).child(this.sectionName).child('items').orderByChild('order'))
    }, {
      immediate: true
    })
    this.$watch('activeLanguageCode', () => {
      this.$rtdbBind('sectionList', db.ref('section').child(store.getters.activeLanguageCode).child(this.sectionName).child('items').orderByChild('order'))
    })
    this.$watch('user', () => {
      if (store.getters.editorId) {
        this.$rtdbBind('editor', db.ref('editors').child(store.getters.editorId))
      }
    }, {
      immediate: true
    })
  },
  methods: {
    stopEvent: function () {

    },
    languageChanged: function (val) {
      store.commit('setActiveLanguageCode', this.activeLanguageCode)
    },
    goToSectionOrEdit: function (sectionName, key, type) {
      if (sectionName) {
        if (this.editMode && !this.canDrag && this.editor && this.editor.languages[this.activeLanguageCode].write) {
          this.$router.push({ name: 'sectionEdit', params: { sectionName: this.sectionName, sectionItemKey: key } })
        } else if (!this.editMode && !this.canDrag) {
          this.$router.push({ name: 'section', params: { sectionName: sectionName } })
        }
      } else {
        if (this.editMode && !this.canDrag) {
          if (this.editor && this.editor.languages[this.activeLanguageCode].write && type !== 'dropdown' && type !== 'setting') {
            this.$router.push({ name: 'sectionEdit', params: { sectionName: this.sectionName, sectionItemKey: key } })
          } else if (this.editor && this.editor.admin && (type === 'dropdown' || type === 'setting')) {
            this.$router.push({ name: 'sectionEdit', params: { sectionName: this.sectionName, sectionItemKey: key } })
          }
        }
      }
    },
    goToAdd: function () {
      this.$router.push({ name: 'sectionAdd', params: { sectionName: this.sectionName, order: this.sectionList.length } })
    }
  }
}
</script>

<style scoped>
.content-container {
  width: 60%;
  margin: 0 auto;
}

.filler {
  padding-top: 8px;
}

.button-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  top: 64px;
}

.wide-button {
  width: 100%
}
</style>

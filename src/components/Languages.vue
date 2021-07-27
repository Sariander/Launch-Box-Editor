<template>
  <div class="editors">
    <div class="content-container">
      <md-card-actions>
        <md-button class="md-raised md-primary" @click="saveLanguages">Save Changes</md-button>
      </md-card-actions>
      <span v-if="languages">
        <div class="card" v-for="(item, index) of languages" :key="item['.key']">
          <md-card>
            <md-card-content class="fields">
              <span class="code-field">
                <md-field>
                  <label>Language</label>
                  <md-input disabled v-model="isoLangs[item.language].nativeName"></md-input>
                </md-field>
              </span>
              <span class="title-field">
                <md-field>
                  <label>Language Title</label>
                  <md-input v-model="item.title"></md-input>
                </md-field>
              </span>
            </md-card-content>
            <md-card-actions class="actions">
              <md-switch v-model="item.enabled" class="md-primary">Language Enabled</md-switch>
              <md-button class="md-accent" @click="removeItem(index)">Remove</md-button>
            </md-card-actions>
          </md-card>
        </div>
      </span>
      <md-speed-dial class="md-bottom-right">
        <md-speed-dial-target @click="openOptionDialog()">
          <md-icon>add</md-icon>
          <md-tooltip md-direction="left">Add Language</md-tooltip>
        </md-speed-dial-target>
      </md-speed-dial>
      <md-snackbar :md-position="'center'" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
        <span>Language changes have been saved.</span>
      </md-snackbar>
      <md-dialog :md-active.sync="confirmDialogActive">
        <md-dialog-title>Are you sure you want to remove this language?</md-dialog-title>
        <md-dialog-actions>
          <md-button @click="confirmDialogActive = false">Cancel</md-button>
          <md-button class="md-accent" @click="removeOptionItem(removeIndex)">Confirm</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog :md-active.sync="optionDialogActive">
        <md-dialog-title>New Language</md-dialog-title>
        <md-dialog-content>
          <md-field>
            <label>Language Title</label>
            <md-input v-model="newOptionTitle"></md-input>
          </md-field>
          <md-field>
            <label>Language Code</label>
            <md-input v-model="newOptionValue"></md-input>
          </md-field>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button @click="clearOptionFieldsAndClose()">Cancel</md-button>
          <md-button class="md-primary" @click="addOptionItem()">Add</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
import { db } from '../config/db'

export default {
  data () {
    return {
      languages: null,
      newOptionTitle: '',
      newOptionValue: '',
      optionDialogActive: false,
      confirmDialogActive: false,
      removeIndex: null,
      showSnackbar: false,
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
      }
    }
  },
  components: {

  },
  methods: {
    openOptionDialog: function () {
      this.newOptionTitle = ''
      this.newOptionValue = ''
      this.optionDialogActive = true
    },
    clearOptionFieldsAndClose: function () {
      this.newOptionTitle = ''
      this.newOptionValue = ''
      this.optionDialogActive = false
    },
    addOptionItem: function () {
      var languageData = {
        title: this.newOptionTitle,
        language: this.newOptionValue,
        enabled: false
      }
      db.ref('languages').once('value', snapshot => {
        if (!snapshot.exists()) {
          db.ref('languages').set('')
        }
      })
      db.ref('languages').child(this.newOptionValue).set(languageData).then(_ => {
        this.optionDialogActive = false
        this.addEditorLanguage(this.newOptionValue)
      })
    },
    removeItem (index) {
      this.removeIndex = index
      this.confirmDialogActive = true
    },
    removeOptionItem: function (index) {
      var code = this.languages[index].language
      db.ref('languages').child(index).remove().then(_ => {
        this.removeEditorLanguage(code)
      })
      this.confirmDialogActive = false
    },
    saveLanguages () {
      db.ref('languages').set(this.languages)
      this.showSnackbar = true
    },
    addEditorLanguage (code) {
      var languageData = {
        language: code,
        read: false,
        write: false
      }
      db.ref('editors').once('value', snapshot => {
        snapshot.forEach((child) => {
          db.ref('editors').child(child.key).child('languages').child(code).set(languageData)
        })
      })
    },
    removeEditorLanguage (code) {
      db.ref('editors').once('value', snapshot => {
        snapshot.forEach((child) => {
          db.ref('editors').child(child.key).child('languages').child(code).remove()
        })
      })
    }
  },
  firebase () {
    return {
      languages: db.ref('languages').orderByChild('order')
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 12px;
}

.title-field {
  flex-basis: 70%;
}

.code-field {
  flex-basis: 25%;
}

.content-container {
  width: 50%;
  margin: 8px auto;
}

.fields {
  padding: 8px 16px 0px 16px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

@media only screen and (max-width: 600px) {
  .content-container {
    width: 95%;
  }
  .fields {
    flex-wrap: wrap;
  }
  .title-field {
    flex-basis: 50%;
  }
}

@media only screen and (min-width: 600px) {
  .content-container {
    width: 95%;
  }
  .fields {
    flex-wrap: nowrap;
  }
  .title-field {
    flex-basis: 50%;
  }
}

@media only screen and (min-width: 768px) {
  .content-container {
    width: 90%;
  }
  .fields {
    flex-wrap: nowrap;
  }
  .title-field {
    flex-basis: 50%;
  }
}

@media only screen and (min-width: 992px) {
  .content-container {
    width: 75%;
  }
  .fields {
    flex-wrap: nowrap;
  }
  .title-field {
    flex-basis: 70%;
  }
}

@media only screen and (min-width: 1200px) {
  .content-container {
    width: 60%;
  }
  .fields {
    flex-wrap: nowrap;
  }
  .title-field {
    flex-basis: 70%;
  }
}

.actions {
  padding: 0px 8px 8px 8px;
}
</style>

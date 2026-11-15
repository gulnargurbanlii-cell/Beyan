export interface QuranTopic {
  id: string;
  titleAz: string;
  descriptionAz: string;
  iconName: string;
  verseRefs: Array<{
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    textArabic: string;
    translationAz: string;
    reflectionNote: string;
  }>;
}

export const QURAN_TOPICS: QuranTopic[] = [
  {
    id: 'sabr',
    titleAz: 'Səbr & İmtahan',
    descriptionAz: 'Çətinliklərdə qəlbi möhkəm saxlamaq, şikayət etmədən Allahın lütfünə arxalanmaq',
    iconName: 'Shield',
    verseRefs: [
      {
        surahNumber: 94,
        surahName: 'əl-İnşirah',
        ayahNumber: 5,
        textArabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        translationAz: 'Şübhəsiz ki, hər çətinliklə yanaşı bir asanlıq vardır!',
        reflectionNote: 'Heç bir kədər və çətinlik daimi deyil. Asanlıq çətinliyin ardınca yox, onunla yanaşı yaradılmışdır.'
      },
      {
        surahNumber: 103,
        surahName: 'əl-Əsr',
        ayahNumber: 3,
        textArabic: 'وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        translationAz: '...və bir-birinə haqqı tövsiyə edən və səbri tövsiyə edənlər ziyan çəkməzlər!',
        reflectionNote: 'Səbr təkbaşına deyil, həm də bir-birimizə dayaq olaraq yaşanmalıdır.'
      }
    ]
  },
  {
    id: 'shukur',
    titleAz: 'Şükür & Nemət',
    descriptionAz: 'Verilən nemətləri görmək, etiraf etmək və Allaha minnətdarlıqla yaşamaq',
    iconName: 'HeartHandshake',
    verseRefs: [
      {
        surahNumber: 1,
        surahName: 'əl-Fatihə',
        ayahNumber: 2,
        textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        translationAz: 'Həmd olsun aləmlərin Rəbbi olan Allaha!',
        reflectionNote: 'Günün hər anını həmdlə başlamaq qəlbin gözünü açır və narazılığı yox edir.'
      },
      {
        surahNumber: 108,
        surahName: 'əl-Kövsər',
        ayahNumber: 1,
        textArabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        translationAz: 'Həqiqətən, Biz sənə Kövsəri (tükənməz bol neməti) bəxş etdik!',
        reflectionNote: 'Hər bir insanın həyatında sayıla bilməyəcək qədər kövsər nemətləri vardır.'
      }
    ]
  },
  {
    id: 'dua',
    titleAz: 'Dua & Təvəkkül',
    descriptionAz: 'Yalnız Allaha yönəlmək, səmimi qəlbdən istəmək və nəticəni Ona tapşırmaq',
    iconName: 'Sparkles',
    verseRefs: [
      {
        surahNumber: 1,
        surahName: 'əl-Fatihə',
        ayahNumber: 5,
        textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translationAz: 'Yalnız Sənə ibadət edir və yalnız Səndən kömək diləyirik!',
        reflectionNote: 'Bütün qorxulardan qurtulmağın tək sirri: gücün yalnız Allahda olduğunu dərk etməkdir.'
      },
      {
        surahNumber: 113,
        surahName: 'əl-Fələq',
        ayahNumber: 1,
        textArabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        translationAz: 'De: "Pənah aparıram sübhün Rəbbinə!"',
        reflectionNote: 'Qaranlıq nə qədər sıx olsa da, sübhü yaran Allah hər bir sıxıntını aydınlığa çıxarmağa qadirdir.'
      }
    ]
  },
  {
    id: 'tefekkur',
    titleAz: 'Təfəkkür & Kainat',
    descriptionAz: 'Yaradılışın ecazkarlığı, ulduzlar, göylər və insanın öz daxili aləmi üzərində düşünmək',
    iconName: 'Compass',
    verseRefs: [
      {
        surahNumber: 67,
        surahName: 'əl-Mülk',
        ayahNumber: 3,
        textArabic: 'مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
        translationAz: 'Sən Rəhmanın yaratdığında heç bir uyğunsuzluq görməzsən. Bir gözünü qaldırıb bax, heç bir yarıq (qüsur) görə bilərsənmi?!',
        reflectionNote: 'Kainatdakı qüsursuz nizam təsadüf ola bilməz; hər zərrə böyük bir hikmət və sevgi ilə xəlq olunub.'
      }
    ]
  },
  {
    id: 'ixlas',
    titleAz: 'İxlas & Tövhid',
    descriptionAz: 'Qəlbi riyadan, şirkdən və insanlara xoş görünmək arzusundan təmizləmək',
    iconName: 'Sun',
    verseRefs: [
      {
        surahNumber: 112,
        surahName: 'əl-İxlas',
        ayahNumber: 2,
        textArabic: 'اللَّهُ الصَّمَدُ',
        translationAz: 'Allah Möhtacsızdır (hər kəs Ona möhtacdır, O heç nəyə möhtac deyil)!',
        reflectionNote: 'Qəlbi insanlardan asılılıqdan azad edib yalnız Saməd olan Allaha bağlamaq azadlığın ən uca zirvəsidir.'
      }
    ]
  }
];

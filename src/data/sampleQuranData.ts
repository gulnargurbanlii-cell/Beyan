import { Ayah } from '../types';

export const OFFLINE_SURAHS: Record<number, Ayah[]> = {
  // Surah 1: Al-Fatiha
  1: [
    {
      numberInSurah: 1,
      arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Bismilləhir-Rahmənir-Rahim',
      translations: {
        az_mammadaliyev: 'Mərhəmətli və Rəhmli Allahın adı ilə!',
        az_musayev: 'Mərhəmətli və Rəhmli Allahın adı ilə!',
        tr_diyanet: 'Rahmân ve Rahîm olan Allah\'ın adıyla.',
        en_sahih: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        ru_kuliev: 'Во имя Аллаха, Милостивого, Милосердного!'
      }
    },
    {
      numberInSurah: 2,
      arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Əl-həmdu lilləhi Rabbil-aləmin',
      translations: {
        az_mammadaliyev: 'Həmd olsun aləmlərin Rəbbi olan Allaha,',
        az_musayev: 'Həmd olsun aləmlərin Rəbbi Allaha,',
        tr_diyanet: 'Hamd, âlemlerin Rabbi olan Allah\'a aittir.',
        en_sahih: '[All] praise is [due] to Allah, Lord of the worlds -',
        ru_kuliev: 'Хвала Аллаху, Господу миров,'
      }
    },
    {
      numberInSurah: 3,
      arabicText: 'الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Ər-Rahmənir-Rahim',
      translations: {
        az_mammadaliyev: 'Mərhəmətli və Rəhmli olana,',
        az_musayev: 'Mərhəmətli və Rəhmli olana,',
        tr_diyanet: 'O, Rahmân ve Rahîm\'dir.',
        en_sahih: 'The Entirely Merciful, the Especially Merciful,',
        ru_kuliev: 'Милостивому, Милосердному,'
      }
    },
    {
      numberInSurah: 4,
      arabicText: 'مَالِكِ يَوْمِ الدِّينِ',
      transliteration: 'Məliki yəvmid-din',
      translations: {
        az_mammadaliyev: 'Haqq-hesab (cəza və mükafat) gününün Sahibinə!',
        az_musayev: 'Haqq-hesab gününün Hökmdarına!',
        tr_diyanet: 'Din (ceza ve mükâfat) gününün sahibidir.',
        en_sahih: 'Sovereign of the Day of Recompense.',
        ru_kuliev: 'Властелину Дня воздаяния!'
      }
    },
    {
      numberInSurah: 5,
      arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      transliteration: 'İyyəkə nə\'budu və iyyəkə nəstəin',
      translations: {
        az_mammadaliyev: 'Yalnız Sənə ibadət edir və yalnız Səndən kömək diləyirik!',
        az_musayev: 'Biz yalnız Sənə ibadət edir və yalnız Səndən kömək diləyirik!',
        tr_diyanet: '(Rabbimiz!) Ancak sana kulluk eder ve yalnız senden yardım dileriz.',
        en_sahih: 'It is You we worship and You we ask for help.',
        ru_kuliev: 'Тебе одному мы поклоняемся и Тебя одного молим о помощи.'
      }
    },
    {
      numberInSurah: 6,
      arabicText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      transliteration: 'İhdinəs-siratal-mustəqim',
      translations: {
        az_mammadaliyev: 'Bizi doğru yola yönəlt,',
        az_musayev: 'Bizi doğru yola yönəlt -',
        tr_diyanet: 'Bizi doğru yola ilet;',
        en_sahih: 'Guide us to the straight path -',
        ru_kuliev: 'Веди нас прямым путем,'
      }
    },
    {
      numberInSurah: 7,
      arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      transliteration: 'Siratalləzinə ən\'amtə əleyhim, ğeyril-məğdubi əleyhim vələd-dallin',
      translations: {
        az_mammadaliyev: 'Nemət bəxş etdiyin kəslərin yoluna! Qəzəbə düçar olmuşların və zəlalətə uğrayanların yoluna yox!',
        az_musayev: 'Nemət verdiyin kəslərin yoluna! Qəzəbə uğramışların və azmışların yoluna deyil!',
        tr_diyanet: 'Kendilerine lütufta bulunduğun kimselerin yoluna; gazaba uğramışların ve sapmışların yoluna değil.',
        en_sahih: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
        ru_kuliev: 'путем тех, кого Ты облагодетельствовал, не тех, на кого пал гнев, и не заблудших.'
      }
    }
  ],

  // Surah 112: Al-Ikhlas
  112: [
    {
      numberInSurah: 1,
      arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      transliteration: 'Qul huvallahu Əhəd',
      translations: {
        az_mammadaliyev: 'De: "O Allah Təkdir!',
        az_musayev: 'De: "O Allah Təkdir!',
        tr_diyanet: 'De ki: O, Allah\'tır, tektir.',
        en_sahih: 'Say, "He is Allah, [who is] One,',
        ru_kuliev: 'Скажи: «Он — Аллах Единый,'
      }
    },
    {
      numberInSurah: 2,
      arabicText: 'اللَّهُ الصَّمَدُ',
      transliteration: 'Allahus-Saməd',
      translations: {
        az_mammadaliyev: 'Allah Möhtacsızdır (hər şey Ona möhtacdır, O heç nəyə möhtac deyil)!',
        az_musayev: 'Allah Səməddir (heç nəyə möhtac deyildir, hər şey Ona möhtacdır)!',
        tr_diyanet: 'Allah Samed\'dir (her şey O\'na muhtaçtır; O, hiçbir şeye muhtaç değildir).',
        en_sahih: 'Allah, the Eternal Refuge.',
        ru_kuliev: 'Аллах Самодостаточный.'
      }
    },
    {
      numberInSurah: 3,
      arabicText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      transliteration: 'Ləm yəlid vələm yuləd',
      translations: {
        az_mammadaliyev: 'O, nə doğmuş, nə də doğulmuşdur!',
        az_musayev: 'O, nə doğmuş, nə də doğulmuşdur!',
        tr_diyanet: 'O, doğurmamış ve doğurulmamıştır.',
        en_sahih: 'He neither begets nor is born,',
        ru_kuliev: 'Он не родил и не был рожден,'
      }
    },
    {
      numberInSurah: 4,
      arabicText: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
      transliteration: 'Vələm yəkun ləhu kufuvan əhəd',
      translations: {
        az_mammadaliyev: 'Və Onun heç bir tayı-bərabəri də yoxdur!"',
        az_musayev: 'Onun heç bir bənzəri də yoxdur!"',
        tr_diyanet: 'Hiçbir şey O\'na denk değildir.',
        en_sahih: 'Nor is there to Him any equivalent."',
        ru_kuliev: 'и нет никого, равного Ему».'
      }
    }
  ],

  // Surah 113: Al-Falaq
  113: [
    {
      numberInSurah: 1,
      arabicText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      transliteration: 'Qul əuzu bi Rabbil-fələq',
      translations: {
        az_mammadaliyev: 'De: "Pənah aparıram sübhün Rəbbinə!',
        az_musayev: 'De: "Pənah aparıram sübhün Rəbbinə!',
        tr_diyanet: 'De ki: "Sabahın Rabbine sığınırım;',
        en_sahih: 'Say, "I seek refuge in the Lord of daybreak',
        ru_kuliev: 'Скажи: «Уповаю на защиту Господа рассвета'
      }
    },
    {
      numberInSurah: 2,
      arabicText: 'مِنْ شَرِّ مَا خَلَقَ',
      transliteration: 'Min şərri mə xələq',
      translations: {
        az_mammadaliyev: 'Yaratdıqlarının şərindən;',
        az_musayev: 'Yaratdıqlarının şərindən;',
        tr_diyanet: 'Yarattığı şeylerin şerrinden,',
        en_sahih: 'From the evil of that which He created',
        ru_kuliev: 'от зла того, что Он сотворил,'
      }
    },
    {
      numberInSurah: 3,
      arabicText: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      transliteration: 'Və min şərri ğasiqin izə vəqab',
      translations: {
        az_mammadaliyev: 'Zülmətə bürünməkdə olan gecənin şərindən;',
        az_musayev: 'Zülmətə bürünən gecənin şərindən;',
        tr_diyanet: 'Karanlığı çöktüğü zaman gecenin şerrinden,',
        en_sahih: 'And from the evil of darkness when it settles',
        ru_kuliev: 'от зла мрака, когда он наступает,'
      }
    },
    {
      numberInSurah: 4,
      arabicText: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      transliteration: 'Və min şərrin-nəffəsəti fil-\'uqad',
      translations: {
        az_mammadaliyev: 'Düyünlərə üfürən (əfsunçu) qadınların şərindən;',
        az_musayev: 'Düyünlərə üfürən qadınların şərindən;',
        tr_diyanet: 'Düğümlere üfleyenlerin şerrinden,',
        en_sahih: 'And from the evil of the blowers in knots',
        ru_kuliev: 'от зла колдуний, дующих на узлы,'
      }
    },
    {
      numberInSurah: 5,
      arabicText: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      transliteration: 'Və min şərri həsidin izə həsəd',
      translations: {
        az_mammadaliyev: 'Və paxıllıq edən zaman paxılın şərindən!"',
        az_musayev: 'Və həsəd aparan zaman paxılın şərindən!"',
        tr_diyanet: 'Ve haset ettiği zaman hasetçinin şerrinden."',
        en_sahih: 'And from the evil of an envier when he envies."',
        ru_kuliev: 'от зла завистника, когда он завидует».'
      }
    }
  ],

  // Surah 114: An-Nas
  114: [
    {
      numberInSurah: 1,
      arabicText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      transliteration: 'Qul əuzu bi Rabbin-nəs',
      translations: {
        az_mammadaliyev: 'De: "Pənah aparıram insanların Rəbbinə,',
        az_musayev: 'De: "Sığınıram insanların Rəbbinə,',
        tr_diyanet: 'De ki: "İnsanların Rabbine sığınırım;',
        en_sahih: 'Say, "I seek refuge in the Lord of mankind,',
        ru_kuliev: 'Скажи: «Ищу убежища у Господа людей,'
      }
    },
    {
      numberInSurah: 2,
      arabicText: 'مَلِكِ النَّاسِ',
      transliteration: 'Məlikin-nəs',
      translations: {
        az_mammadaliyev: 'İnsanların Hökmdarına,',
        az_musayev: 'İnsanların Hökmdarına,',
        tr_diyanet: 'İnsanların malikine (mutlak hükümranına),',
        en_sahih: 'The Sovereign of mankind,',
        ru_kuliev: 'Царя людей,'
      }
    },
    {
      numberInSurah: 3,
      arabicText: 'إِلَٰهِ النَّاسِ',
      transliteration: 'İləhin-nəs',
      translations: {
        az_mammadaliyev: 'İnsanların İlahına (məbuduna),',
        az_musayev: 'İnsanların İlahına,',
        tr_diyanet: 'İnsanların ilâhına;',
        en_sahih: 'The God of mankind,',
        ru_kuliev: 'Бога людей,'
      }
    },
    {
      numberInSurah: 4,
      arabicText: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      transliteration: 'Min şərril-vəsvəsil-xannəs',
      translations: {
        az_mammadaliyev: 'Vəsvəsə verən, Allahın adı çəkiləndə isə geri çəkilən şeytanın şərindən,',
        az_musayev: 'Vəsvəsə verən və Allahın adı çəkiləndə qaçıb gizlənən şeytanın şərindən,',
        tr_diyanet: 'Sinsi vesvesecinin şerrinden,',
        en_sahih: 'From the evil of the retreating whisperer -',
        ru_kuliev: 'от зла искусителя, исчезающего при поминании Аллаха,'
      }
    },
    {
      numberInSurah: 5,
      arabicText: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      transliteration: 'Əlləzi yuvəsvisu fi sudurin-nəs',
      translations: {
        az_mammadaliyev: 'O şeytan ki, insanların ürəklərinə vəsvəsə salar,',
        az_musayev: 'O kəs ki, insanların kökslərinə vəsvəsə salır,',
        tr_diyanet: 'Ki o, insanların göğüslerine vesvese verir;',
        en_sahih: 'Who whispers into the breasts of mankind -',
        ru_kuliev: 'который западает в сердца людей,'
      }
    },
    {
      numberInSurah: 6,
      arabicText: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
      transliteration: 'Minəl-cinnəti vən-nəs',
      translations: {
        az_mammadaliyev: 'İstər cinlərdən olsun, istərsə də insanlardan!"',
        az_musayev: 'Cinlərdən də olur, insanlardan da!"',
        tr_diyanet: 'Gerek cinlerden, gerek insanlardan olan her vesvesecinin şerrinden."',
        en_sahih: 'From among the jinn and mankind."',
        ru_kuliev: 'представляя собой джиннов или людей».'
      }
    }
  ],

  // Surah 103: Al-Asr
  103: [
    {
      numberInSurah: 1,
      arabicText: 'وَالْعَصْرِ',
      transliteration: 'Vəl-\'Asr',
      translations: {
        az_mammadaliyev: 'And olsun əsrə (zamanın axarına və ya əsr namazı vaxtına) ki,',
        az_musayev: 'And olsun əsr çağına ki,',
        tr_diyanet: 'Asra yemin olsun ki,',
        en_sahih: 'By time,',
        ru_kuliev: 'Клянусь предвечерним временем,'
      }
    },
    {
      numberInSurah: 2,
      arabicText: 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ',
      transliteration: 'İnnəl-insənə ləfi xusr',
      translations: {
        az_mammadaliyev: 'Həqiqətən, insan ziyan içərisindədir;',
        az_musayev: 'Həqiqətən, insan ziyan içindədir.',
        tr_diyanet: 'İnsan mutlaka ziyandadır.',
        en_sahih: 'Indeed, mankind is in loss,',
        ru_kuliev: 'что люди несут убытки,'
      }
    },
    {
      numberInSurah: 3,
      arabicText: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
      transliteration: 'İllalləzinə əmənu və \'amilus-salihati və təvasəv bil-həqqi və təvasəv bis-sabr',
      translations: {
        az_mammadaliyev: 'Yalnız iman gətirib yaxşı əməllər edən, bir-birinə haqqı tövsiyə edən və səbri tövsiyə edən kimsələrdən başqa!',
        az_musayev: 'Yalnız iman gətirib yaxşı işlər görən, bir-birinə haqqı və səbri tövsiyə edən kimsələrdən başqa!',
        tr_diyanet: 'Ancak iman edip salih amel işleyenler, birbirlerine hakkı tavsiye edenler ve sabrı tavsiye edenler müstesnadır.',
        en_sahih: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.',
        ru_kuliev: 'кроме тех, которые уверовали, совершали праведные деяния, заповедали друг другу истину и заповедали друг другу терпение!'
      }
    }
  ],

  // Surah 108: Al-Kawthar
  108: [
    {
      numberInSurah: 1,
      arabicText: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      transliteration: 'İnnə ə\'taynəkəl-Kəvsər',
      translations: {
        az_mammadaliyev: 'Həqiqətən, Biz sənə Kövsəri (bol xeyir və cənnət çeşməsini) bəxş etdik!',
        az_musayev: 'Həqiqətən, Biz sənə Kövsəri bəxş etdik.',
        tr_diyanet: 'Şüphesiz biz sana Kevser\'i verdik.',
        en_sahih: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
        ru_kuliev: 'Мы даровали тебе Изобилие (реку в Раю, названную аль-Кяусар).'
      }
    },
    {
      numberInSurah: 2,
      arabicText: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      transliteration: 'Fəsalli li Rabbikə vənhar',
      translations: {
        az_mammadaliyev: 'Sən də Rəbbin üçün namaz qıl və qurban kəs!',
        az_musayev: 'Sən də Rəbbin üçün namaz qıl və qurban kəs!',
        tr_diyanet: 'Öyleyse Rabbin için namaz kıl ve kurban kes.',
        en_sahih: 'So pray to your Lord and sacrifice [to Him alone].',
        ru_kuliev: 'Посему совершай намаз ради своего Господа и закалывай жертву.'
      }
    },
    {
      numberInSurah: 3,
      arabicText: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
      transliteration: 'İnnə şəni\'əkə huvəl-əbtər',
      translations: {
        az_mammadaliyev: 'Şübhəsiz ki, sənin düşməninin özü sonsuzdur (adı-sanı batacaqdır)!',
        az_musayev: 'Doğrusu, sənə nifrət edənin özü sonsuzdur!',
        tr_diyanet: 'Doğrusu sana kin besleyendir soyu kesik olan.',
        en_sahih: 'Indeed, your enemy is the one cut off.',
        ru_kuliev: 'Воистину, твой ненавистник сам окажется бездетным.'
      }
    }
  ],

  // Surah 94: Ash-Sharh (Al-Inshirah)
  94: [
    {
      numberInSurah: 1,
      arabicText: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
      transliteration: 'Ələm nəşrah ləkə sadrak',
      translations: {
        az_mammadaliyev: 'Məgər Biz sənin köksünü açıb genişləndirmədikmi?',
        az_musayev: 'Məgər Biz sənin köksünü açıb genişlətmədikmi?',
        tr_diyanet: 'Biz senin göğsünü açıp genişletmedik mi?',
        en_sahih: 'Did We not expand for you, [O Muhammad], your breast?',
        ru_kuliev: 'Разве Мы не раскрыли твою грудь?'
      }
    },
    {
      numberInSurah: 2,
      arabicText: 'وَوَضَعْنَا عَنْكَ وِزْرَكَ',
      transliteration: 'Və vəda\'nə \'ankə vizrak',
      translations: {
        az_mammadaliyev: 'Və sənin ağır yükünü üstündən götürmədikmi?',
        az_musayev: 'Ağır yükünü səndən götürmədikmi?',
        tr_diyanet: 'Belini büken yükünü senden alıp atmadık mı?',
        en_sahih: 'And We removed from you your burden',
        ru_kuliev: 'И сняли с тебя твою ношу,'
      }
    },
    {
      numberInSurah: 3,
      arabicText: 'الَّذِي أَنْقَضَ ظَهْرَكَ',
      transliteration: 'Əlləzi ənqada zahrak',
      translations: {
        az_mammadaliyev: 'O yük ki, sənin belini bükürdü.',
        az_musayev: 'O yük ki, sənin belini bükürdü.',
        tr_diyanet: 'Ki o senin belini bükmüştü.',
        en_sahih: 'Which had weighed upon your back',
        ru_kuliev: 'которая отягощала твою спину?'
      }
    },
    {
      numberInSurah: 4,
      arabicText: 'وَرَفَعْنَا لَكَ ذِكْرَكَ',
      transliteration: 'Və rafa\'nə ləkə zikrak',
      translations: {
        az_mammadaliyev: 'Və sənin adını-şanını ucaltmadıqmı?',
        az_musayev: 'Sənin ad-sanını ucaltmadıqmı?',
        tr_diyanet: 'Senin şanını yüceltmedik mi?',
        en_sahih: 'And raised high for you your repute.',
        ru_kuliev: 'Разве Мы не возвеличили твое поминание?'
      }
    },
    {
      numberInSurah: 5,
      arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
      transliteration: 'Fəinnə mə\'al-\'usri yusrə',
      translations: {
        az_mammadaliyev: 'Şübhəsiz ki, hər çətinliklə yanaşı bir asanlıq vardır!',
        az_musayev: 'Şübhəsiz ki, hər çətinliyin ardınca bir asanlıq gələr.',
        tr_diyanet: 'Demek ki zorlukla beraber bir kolaylık vardır.',
        en_sahih: 'For indeed, with hardship [will be] ease.',
        ru_kuliev: 'Воистину, за каждой тягостью наступает облегчение.'
      }
    },
    {
      numberInSurah: 6,
      arabicText: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      transliteration: 'İnnə mə\'al-\'usri yusrə',
      translations: {
        az_mammadaliyev: 'Həqiqətən, hər çətinliklə yanaşı bir asanlıq vardır!',
        az_musayev: 'Həqiqətən, hər çətinliyin ardınca bir asanlıq gələr.',
        tr_diyanet: 'Evet, zorlukla beraber bir kolaylık vardır.',
        en_sahih: 'Indeed, with hardship [will be] ease.',
        ru_kuliev: 'За каждой тягостью наступает облегчение.'
      }
    },
    {
      numberInSurah: 7,
      arabicText: 'فَإِذَا فَرَغْتَ فَانْصَبْ',
      transliteration: 'Fəizə fərağtə fənsab',
      translations: {
        az_mammadaliyev: 'Elə isə bir işi qurtardıqda digərinə başla (daim ibadət və xeyir işlə məşğul ol)!',
        az_musayev: 'Elə ki, bir işi qurtardın, digərinə giriş!',
        tr_diyanet: 'O halde boş kaldığın zaman hemen başka bir işe koyul,',
        en_sahih: 'So when you have finished [your duties], labor hard,',
        ru_kuliev: 'Посему, как только освободишься, будь деятелен'
      }
    },
    {
      numberInSurah: 8,
      arabicText: 'وَإِلَىٰ رَبِّكَ فَارْغَبْ',
      transliteration: 'Və ilə Rabbikə fərğab',
      translations: {
        az_mammadaliyev: 'Və ancaq Rəbbinə rəğbət bəslə (Ona yönəl)!',
        az_musayev: 'Və ancaq Rəbbinə üz tut!',
        tr_diyanet: 'Ve yalnız Rabbine yönel.',
        en_sahih: 'And to your Lord direct [your] longing.',
        ru_kuliev: 'и устремись к своему Господу.'
      }
    }
  ],

  // Surah 97: Al-Qadr
  97: [
    {
      numberInSurah: 1,
      arabicText: 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
      transliteration: 'İnnə ənzəlnəhu fi ləylətil-Qadr',
      translations: {
        az_mammadaliyev: 'Həqiqətən, Biz onu (Quranı) Qədr gecəsində nazil etdik!',
        az_musayev: 'Həqiqətən, Biz onu Qədr gecəsində nazil etdik!',
        tr_diyanet: 'Şüphesiz, biz onu (Kur\'an\'ı) Kadir gecesinde indirdik.',
        en_sahih: 'Indeed, We sent the Qur\'an down during the Night of Decree.',
        ru_kuliev: 'Воистину, Мы ниспослали его (Коран) в ночь предопределения (или величия).'
      }
    },
    {
      numberInSurah: 2,
      arabicText: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ',
      transliteration: 'Və mə ədrəkə mə ləylətul-Qadr',
      translations: {
        az_mammadaliyev: 'Sən haradan biləsən ki, Qədr gecəsi nədir?!',
        az_musayev: 'Sən haradan biləsən ki, Qədr gecəsi nədir?',
        tr_diyanet: 'Kadir gecesinin ne olduğunu sen ne bileceksin?',
        en_sahih: 'And what can make you know what is the Night of Decree?',
        ru_kuliev: 'Откуда ты мог знать, что такое ночь предопределения (или величия)?'
      }
    },
    {
      numberInSurah: 3,
      arabicText: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ',
      transliteration: 'Ləylətul-Qadri xayrun min əlfi şəhr',
      translations: {
        az_mammadaliyev: 'Qədr gecəsi min aydan daha xeyirlidir!',
        az_musayev: 'Qədr gecəsi min aydan xeyirlidir.',
        tr_diyanet: 'Kadir gecesi bin aydan daha hayırlıdır.',
        en_sahih: 'The Night of Decree is better than a thousand months.',
        ru_kuliev: 'Ночь предопределения (или величия) лучше тысячи месяцев.'
      }
    },
    {
      numberInSurah: 4,
      arabicText: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِنْ كُلِّ أَمْرٍ',
      transliteration: 'Tənəzzəlul-mələr\'ikətu vər-Ruhu fihə bi\'izni Rabbihim min kulli əmr',
      translations: {
        az_mammadaliyev: 'O gecə mələklər və Ruh (Cəbrail) Rəbbinin izni ilə hər bir iş üçün enərlər.',
        az_musayev: 'O gecə mələklər və Ruh (Cəbrail) Rəbbinin izni ilə hər bir əmr üçün yerə enirlər.',
        tr_diyanet: 'Melekler ve Ruh (Cebrail) o gecede, Rablerinin izniyle her türlü iş için iner de iner.',
        en_sahih: 'The angels and the Spirit descend therein by permission of their Lord for every matter.',
        ru_kuliev: 'В эту ночь ангелы и Дух (Джибрил) нисходят с дозволения их Господа по всем Его повелениям.'
      }
    },
    {
      numberInSurah: 5,
      arabicText: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
      transliteration: 'Sələmun hiyə həttə matla\'il-fəcr',
      translations: {
        az_mammadaliyev: 'O gecə sübh açılana qədər bir əmin-amanlıq (sülh və salamatlıq) olar!',
        az_musayev: 'O gecə dan yeri sökülənə kimi salamatlıqdır.',
        tr_diyanet: 'O gece, tanyeri ağarıncaya kadar bir esenliktir.',
        en_sahih: 'Peace it is until the emergence of dawn.',
        ru_kuliev: 'Она благополучна вплоть до наступления зари.'
      }
    }
  ],

  // Surah 67: Al-Mulk (1-5 excerpt)
  67: [
    {
      numberInSurah: 1,
      arabicText: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: 'Təbərakəlləzi biyədihil-mulku və huvə \'alə kulli şəy\'in qadir',
      translations: {
        az_mammadaliyev: 'Hökm (mülk və səltənət) əlində olan Allah nə qədər Uca və Bərəkətlidir! O, hər şeyə qadirdir!',
        az_musayev: 'Hökmranlıq Əlində olan Allah nə qədər Xeyirxahdır! O, hər şeyə Qadirdir.',
        tr_diyanet: 'Hükümranlık elinde olan Allah, yüceler yücesidir ve O, her şeye hakkıyla kadirdir.',
        en_sahih: 'Blessed is He in whose hand is dominion, and He is over all things competent -',
        ru_kuliev: 'Благословен Тот, в Чьих Руках власть, Кто способен на всякую вещь,'
      }
    },
    {
      numberInSurah: 2,
      arabicText: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ الْعَزِيزُ الْغَفُورُ',
      transliteration: 'Əlləzi xələqal-məvtə vəl-həyətə liyəbluvəkum əyyukum əhsənu \'amələn və huvəl-\'Azizul-Ğafur',
      translations: {
        az_mammadaliyev: 'Hansınızın daha yaxşı əməl sahibi olduğunu sınamaq üçün ölümü və həyatı yaradan Odur. O, Qüdrətlidir, Bağışlayandır!',
        az_musayev: 'Hansınızın əməlcə daha gözəl olduğunu sınamaq üçün ölümü və həyatı yaradan Odur. O, Qüdrətlidir, Bağışlayandır.',
        tr_diyanet: 'O, hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratandır. O, mutlak güç sahibidir, çok bağışlayandır.',
        en_sahih: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -',
        ru_kuliev: 'Кто сотворил смерть и жизнь, чтобы испытать вас и увидеть, чьи деяния окажутся лучше. Он — Могущественный, Прощающий.'
      }
    },
    {
      numberInSurah: 3,
      arabicText: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
      transliteration: 'Əlləzi xələqa səb\'a səməvətin tibəqan, mə tərā fi xəlqir-Rahməni min təfəvut, fərci\'il-bəsara həl tərā min futur',
      translations: {
        az_mammadaliyev: 'Yeddi göyü qat-qat yaradan Odur. Sən Rəhmanın yaratdığında heç bir uyğunsuzluq görməzsən. Bir gözünü qaldırıb bax, heç bir yarıq (qüsur) görə bilərsənmi?!',
        az_musayev: 'Yeddi göyü təbəqələr şəklində quran Odur. Sən Mərhəmətli Allahın yaratdığında heç bir uyğunsuzluq görməzsən. Bir göz gəzdir, heç bir çat görə bilərsənmi?',
        tr_diyanet: 'O, yedi göğü tabaka tabaka yaratandır. Rahmân\'ın yaratışında hiçbir uyumsuzluk göremezsin. Bir kez daha bak! Bir çatlak görebiliyor musun?',
        en_sahih: '[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision; do you see any breaks?',
        ru_kuliev: 'Он создал семь небес одно над другим. В творении Милостивого ты не увидишь никакой несообразности. Взгляни еще раз. Видишь ли ты какую-нибудь трещину?'
      }
    },
    {
      numberInSurah: 4,
      arabicText: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ',
      transliteration: 'Summərci\'il-bəsara kərrətəyni yənqalib iləykəl-bəsaru xəsi\'ən və huvə həsir',
      translations: {
        az_mammadaliyev: 'Sonra gözünü təkrar-təkrar qaldırıb bax. Göz yorulub zəif düşərək xar və aciz halda sənə tərəf qayıdacaqdır.',
        az_musayev: 'Sonra gözünü təkrar-təkrar çevirib bax. Göz yorğun və əldən düşmüş halda sənə qayıdacaqdır.',
        tr_diyanet: 'Sonra tekrar tekrar bak; bakışların (kusur bulmaktan) yorulmuş ve bitkin düşmüş olarak sana dönecektir.',
        en_sahih: 'Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.',
        ru_kuliev: 'Потом взгляни еще раз и еще раз, и твой взор вернется к тебе усталым и утомленным.'
      }
    },
    {
      numberInSurah: 5,
      arabicText: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ',
      transliteration: 'Vələqad zəyyənnəs-səmə\'əd-dunyə biməsəbihə və cə\'alnəhə rucumən liş-şəyətini və ə\'tədnə ləhum \'azəbəs-sə\'ir',
      translations: {
        az_mammadaliyev: 'Həqiqətən, Biz ən yaxın göyü çıraqlarla (ulduzlarla) bəzədik və onları şeytanlara atılan daşlar etdik. Və onlar üçün alovlu əzab hazırladıq!',
        az_musayev: 'Biz ən yaxın göyü qəndillərlə bəzədik və onları şeytanlara atılan mərmilər etdik. Onlar üçün yandırıb-yaxan od cəzası hazırladıq.',
        tr_diyanet: 'Andolsun biz en yakın göğü kandillerle donattık. Onları şeytanlara atılan taşlar yaptık ve onlara alevli ateş azabını hazırladık.',
        en_sahih: 'And We have certainly beautified the nearest heaven with stars and have made [from] them what is thrown at the devils and have prepared for them the punishment of the Blaze.',
        ru_kuliev: 'Воистину, Мы украсили ближайшее небо светильниками и установили их для метания в дьяволов. Мы приготовили для них мучения в Адском пламени.'
      }
    }
  ]
};

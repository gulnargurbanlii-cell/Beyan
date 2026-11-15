import { Reciter, HighlightColorConfig } from '../types';

export const RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    name: 'Mişari Rəşid əl-Əfasi',
    style: 'Murattal (Klassik & Dəqiq)',
    subfolder: 'Alafasy_128kbps',
    editionId: 'ar.alafasy'
  },
  {
    id: 'husary',
    name: 'Mahmud Xəlil əl-Husəri',
    style: 'Təcvid ustadı (Tədris üslubu)',
    subfolder: 'Husary_128kbps',
    editionId: 'ar.husary'
  },
  {
    id: 'abdulbasit',
    name: 'Əbdülbasit Əbdüssəməd',
    style: 'Murattal (Qəlbləri riqqətə gətirən)',
    subfolder: 'Abdul_Basit_Murattal_192kbps',
    editionId: 'ar.abdulbasitmurattal'
  },
  {
    id: 'ghamadi',
    name: 'Səəd əl-Qəmdi',
    style: 'Ruhani & Ahəngdar',
    subfolder: 'Ghamadi_40kbps',
    editionId: 'ar.saadalghamidi'
  }
];

export const HIGHLIGHT_CONFIGS: HighlightColorConfig[] = [
  {
    key: 'gold',
    label: 'Qızılı Sarı',
    meaning: 'Təfəkkür & İlahi Hikmət',
    bgClass: 'bg-amber-100/60 dark:bg-amber-950/40',
    borderClass: 'border-amber-300 dark:border-amber-700',
    underlineClass: 'decoration-amber-500 underline decoration-2 underline-offset-4',
    textClass: 'text-amber-800 dark:text-amber-200',
    dotColor: '#F59E0B'
  },
  {
    key: 'emerald',
    label: 'Zümrüd Yaşıl',
    meaning: 'Dua, Cənnət & Ümid',
    bgClass: 'bg-emerald-100/60 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-300 dark:border-emerald-700',
    underlineClass: 'decoration-emerald-500 underline decoration-2 underline-offset-4',
    textClass: 'text-emerald-800 dark:text-emerald-200',
    dotColor: '#10B981'
  },
  {
    key: 'cyan',
    label: 'Firuzə Mavi',
    meaning: 'İbrət, Əmr & Şəriət',
    bgClass: 'bg-sky-100/60 dark:bg-sky-950/40',
    borderClass: 'border-sky-300 dark:border-sky-700',
    underlineClass: 'decoration-sky-500 underline decoration-2 underline-offset-4',
    textClass: 'text-sky-800 dark:text-sky-200',
    dotColor: '#0EA5E9'
  },
  {
    key: 'purple',
    label: 'Bənövşəyi',
    meaning: 'Məhəbbət & Mərhəmət',
    bgClass: 'bg-purple-100/60 dark:bg-purple-950/40',
    borderClass: 'border-purple-300 dark:border-purple-700',
    underlineClass: 'decoration-purple-500 underline decoration-2 underline-offset-4',
    textClass: 'text-purple-800 dark:text-purple-200',
    dotColor: '#A855F7'
  },
  {
    key: 'coral',
    label: 'Mərcan Qırmızı',
    meaning: 'Xəbərdarlıq & Qiyamət',
    bgClass: 'bg-rose-100/60 dark:bg-rose-950/40',
    borderClass: 'border-rose-300 dark:border-rose-700',
    underlineClass: 'decoration-rose-500 underline decoration-2 underline-offset-4',
    textClass: 'text-rose-800 dark:text-rose-200',
    dotColor: '#F43F5E'
  }
];

export const NOTE_CATEGORIES = [
  { key: 'təfəkkür', label: 'Dərin Təfəkkür', description: 'Ayə üzərində şəxsi düşüncələr və dərk etmə', color: 'amber' },
  { key: 'təfsir', label: 'Təfsir & Məna', description: 'Klassik alimlərin şərhləri və kəlmə izahları', color: 'emerald' },
  { key: 'həyat_dərsi', label: 'Həyat Dərsi', description: 'Gündəlik həyata və qərarlara tətbiq', color: 'sky' },
  { key: 'dua', label: 'Dua & Müraciət', description: 'Ayədə keçən dua və yalvarışlar', color: 'purple' },
  { key: 'əxlaq', label: 'Əxlaq & Xarakter', description: 'Nəfsin tərbiyəsi və davranış qaydaları', color: 'teal' },
  { key: 'xatırlatma', label: 'Günün Xatırlatması', description: 'Yaddan çıxarmamaq üçün qısa xatırlatma', color: 'rose' }
] as const;

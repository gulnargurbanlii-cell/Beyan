export type TranslationKey = 'az_mammadaliyev' | 'az_musayev' | 'tr_diyanet' | 'en_sahih' | 'ru_kuliev';

export interface TranslationOption {
  key: TranslationKey;
  label: string;
  translator: string;
  language: string;
}

export interface Ayah {
  numberInSurah: number;
  globalNumber?: number;
  arabicText: string;
  translations: Record<TranslationKey, string>;
  transliteration?: string;
  audioUrl?: string;
  juz?: number;
  page?: number;
  sajda?: boolean;
}

export interface SurahMeta {
  id: number;
  name: string; // Arabic name
  transliteration: string; // Azerbaijani transliteration
  englishName: string;
  meaningAz: string;
  versesCount: number;
  revelationType: 'Məkkə' | 'Mədinə';
  revelationOrder: number;
  juz: number;
}

export type HighlightColor = 'gold' | 'emerald' | 'cyan' | 'purple' | 'coral';

export interface HighlightColorConfig {
  key: HighlightColor;
  label: string;
  meaning: string;
  bgClass: string;
  borderClass: string;
  underlineClass: string;
  textClass: string;
  dotColor: string;
}

export interface VerseHighlight {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  color: HighlightColor;
  note?: string;
  style: 'underline' | 'background' | 'both';
  createdAt: number;
}

export type NoteCategory = 'təfəkkür' | 'təfsir' | 'həyat_dərsi' | 'dua' | 'əxlaq' | 'xatırlatma';

export interface MarginNote {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahArabic: string;
  ayahTranslation: string;
  content: string;
  category: NoteCategory;
  createdAt: number;
  updatedAt: number;
}

export interface LinkedVerse {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  reflectionPrompt?: string;
  linkedVerses: LinkedVerse[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
  starred?: boolean;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  note?: string;
  createdAt: number;
}

export interface Reciter {
  id: string;
  name: string;
  style: string;
  subfolder: string;
  editionId: string;
}

export interface ReadingSettings {
  fontSizeArabic: number;
  fontSizeTranslation: number;
  primaryTranslation: TranslationKey;
  secondaryTranslation: TranslationKey | 'none';
  showTransliteration: boolean;
  selectedReciterId: string;
  playbackSpeed: number;
  theme: 'light' | 'dark';
}

export interface ReadingProgress {
  lastReadSurah: number;
  lastReadAyah: number;
  lastReadSurahName: string;
  updatedAt: number;
}

export interface QuranSearchResult {
  surahNumber: number;
  surahName: string;
  surahArabicName: string;
  ayahNumber: number;
  arabicText: string;
  translationText: string;
  revelationType: 'Məkkə' | 'Mədinə';
}

export type ActiveTab = 'overview' | 'reader' | 'journal' | 'notes' | 'highlights' | 'topics' | 'search';


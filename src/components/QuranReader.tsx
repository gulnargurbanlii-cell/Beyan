import React, { useState, useEffect } from 'react';
import { Ayah, MarginNote, VerseHighlight, ReadingSettings, HighlightColor, NoteCategory, LinkedVerse } from '../types';
import { SURAH_LIST, TRANSLATION_OPTIONS } from '../data/quranMetadata';
import { RECITERS } from '../data/reciters';
import { fetchSurahData } from '../services/quranApi';
import { AyahItem } from './AyahItem';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Volume2,
  BookOpen,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface QuranReaderProps {
  currentSurahNumber: number;
  initialAyahNumber?: number;
  onSelectSurah: (surahNumber: number) => void;
  settings: ReadingSettings;
  onUpdateSettings: (newSettings: Partial<ReadingSettings>) => void;
  marginNotes: MarginNote[];
  onSaveMarginNote: (
    surahNumber: number,
    surahName: string,
    ayahNumber: number,
    ayahArabic: string,
    ayahTranslation: string,
    content: string,
    category?: NoteCategory
  ) => void;
  onDeleteMarginNote: (id: string) => void;
  highlights: VerseHighlight[];
  onSetHighlight: (surahNumber: number, ayahNumber: number, color: HighlightColor, style: 'underline' | 'background' | 'both') => void;
  onRemoveHighlight: (surahNumber: number, ayahNumber: number) => void;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  onToggleBookmark: (surahNumber: number, surahName: string, ayahNumber: number, arabicText: string, translation: string) => void;
  onOpenAddToJournalModal: (verse: LinkedVerse) => void;
  currentPlayingAyah: { surahNumber: number; ayahNumber: number } | null;
  onPlayAyah: (surahNumber: number, ayahNumber: number) => void;
  onSaveReadingProgress: (surahNumber: number, surahName: string, ayahNumber: number) => void;
  onOpenSearch?: () => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  currentSurahNumber,
  initialAyahNumber,
  onSelectSurah,
  settings,
  onUpdateSettings,
  marginNotes,
  onSaveMarginNote,
  onDeleteMarginNote,
  highlights,
  onSetHighlight,
  onRemoveHighlight,
  isBookmarked,
  onToggleBookmark,
  onOpenAddToJournalModal,
  currentPlayingAyah,
  onPlayAyah,
  onSaveReadingProgress,
  onOpenSearch
}) => {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahSearch, setSurahSearch] = useState('');
  const [showSurahSelector, setShowSurahSelector] = useState(false);
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [showMarginRail, setShowMarginRail] = useState(true);

  const currentSurahMeta = SURAH_LIST.find(s => s.id === currentSurahNumber) || SURAH_LIST[0];

  // Fetch surah ayahs whenever currentSurahNumber changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchSurahData(currentSurahNumber)
      .then(res => {
        if (isMounted) {
          setAyahs(res.ayahs);
          setLoading(false);
          onSaveReadingProgress(currentSurahNumber, currentSurahMeta.transliteration, initialAyahNumber || 1);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error(err);
          setError('Ayələr yüklənərkən xəta baş verdi. Zəhmət olmasa internet əlaqəsini yoxlayın və ya yenidən cəhd edin.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentSurahNumber]);

  // Scroll to initial ayah if specified
  useEffect(() => {
    if (initialAyahNumber && ayahs.length > 0) {
      setTimeout(() => {
        const el = document.getElementById(`ayah-${initialAyahNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [initialAyahNumber, ayahs]);

  const handlePrevSurah = () => {
    if (currentSurahNumber > 1) {
      onSelectSurah(currentSurahNumber - 1);
    }
  };

  const handleNextSurah = () => {
    if (currentSurahNumber < 114) {
      onSelectSurah(currentSurahNumber + 1);
    }
  };

  const filteredSurahs = SURAH_LIST.filter(s =>
    s.transliteration.toLowerCase().includes(surahSearch.toLowerCase()) ||
    s.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
    s.id.toString() === surahSearch ||
    s.meaningAz.toLowerCase().includes(surahSearch.toLowerCase())
  );

  const surahNotes = marginNotes.filter(n => n.surahNumber === currentSurahNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Surah Navigation and Utility Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        {/* Surah Selector Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowSurahSelector(!showSurahSelector)}
            className="flex items-center gap-2.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 rounded-lg text-sm font-semibold transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>
              {currentSurahMeta.id}. {currentSurahMeta.transliteration}
            </span>
            <span className="font-quran text-base text-amber-700 dark:text-amber-400">
              ({currentSurahMeta.name})
            </span>
          </button>

          {/* Surah dropdown selector modal */}
          {showSurahSelector && (
            <div className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-96 max-h-[480px] flex flex-col bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
              <div className="p-3 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={surahSearch}
                  onChange={(e) => setSurahSearch(e.target.value)}
                  placeholder="Surə adı və ya nömrəsi axtar (məs: Yasin, 36)..."
                  autoFocus
                  className="w-full text-xs bg-transparent focus:outline-none text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredSurahs.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSurah(s.id);
                      setShowSurahSelector(false);
                      setSurahSearch('');
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                      s.id === currentSurahNumber
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-semibold'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-center font-mono text-stone-400 tabular-nums">{s.id}</span>
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">{s.transliteration}</div>
                        <div className="text-[11px] text-stone-500">{s.meaningAz} · {s.versesCount} ayə</div>
                      </div>
                    </div>
                    <span className="font-quran text-base text-stone-800 dark:text-stone-200">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prev / Next Surah */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={handlePrevSurah}
            disabled={currentSurahNumber <= 1}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Əvvəlki surə"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-stone-500">
            {currentSurahNumber} / 114
          </span>
          <button
            onClick={handleNextSurah}
            disabled={currentSurahNumber >= 114}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Növbəti surə"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Translation & Reading Controls */}
        <div className="flex items-center gap-2">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Quranda kəlmə və ya ayə axtar"
            >
              <Search className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden sm:inline">Kəlmə Axtar</span>
            </button>
          )}

          {/* Display Settings Toggle */}
          <button
            onClick={() => setShowDisplaySettings(!showDisplaySettings)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showDisplaySettings
                ? 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700'
                : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mənalar & Şrift</span>
          </button>

          {/* Margin Rail Toggle */}
          <button
            onClick={() => setShowMarginRail(!showMarginRail)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hidden md:flex items-center gap-1.5 ${
              showMarginRail
                ? 'bg-amber-100/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
            title="Surə yanındakı qeydlər sütununu göstər/gizlət"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Yan Qeydlər ({surahNotes.length})</span>
          </button>
        </div>
      </div>

      {/* Display Settings Expandable Panel */}
      {showDisplaySettings && (
        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 pb-2 border-b border-stone-100 dark:border-stone-800">
            Quran Oxu Rejimi və Tərcümələr
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Primary Translation */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-800 dark:text-stone-200">
                Əsas Tərcümə
              </label>
              <select
                value={settings.primaryTranslation}
                onChange={(e) => onUpdateSettings({ primaryTranslation: e.target.value as any })}
                className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
              >
                {TRANSLATION_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Secondary Parallel Translation */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-800 dark:text-stone-200">
                Müqayisəli 2-ci Tərcümə
              </label>
              <select
                value={settings.secondaryTranslation}
                onChange={(e) => onUpdateSettings({ secondaryTranslation: e.target.value as any })}
                className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
              >
                <option value="none">Yoxdur (Tək tərcümə)</option>
                {TRANSLATION_OPTIONS.filter(opt => opt.key !== settings.primaryTranslation).map(opt => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reciter Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-800 dark:text-stone-200">
                Qiraətçi (Səsli Tilavət)
              </label>
              <select
                value={settings.selectedReciterId}
                onChange={(e) => onUpdateSettings({ selectedReciterId: e.target.value })}
                className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
              >
                {RECITERS.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.style})
                  </option>
                ))}
              </select>
            </div>

            {/* Arabic Font Size & Transliteration */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-800 dark:text-stone-200">
                Ərəbcə Şrift Ölçüsü: {settings.fontSizeArabic}px
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="22"
                  max="38"
                  value={settings.fontSizeArabic}
                  onChange={(e) => onUpdateSettings({ fontSizeArabic: Number(e.target.value) })}
                  className="w-full accent-emerald-700"
                />
              </div>
              <div className="pt-1 flex items-center justify-between">
                <label className="text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showTransliteration}
                    onChange={(e) => onUpdateSettings({ showTransliteration: e.target.checked })}
                    className="rounded accent-emerald-700"
                  />
                  <span>Oxunuşu göstər</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Surah Calligraphic Header */}
      <section className="relative text-center py-10 px-6 rounded-2xl bg-gradient-to-b from-[#F7F4EE] to-[#EFEAE0] dark:from-stone-900 dark:to-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden shadow-xs space-y-4">
        {/* Subtle geometric pattern ring */}
        <div className="w-16 h-16 mx-auto rounded-full border border-amber-500/40 dark:border-amber-400/40 flex items-center justify-center font-quran text-2xl text-amber-800 dark:text-amber-300">
          ۞
        </div>

        <div className="space-y-1">
          <h1 className="font-quran text-4xl sm:text-5xl text-stone-900 dark:text-stone-100 tracking-wider">
            سُورَةُ {currentSurahMeta.name}
          </h1>
          <p className="font-serif-sacred text-2xl font-bold text-stone-800 dark:text-stone-100">
            {currentSurahMeta.transliteration} Surəsi
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-stone-700 dark:text-stone-200 font-medium">
          <span>{currentSurahMeta.revelationType} dövrü</span>
          <span aria-hidden="true">·</span>
          <span>{currentSurahMeta.versesCount} ayə</span>
          <span aria-hidden="true">·</span>
          <span>Məna: {currentSurahMeta.meaningAz}</span>
          <span aria-hidden="true">·</span>
          <span>{currentSurahMeta.juz}-ci Cüz</span>
        </div>

        {/* Bismillah (all surahs except At-Tawbah 9) */}
        {currentSurahNumber !== 9 && (
          <div className="pt-4 border-t border-stone-200/70 dark:border-stone-700/80 max-w-md mx-auto">
            <p className="font-quran text-2xl sm:text-3xl text-stone-800 dark:text-stone-100">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-300 italic mt-1">
              Mərhəmətli və Rəhmli Allahın adı ilə!
            </p>
          </div>
        )}
      </section>

      {/* Main Reading View with Asymmetric Margin Notes Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Quran Verses Column (7 to 8 cols if margin rail open, else 12 cols) */}
        <div className={`${showMarginRail ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
          {loading ? (
            <div className="p-16 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {currentSurahMeta.transliteration} surəsi yüklənir...
              </p>
              <p className="text-xs text-stone-500">Müqəddəs mətn və tərcümələr hazırlanır</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900 space-y-3">
              <p className="text-sm text-rose-800 dark:text-rose-200 font-medium">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchSurahData(currentSurahNumber).then(res => {
                    setAyahs(res.ayahs);
                    setLoading(false);
                  }).catch(e => {
                    setError('Yenidən xəta baş verdi.');
                    setLoading(false);
                  });
                }}
                className="px-4 py-2 bg-rose-700 text-white text-xs font-semibold rounded-lg hover:bg-rose-800 transition-colors flex items-center gap-1.5 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yenidən Cəhd Et</span>
              </button>
            </div>
          ) : (
            ayahs.map(ayah => {
              const note = marginNotes.find(
                n => n.surahNumber === currentSurahNumber && n.ayahNumber === ayah.numberInSurah
              );
              const highlight = highlights.find(
                h => h.surahNumber === currentSurahNumber && h.ayahNumber === ayah.numberInSurah
              );
              const bookmarked = isBookmarked(currentSurahNumber, ayah.numberInSurah);
              const isPlaying =
                currentPlayingAyah?.surahNumber === currentSurahNumber &&
                currentPlayingAyah?.ayahNumber === ayah.numberInSurah;

              return (
                <AyahItem
                  key={ayah.numberInSurah}
                  ayah={ayah}
                  surahNumber={currentSurahNumber}
                  surahName={currentSurahMeta.transliteration}
                  settings={settings}
                  note={note}
                  highlight={highlight}
                  isBookmarked={bookmarked}
                  isPlaying={isPlaying}
                  onPlayAudio={() => onPlayAyah(currentSurahNumber, ayah.numberInSurah)}
                  onSaveNote={(content, category) =>
                    onSaveMarginNote(
                      currentSurahNumber,
                      currentSurahMeta.transliteration,
                      ayah.numberInSurah,
                      ayah.arabicText,
                      ayah.translations[settings.primaryTranslation],
                      content,
                      category
                    )
                  }
                  onDeleteNote={onDeleteMarginNote}
                  onSetHighlight={(color, style) =>
                    onSetHighlight(currentSurahNumber, ayah.numberInSurah, color, style)
                  }
                  onRemoveHighlight={() =>
                    onRemoveHighlight(currentSurahNumber, ayah.numberInSurah)
                  }
                  onToggleBookmark={() =>
                    onToggleBookmark(
                      currentSurahNumber,
                      currentSurahMeta.transliteration,
                      ayah.numberInSurah,
                      ayah.arabicText,
                      ayah.translations[settings.primaryTranslation]
                    )
                  }
                  onAddToJournal={() =>
                    onOpenAddToJournalModal({
                      surahNumber: currentSurahNumber,
                      surahName: currentSurahMeta.transliteration,
                      ayahNumber: ayah.numberInSurah,
                      arabicText: ayah.arabicText,
                      translation: ayah.translations[settings.primaryTranslation]
                    })
                  }
                />
              );
            })
          )}

          {/* Surah Footer Navigation */}
          {!loading && !error && (
            <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={handlePrevSurah}
                disabled={currentSurahNumber <= 1}
                className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs font-semibold hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Əvvəlki Surə</span>
              </button>

              <div className="text-center text-xs text-stone-500 font-mono">
                {currentSurahMeta.transliteration} tamamlandı
              </div>

              <button
                onClick={handleNextSurah}
                disabled={currentSurahNumber >= 114}
                className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs font-semibold hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-2"
              >
                <span>Növbəti Surə</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side Margin Notes Rail (Sticky Asymmetric Sidebar) */}
        {showMarginRail && (
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 max-h-[calc(100vh-130px)] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 shrink-0">
                <div>
                  <h3 className="font-serif-sacred font-bold text-lg text-stone-900 dark:text-stone-100">
                    Bu Surənin Kənar Qeydləri
                  </h3>
                  <p className="text-xs text-stone-500">
                    {surahNotes.length} qeyd mövcuddur
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {surahNotes.length === 0 ? (
                  <div className="p-6 text-center text-stone-400 space-y-2">
                    <Info className="w-5 h-5 mx-auto text-stone-300" />
                    <p className="text-xs">
                      Bu surə üçün hələ kənar qeyd yazmamısınız.
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Ayələrin üzərindəki "Qeyd Yaz" düyməsinə toxunaraq dərhal kənar qeyd əlavə edə bilərsiniz.
                    </p>
                  </div>
                ) : (
                  surahNotes.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        const el = document.getElementById(`ayah-${n.ayahNumber}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="p-3 bg-amber-50/50 dark:bg-stone-800/50 hover:bg-amber-100/60 dark:hover:bg-stone-800 rounded-xl border border-amber-200/60 dark:border-stone-700 cursor-pointer transition-all space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-stone-500">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                          {n.ayahNumber}-ci ayə
                        </span>
                        <span className="font-mono text-[10px]">
                          {new Date(n.updatedAt).toLocaleDateString('az-AZ')}
                        </span>
                      </div>
                      <p className="font-quran text-sm text-stone-800 dark:text-stone-200 line-clamp-1 text-right">
                        {n.ayahArabic}
                      </p>
                      <p className="text-stone-700 dark:text-stone-300 line-clamp-3 leading-relaxed">
                        {n.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

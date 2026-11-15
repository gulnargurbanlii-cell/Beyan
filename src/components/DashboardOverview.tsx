import React, { useState } from 'react';
import { MarginNote, JournalEntry, VerseHighlight, Bookmark, ActiveTab } from '../types';
import { BookOpen, BookMarked, PenTool, ArrowRight, Play, Download, Clock, Search, Mail, ShieldCheck } from 'lucide-react';
import { NOTE_CATEGORIES } from '../data/reciters';
import { useAuth } from '../contexts/AuthContext';

interface DashboardOverviewProps {
  marginNotes: MarginNote[];
  journalEntries: JournalEntry[];
  highlights: VerseHighlight[];
  bookmarks: Bookmark[];
  lastRead: { surahNumber: number; surahName: string; ayahNumber: number };
  onNavigateToSurah: (surahNumber: number, ayahNumber?: number) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewJournal: () => void;
  onPlayAyahAudio: (surahNumber: number, ayahNumber: number) => void;
  onExportData: () => void;
  onQuickSearch: (query: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  marginNotes,
  journalEntries,
  lastRead,
  onNavigateToSurah,
  onNavigateTab,
  onOpenNewJournal,
  onPlayAyahAudio,
  onExportData,
  onQuickSearch
}) => {
  const { user, authReady, signingIn, loginWithGmail } = useAuth();
  const [quickQuery, setQuickQuery] = useState('');
  // Daily inspirational verse (Surah Ash-Sharh 94:5-6)
  const dailyVerse = {
    surahNumber: 94,
    surahName: 'əl-İnşirah',
    ayahNumber: 5,
    arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Şübhəsiz ki, hər çətinliklə yanaşı bir asanlıq vardır!',
    transliteration: 'Fəinnə mə\'al-\'usri yusrə'
  };

  const recentNotes = marginNotes.slice(0, 4);
  const recentJournal = journalEntries.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Welcome & Spiritual Presence */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-stone-100 p-6 sm:p-8 lg:p-10 shadow-lg border border-emerald-800/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="font-quran text-2xl sm:text-3xl text-amber-200/90 tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <h1 className="font-serif-sacred text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            NUN — Quran & Qeyd Dəftəri
          </h1>

          {authReady && user && (
            <p className="text-amber-200/95 text-xs sm:text-sm font-medium">
              Xoş gəldiniz, {user.displayName || user.email}
            </p>
          )}

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Ayələri oxuyun, dərhal kənarına öz qeydlərinizi yazın, hikmətli kəlmələrin altından xətt çəkin və şəxsi qeyd dəftərinizdə ruhani düşüncələrinizi saxlayın.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToSurah(lastRead.surahNumber, lastRead.ayahNumber)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Qaldığınız yerdən davam et ({lastRead.surahName}, {lastRead.ayahNumber})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNewJournal}
              className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-medium text-sm rounded-lg border border-emerald-600/50 transition-colors flex items-center gap-2"
            >
              <BookMarked className="w-4 h-4 text-amber-300" />
              <span>Dəftərə Yeni Qeyd Yaz</span>
            </button>
          </div>
        </div>

        {/* Quiet decorative calligraphic watermark */}
        <div className="absolute -right-6 -bottom-8 select-none pointer-events-none opacity-10 text-stone-100 font-quran text-9xl">
          ن
        </div>
      </section>

      {/* Gmail Account Creation / Cloud Sync Prompt for Guest Users */}
      {authReady && !user && (
        <section className="p-5 sm:p-6 bg-white dark:bg-stone-900 rounded-xl border border-emerald-200/80 dark:border-stone-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Şəxsi Hesab & Yaddaş</span>
            </div>
            <h2 className="font-serif-sacred text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              Gmail hesabınızla öz şəxsi hesabınızı yaradın
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Yazdığınız ayə kənarı qeydlərini, təfəkkür dəftərini, altından xətt çəkdiyiniz ayələri və qaldığınız oxu yerini itirməmək üçün Gmail ilə daxil olun. İstənilən cihazdan hesabınıza daxil olub davam edə bilərsiniz.
            </p>
          </div>

          <button
            onClick={loginWithGmail}
            disabled={signingIn}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
          >
            <Mail className="w-4 h-4 text-amber-200" />
            <span>{signingIn ? 'Giriş edilir...' : 'Gmail ilə Hesab Yarat / Daxil Ol'}</span>
          </button>
        </section>
      )}

      {/* Quick Quran Word, Phrase & Surah Search Bar */}
      <section>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (quickQuery.trim()) {
              onQuickSearch(quickQuery.trim());
            } else {
              onNavigateTab('search');
            }
          }}
          className="p-2 sm:p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs flex items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-2.5 px-3">
            <Search className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Quranda söz, ifadə (məs: ibadət edin), surə adı və ya ayə nömrəsi (2:255) axtar..."
              className="w-full bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none py-1.5"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            Axtar
          </button>
        </form>
      </section>

      {/* Featured Verse for Contemplation */}
      <section className="bg-amber-50/60 dark:bg-stone-900/90 rounded-xl p-6 sm:p-8 border border-amber-200/80 dark:border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-amber-800 dark:text-amber-400">
            <span>Günün Təfəkkür Ayəsi</span>
            <span aria-hidden="true">·</span>
            <span>{dailyVerse.surahName}, {dailyVerse.ayahNumber}-ci ayə</span>
          </div>

          <button
            onClick={() => onPlayAyahAudio(dailyVerse.surahNumber, dailyVerse.ayahNumber)}
            className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-400 hover:underline font-medium"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Səsli Dinlə</span>
          </button>
        </div>

        <div className="text-right py-2">
          <p className="font-quran text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 leading-loose">
            {dailyVerse.arabicText}
          </p>
        </div>

        <div className="border-t border-amber-200/50 dark:border-stone-800 pt-3 space-y-1">
          <p className="text-xs text-stone-500 italic font-mono">{dailyVerse.transliteration}</p>
          <p className="text-stone-800 dark:text-stone-200 text-base font-serif-sacred font-medium">
            "{dailyVerse.translation}"
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => onNavigateToSurah(dailyVerse.surahNumber, dailyVerse.ayahNumber)}
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Surəni bütöv aç və yanına qeyd yaz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs text-stone-500">
            İnşirah (Köksün açılması)
          </span>
        </div>
      </section>

      {/* Main 2-Column Split: Son Qeydlərim (Left) + Təfəkkür Dəftəri & Xətlər (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): HƏR DƏFƏ PROQRAMI AÇANDA QEYDLƏRİ GÖRMƏK */}
        <section className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="font-serif-sacred text-2xl font-bold text-stone-900 dark:text-stone-100">
                Son Qeydlərim
              </h2>
              <p className="text-xs text-stone-500">
                Ayələrin yanında yazdığınız ən son təfəkkür və şərhlər
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('notes')}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Bütün qeydlərə bax ({marginNotes.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentNotes.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
              <PenTool className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">Hələ heç bir qeyd yazılmayıb</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Quran oxuyarkən istənilən ayənin sağındakı "Qırağa qeyd yaz" düyməsinə toxunaraq dərhal düşüncələrinizi qeyd edin.
              </p>
              <button
                onClick={() => onNavigateToSurah(1, 1)}
                className="mt-2 px-4 py-2 bg-emerald-800 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                əl-Fatihə surəsini oxumağa başla
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {recentNotes.map(note => {
                const categoryConfig = NOTE_CATEGORIES.find(c => c.key === note.category) || NOTE_CATEGORIES[0];
                return (
                  <div
                    key={note.id}
                    onClick={() => onNavigateToSurah(note.surahNumber, note.ayahNumber)}
                    className="group p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-emerald-600/60 dark:hover:border-emerald-500/60 transition-all cursor-pointer shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 dark:text-stone-100">
                          {note.surahName}, {note.ayahNumber}-ci ayə
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          {categoryConfig.label}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3" />
                        {new Date(note.updatedAt).toLocaleDateString('az-AZ')}
                      </span>
                    </div>

                    {/* Arabic quote */}
                    <div className="text-right">
                      <p className="font-quran text-lg text-stone-800 dark:text-stone-200 line-clamp-1">
                        {note.ayahArabic}
                      </p>
                    </div>

                    {/* User's Margin Note content */}
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans bg-amber-50/50 dark:bg-stone-800/40 p-2.5 rounded-lg border-l-2 border-amber-400 dark:border-amber-600">
                      {note.content}
                    </p>

                    <div className="flex items-center justify-end text-xs text-emerald-800 dark:text-emerald-400 group-hover:underline gap-1">
                      <span>Ayəyə get</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Column (5 cols): Təfəkkür Dəftəri & Xüsusiyyətlər */}
        <section className="lg:col-span-5 space-y-6">
          {/* Təfəkkür Dəftəri Quick Snippet */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h2 className="font-serif-sacred text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Təfəkkür Dəftəri
                </h2>
                <p className="text-xs text-stone-500">
                  Ayələrlə zənginləşdirilmiş dərin düşüncələr
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('journal')}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Dəftəri aç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentJournal.length === 0 ? (
              <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-center space-y-2">
                <BookMarked className="w-6 h-6 text-stone-400 mx-auto" />
                <p className="text-xs text-stone-500">Dəftərdə hələ yazı yoxdur.</p>
                <button
                  onClick={onOpenNewJournal}
                  className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-medium rounded-md hover:bg-emerald-700"
                >
                  İlk təfəkkür qeydini yaz
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJournal.map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => onNavigateTab('journal')}
                    className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/60 transition-all cursor-pointer shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-medium text-amber-800 dark:text-amber-400">{entry.category}</span>
                      <span className="font-mono text-[11px]">{new Date(entry.createdAt).toLocaleDateString('az-AZ')}</span>
                    </div>

                    <h3 className="font-serif-sacred font-bold text-base text-stone-900 dark:text-stone-100 leading-snug">
                      {entry.title}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                      {entry.content}
                    </p>

                    {entry.linkedVerses.length > 0 && (
                      <div className="text-xs text-stone-500 flex items-center gap-1.5 pt-1">
                        <BookOpen className="w-3 h-3 text-emerald-700" />
                        <span>Bağlı ayələr: {entry.linkedVerses.map(v => `${v.surahName} (${v.ayahNumber})`).join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>



          {/* Export / Backup Card */}
          <div className="p-4 bg-stone-100/70 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">Məlumatlarınızı Qoruyun</span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {user
                  ? `Qeydləriniz ${user.email} hesabınızda saxlanılır. İstəsəniz JSON kimi də yükləyə bilərsiniz.`
                  : 'Bütün qeydlərinizi və dəftərinizi kompüterinizə JSON olaraq yükləyin.'}
              </p>
            </div>
            <button
              onClick={onExportData}
              className="px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Yüklə</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { LinkedVerse, QuranSearchResult } from '../types';
import { TRANSLATION_OPTIONS } from '../data/quranMetadata';
import { searchQuranCatalog, SearchEdition, QuranSearchResponse } from '../services/quranApi';
import {
  Search,
  BookOpen,
  ArrowRight,
  Play,
  BookMarked,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface SearchHubProps {
  initialQuery?: string;
  defaultEdition: SearchEdition;
  onNavigateToSurah: (surahNumber: number, ayahNumber?: number) => void;
  onPlayAyahAudio: (surahNumber: number, ayahNumber: number) => void;
  onOpenAddToJournalModal: (verse: LinkedVerse) => void;
}

const EXAMPLE_SEARCHES = [
  'ibadət edin',
  'hər çətinliklə yanaşı',
  'səbr',
  'bağışlayan',
  'şükür',
  '2:255'
];

// Highlights matched query substrings inside verse text cleanly
function HighlightedMatchText({ text, query }: { text: string; query: string }) {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) {
    return <>{text}</>;
  }

  // Build regex escaping special characters
  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLocaleLowerCase('az-AZ') === cleanQuery.toLocaleLowerCase('az-AZ') ? (
          <mark
            key={i}
            className="bg-amber-200/80 dark:bg-amber-500/30 text-stone-950 dark:text-amber-200 px-1 rounded-xs font-semibold"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export const SearchHub: React.FC<SearchHubProps> = ({
  initialQuery = '',
  defaultEdition,
  onNavigateToSurah,
  onPlayAyahAudio,
  onOpenAddToJournalModal
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [edition, setEdition] = useState<SearchEdition>(defaultEdition);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<QuranSearchResponse | null>(null);

  const runSearch = useCallback(async (searchText: string, targetEdition: SearchEdition) => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      setResponse(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await searchQuranCatalog(trimmed, targetEdition, 150);
      setResponse(res);
    } catch (err) {
      console.error('Search error:', err);
      setError('Axtarış zamanı xəta baş verdi. Zəhmət olmasa internet bağlantınızı yoxlayın.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Run initial query if passed from another screen
  useEffect(() => {
    if (initialQuery.trim()) {
      setQuery(initialQuery);
      runSearch(initialQuery, edition);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query, edition);
  };

  const handleEditionChange = (newEdition: SearchEdition) => {
    setEdition(newEdition);
    if (query.trim()) {
      runSearch(query, newEdition);
    }
  };

  const handleQuickExample = (example: string) => {
    setQuery(example);
    runSearch(example, edition);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800 space-y-1">
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
          <h1 className="font-serif-sacred text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Quranda Kəlmə & Ayə Axtarışı
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
          Yadınızda qalan istənilən sözü, cümləni (məsələn, "ibadət edin"), surə adını və ya ayə nömrəsini (məsələn, "2:255") yazaraq bütün 114 surə içindən tapın.
        </p>
      </div>

      {/* Search Bar & Edition Selector */}
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus-within:ring-2 focus-within:ring-emerald-700/40 focus-within:border-emerald-700 transition-all">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Söz, ifadə, surə adı və ya ayə nömrəsi yazın (məs: ibadət edin)..."
              autoFocus
              className="w-full bg-transparent text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResponse(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                title="Təmizlə"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={edition}
            onChange={(e) => handleEditionChange(e.target.value as SearchEdition)}
            className="sm:w-64 px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-100 focus:outline-none"
            aria-label="Axtarış dili"
          >
            {TRANSLATION_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
            <option value="ar_uthmani">Ərəbcə (Quran mətni)</option>
          </select>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Axtar</span>
          </button>
        </div>

        {/* Example quick search terms */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 dark:text-stone-400">Nümunə axtarışlar:</span>
          {EXAMPLE_SEARCHES.map(ex => (
            <button
              key={ex}
              type="button"
              onClick={() => handleQuickExample(ex)}
              className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-amber-100/70 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-700 dark:text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
            Bütün 114 surə üzrə axtarılır...
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            İlk axtarış zamanı bütün Quran indekslənir, növbəti axtarışlar anında açılacaq.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900 flex items-center gap-3 text-sm text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Results */}
      {!loading && response && (
        <div className="space-y-6">
          {/* Direct Reference Jump (e.g. 2:255 or Nisa 36) */}
          {response.directRef && (
            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Birbaşa Ayə Keçidi
                </span>
                <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Surə {response.directRef.surahNumber}, {response.directRef.ayahNumber}-ci ayə
                </p>
              </div>
              <button
                onClick={() => onNavigateToSurah(response.directRef!.surahNumber, response.directRef!.ayahNumber)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Həmin ayəni aç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Matching Surahs by Name / Number */}
          {response.matchedSurahs.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Uyğun Surələr ({response.matchedSurahs.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {response.matchedSurahs.slice(0, 9).map(surah => (
                  <button
                    key={surah.id}
                    onClick={() => onNavigateToSurah(surah.id)}
                    className="p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-600 dark:hover:border-emerald-500 rounded-xl text-left transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-mono text-xs font-bold text-stone-700 dark:text-stone-300 shrink-0 tabular-nums">
                        {surah.id}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {surah.transliteration}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-400 truncate">
                          {surah.meaningAz} · {surah.versesCount} ayə
                        </div>
                      </div>
                    </div>
                    <span className="font-quran text-lg text-amber-800 dark:text-amber-300 shrink-0">
                      {surah.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Ayahs List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pb-2 border-b border-stone-200 dark:border-stone-800">
              <span>
                <strong className="text-stone-900 dark:text-stone-100 tabular-nums">{response.totalMatches}</strong> ayədə uyğunluq tapıldı
                {response.totalMatches > response.results.length && (
                  <span> (ilk {response.results.length} nəticə göstərilir)</span>
                )}
              </span>
              {response.source === 'offline_fallback' && (
                <span className="text-amber-700 dark:text-amber-400">
                  Oflayn ehtiyat axtarışı
                </span>
              )}
            </div>

            {response.results.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                <Search className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto" />
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  "{query}" ifadəsi üzrə ayə tapılmadı
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                  Başqa bir tərcüməni seçib yoxlayın (məsələn, Əlixan Musayev və ya Məmmədəliyev) və ya daha qısa kök söz yazın.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                {response.results.map((item: QuranSearchResult) => (
                  <article
                    key={`${item.surahNumber}-${item.ayahNumber}`}
                    className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-emerald-600/60 dark:hover:border-emerald-500/60 transition-all space-y-3"
                  >
                    {/* Header: Surah & Ayah Number + Quick Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">
                          {item.surahNumber}. {item.surahName} surəsi
                        </span>
                        <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 tabular-nums">
                          {item.ayahNumber}-ci ayə
                        </span>
                        <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                        <span className="text-stone-500 dark:text-stone-400">
                          {item.revelationType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onPlayAyahAudio(item.surahNumber, item.ayahNumber)}
                          className="px-2.5 py-1 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-lg transition-colors flex items-center gap-1"
                          title="Bu ayəni dinlə"
                        >
                          <Play className="w-3 h-3" />
                          <span>Dinlə</span>
                        </button>

                        <button
                          onClick={() =>
                            onOpenAddToJournalModal({
                              surahNumber: item.surahNumber,
                              surahName: item.surahName,
                              ayahNumber: item.ayahNumber,
                              arabicText: item.arabicText,
                              translation: item.translationText
                            })
                          }
                          className="px-2.5 py-1 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-lg transition-colors flex items-center gap-1"
                          title="Qeyd dəftərinə əlavə et"
                        >
                          <BookMarked className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                          <span>Dəftərə at</span>
                        </button>

                        <button
                          onClick={() => onNavigateToSurah(item.surahNumber, item.ayahNumber)}
                          className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Ayəyə get</span>
                        </button>
                      </div>
                    </div>

                    {/* Arabic text */}
                    {item.arabicText && (
                      <p dir="rtl" lang="ar" className="font-quran text-xl sm:text-2xl text-stone-900 dark:text-stone-100 text-right leading-loose">
                        {edition === 'ar_uthmani' ? (
                          <HighlightedMatchText text={item.arabicText} query={query} />
                        ) : (
                          item.arabicText
                        )}
                      </p>
                    )}

                    {/* Translation text with highlighted query */}
                    {item.translationText && (
                      <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 font-serif-sacred leading-relaxed">
                        {edition === 'ar_uthmani' ? (
                          item.translationText
                        ) : (
                          <HighlightedMatchText text={item.translationText} query={query} />
                        )}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

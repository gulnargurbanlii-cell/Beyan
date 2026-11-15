import React, { useState } from 'react';
import { VerseHighlight, HighlightColor } from '../types';
import { HIGHLIGHT_CONFIGS } from '../data/reciters';
import { SURAH_LIST } from '../data/quranMetadata';
import { Highlighter, ArrowRight, Trash2 } from 'lucide-react';

interface HighlightsHubProps {
  highlights: VerseHighlight[];
  onRemoveHighlight: (surahNumber: number, ayahNumber: number) => void;
  onNavigateToAyah: (surahNumber: number, ayahNumber: number) => void;
}

export const HighlightsHub: React.FC<HighlightsHubProps> = ({
  highlights,
  onRemoveHighlight,
  onNavigateToAyah
}) => {
  const [selectedColor, setSelectedColor] = useState<HighlightColor | 'all'>('all');

  const filteredHighlights = highlights.filter(h =>
    selectedColor === 'all' ? true : h.color === selectedColor
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Highlighter className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h1 className="font-serif-sacred text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Xətt Çəkilmiş Ayələr
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Oxuyarkən altından rəngli xətt çəkdiyiniz və ya rənglədiyiniz xüsusi Quran ayələri
          </p>
        </div>

        <div className="text-xs text-stone-500 font-mono">
          Cəmi {highlights.length} ayə
        </div>
      </div>

      {/* Color Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedColor('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
            selectedColor === 'all'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
          }`}
        >
          Hamısı ({highlights.length})
        </button>

        {HIGHLIGHT_CONFIGS.map(cfg => {
          const count = highlights.filter(h => h.color === cfg.key).length;
          return (
            <button
              key={cfg.key}
              onClick={() => setSelectedColor(cfg.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                selectedColor === cfg.key
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
              <span>{cfg.label}</span>
              <span className="text-stone-400 tabular-nums">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Highlighted Verses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHighlights.length === 0 ? (
          <div className="col-span-full p-16 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-400 space-y-2">
            <Highlighter className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
              Heç bir xətt çəkilmiş ayə tapılmadı
            </p>
            <p className="text-xs text-stone-500">
              Quran oxuyarkən istənilən ayənin sağındakı xətt çəkmə alətindən istifadə edin.
            </p>
          </div>
        ) : (
          filteredHighlights.map(hl => {
            const surah = SURAH_LIST.find(s => s.id === hl.surahNumber);
            const cfg = HIGHLIGHT_CONFIGS.find(c => c.key === hl.color) || HIGHLIGHT_CONFIGS[0];

            return (
              <div
                key={hl.id}
                className={`p-5 rounded-2xl border transition-all shadow-2xs space-y-3 ${cfg.bgClass} ${cfg.borderClass}`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {surah?.transliteration || `Surə ${hl.surahNumber}`}, {hl.ayahNumber}-ci ayə
                    </span>
                    <span className="text-stone-500">· {cfg.meaning}</span>
                  </div>

                  <button
                    onClick={() => onRemoveHighlight(hl.surahNumber, hl.ayahNumber)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Xətti sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300">
                  <span className="font-mono text-[11px] text-stone-400">
                    Qeyd tarixi: {new Date(hl.createdAt).toLocaleDateString('az-AZ')}
                  </span>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => onNavigateToAyah(hl.surahNumber, hl.ayahNumber)}
                    className="text-xs font-semibold text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1 group"
                  >
                    <span>Surədə oxu</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

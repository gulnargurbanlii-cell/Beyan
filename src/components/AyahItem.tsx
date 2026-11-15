import React, { useState } from 'react';
import { Ayah, MarginNote, VerseHighlight, ReadingSettings, HighlightColor, NoteCategory } from '../types';
import { Play, PenTool, BookMarked, Highlighter, Bookmark, Check, Copy, Trash2, X, ChevronDown } from 'lucide-react';
import { HIGHLIGHT_CONFIGS, NOTE_CATEGORIES } from '../data/reciters';

interface AyahItemProps {
  ayah: Ayah;
  surahNumber: number;
  surahName: string;
  settings: ReadingSettings;
  note?: MarginNote;
  highlight?: VerseHighlight;
  isBookmarked: boolean;
  isPlaying: boolean;
  onPlayAudio: () => void;
  onSaveNote: (content: string, category: NoteCategory) => void;
  onDeleteNote: (id: string) => void;
  onSetHighlight: (color: HighlightColor, style: 'underline' | 'background' | 'both') => void;
  onRemoveHighlight: () => void;
  onToggleBookmark: () => void;
  onAddToJournal: () => void;
}

export const AyahItem: React.FC<AyahItemProps> = ({
  ayah,
  surahNumber,
  surahName,
  settings,
  note,
  highlight,
  isBookmarked,
  isPlaying,
  onPlayAudio,
  onSaveNote,
  onDeleteNote,
  onSetHighlight,
  onRemoveHighlight,
  onToggleBookmark,
  onAddToJournal
}) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteContent, setNoteContent] = useState(note?.content || '');
  const [noteCategory, setNoteCategory] = useState<NoteCategory>(note?.category || 'təfəkkür');
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state if external note changes
  React.useEffect(() => {
    if (note) {
      setNoteContent(note.content);
      setNoteCategory(note.category);
    }
  }, [note]);

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    onSaveNote(noteContent.trim(), noteCategory);
    setIsEditingNote(false);
  };

  const primaryTransText = ayah.translations[settings.primaryTranslation] || '';
  const secondaryKey = settings.secondaryTranslation !== 'none' ? settings.secondaryTranslation : null;
  const secondaryTransText = secondaryKey ? ayah.translations[secondaryKey] : null;

  const handleCopyAyah = () => {
    const textToCopy = `${ayah.arabicText}\n\n"${primaryTransText}"\n(Quran, ${surahName} [${surahNumber}:${ayah.numberInSurah}])`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find highlight style
  const highlightConfig = highlight ? HIGHLIGHT_CONFIGS.find(c => c.key === highlight.color) : null;
  const isHighlighted = Boolean(highlight && highlightConfig);

  // Note category styling
  const noteCategoryConfig = note ? NOTE_CATEGORIES.find(c => c.key === note.category) : null;

  return (
    <article
      id={`ayah-${ayah.numberInSurah}`}
      className={`group relative p-5 sm:p-6 rounded-2xl transition-all duration-200 border ${
        isPlaying
          ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 shadow-md ring-1 ring-amber-400/50'
          : isHighlighted && highlight?.style !== 'underline'
          ? `${highlightConfig?.bgClass} ${highlightConfig?.borderClass}`
          : 'bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
      }`}
    >
      {/* Top Ayah Header: Ayah Number + Action Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-stone-100 dark:border-stone-800/80">
        {/* Ayah Medallion */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-xs font-mono font-bold text-stone-700 dark:text-stone-300 tabular-nums">
            {ayah.numberInSurah}
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline">
            {surahName} {surahNumber}:{ayah.numberInSurah}
          </span>
          {note && (
            <span className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
              <PenTool className="w-3 h-3" />
              <span>Qeyd var</span>
            </span>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
          {/* Audio Play */}
          <button
            onClick={onPlayAudio}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
              isPlaying
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
            title="Bu ayəni səsli dinlə"
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-stone-950' : ''}`} />
            <span className="hidden sm:inline">Dinlə</span>
          </button>

          {/* Margin Note write button */}
          <button
            onClick={() => setIsEditingNote(!isEditingNote)}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
              isEditingNote || note
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-medium'
                : 'hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
            title="Ayənin yanına qeyd yaz"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{note ? 'Qeydi Aç' : 'Qeyd Yaz'}</span>
          </button>

          {/* Add to dedicated Journal */}
          <button
            onClick={onAddToJournal}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg transition-colors flex items-center gap-1 text-xs"
            title="Təfəkkür dəftərinə əlavə et"
          >
            <BookMarked className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span className="hidden md:inline">Dəftərə At</span>
          </button>

          {/* Underline / Highlight Button */}
          <div className="relative">
            <button
              onClick={() => setShowHighlightMenu(!showHighlightMenu)}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                isHighlighted
                  ? 'bg-stone-200/80 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="Xətt çək və ya rənglə"
            >
              <Highlighter className="w-3.5 h-3.5" style={{ color: highlightConfig ? highlightConfig.dotColor : undefined }} />
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {/* Highlight color picker dropdown */}
            {showHighlightMenu && (
              <div className="absolute right-0 top-full mt-1.5 z-30 w-52 p-2 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 px-2 pt-1 uppercase tracking-wider">
                  Rəngli Xətt Çək
                </div>
                {HIGHLIGHT_CONFIGS.map(cfg => (
                  <button
                    key={cfg.key}
                    onClick={() => {
                      onSetHighlight(cfg.key, 'both');
                      setShowHighlightMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
                      <span className="text-stone-800 dark:text-stone-200 font-medium">{cfg.label}</span>
                    </div>
                    {highlight?.color === cfg.key && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}

                {isHighlighted && (
                  <button
                    onClick={() => {
                      onRemoveHighlight();
                      setShowHighlightMenu(false);
                    }}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border-t border-stone-100 dark:border-stone-700/60 mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xətti sil</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bookmark */}
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-amber-600 dark:text-amber-400'
                : 'hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={isBookmarked ? 'Əlfəcini çıxart' : 'Əlfəcin əlavə et'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopyAyah}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="Ayəni və tərcüməni kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Arabic Ayah Text */}
      <div className="py-2 text-right">
        <p
          dir="rtl"
          lang="ar"
          style={{ fontSize: `${settings.fontSizeArabic}px`, lineHeight: 2.1 }}
          className={`font-quran text-stone-900 dark:text-stone-100 select-text ${
            isHighlighted && (highlight?.style === 'underline' || highlight?.style === 'both')
              ? highlightConfig?.underlineClass
              : ''
          }`}
        >
          {ayah.arabicText}
          <span className="inline-flex items-center justify-center font-mono text-sm mx-2 text-amber-700 dark:text-amber-400 select-none">
            ﴿{ayah.numberInSurah}﴾
          </span>
        </p>
      </div>

      {/* Transliteration (Oxunuş) */}
      {settings.showTransliteration && ayah.transliteration && (
        <div className="mt-1 text-xs text-stone-500 dark:text-stone-400 italic font-mono">
          {ayah.transliteration}
        </div>
      )}

      {/* Primary Translation */}
      <div className="mt-3 text-stone-800 dark:text-stone-200">
        <p
          style={{ fontSize: `${settings.fontSizeTranslation}px` }}
          className={`leading-relaxed font-serif-sacred font-medium ${
            isHighlighted && (highlight?.style === 'underline' || highlight?.style === 'both')
              ? highlightConfig?.underlineClass
              : ''
          }`}
        >
          {primaryTransText || 'Tərcümə mövcud deyil'}
        </p>
      </div>

      {/* Secondary Parallel Translation (if enabled) */}
      {secondaryTransText && (
        <div className="mt-2.5 pt-2.5 border-t border-stone-100 dark:border-stone-800/60 text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-0.5">
            Müqayisəli Məna:
          </span>
          <p className="italic">
            {secondaryTransText}
          </p>
        </div>
      )}

      {/* Direct Margin Note Display (Beside or below the ayah) */}
      {note && !isEditingNote && (
        <div className="mt-4 p-3.5 bg-amber-50/70 dark:bg-stone-800/60 rounded-xl border border-amber-200/80 dark:border-stone-700 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span className="font-semibold text-stone-900 dark:text-stone-200">
                Ayə Kənarı Qeydi ({noteCategoryConfig?.label})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px]">
                {new Date(note.updatedAt).toLocaleDateString('az-AZ')}
              </span>
              <button
                onClick={() => setIsEditingNote(true)}
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium text-xs"
              >
                Düzəliş et
              </button>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="text-stone-400 hover:text-rose-600"
                title="Qeydi sil"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          <p className="text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>
        </div>
      )}

      {/* Margin Note Editor (Inline) */}
      {isEditingNote && (
        <form onSubmit={handleSaveNoteSubmit} className="mt-4 p-4 bg-amber-50/90 dark:bg-stone-800 rounded-xl border border-amber-300 dark:border-stone-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-amber-600" />
              <span>{surahName} {ayah.numberInSurah}-ci ayə üçün qeyd</span>
            </span>
            <button
              type="button"
              onClick={() => setIsEditingNote(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-500 shrink-0">Kateqoriya:</span>
            {NOTE_CATEGORIES.map(cat => (
              <button
                type="button"
                key={cat.key}
                onClick={() => setNoteCategory(cat.key)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  noteCategory === cat.key
                    ? 'bg-amber-600 text-white font-medium shadow-xs'
                    : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Bu ayə sizə nə xatırladır? Hansı hikməti və ya dərsi gördünüz? Qeydinizi bura yazın..."
            rows={3}
            autoFocus
            className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed resize-y"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingNote(false)}
              className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700 rounded-md"
            >
              İmtina
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 rounded-md shadow-xs"
            >
              Qeydi Yadda Saxla
            </button>
          </div>
        </form>
      )}
    </article>
  );
};

import React, { useState } from 'react';
import { MarginNote, NoteCategory } from '../types';
import { NOTE_CATEGORIES } from '../data/reciters';
import { SURAH_LIST } from '../data/quranMetadata';
import {
  PenTool,
  Search,
  ArrowRight,
  Trash2,
  Edit2,
  Check,
  X,
  FileDown
} from 'lucide-react';

interface AllNotesHubProps {
  marginNotes: MarginNote[];
  onUpdateNote: (
    surahNumber: number,
    surahName: string,
    ayahNumber: number,
    ayahArabic: string,
    ayahTranslation: string,
    content: string,
    category?: NoteCategory
  ) => void;
  onDeleteNote: (id: string) => void;
  onNavigateToAyah: (surahNumber: number, ayahNumber: number) => void;
  onExportNotes: () => void;
}

export function AllNotesHub({
  marginNotes,
  onUpdateNote,
  onDeleteNote,
  onNavigateToAyah,
  onExportNotes
}: AllNotesHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSurahFilter, setSelectedSurahFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'quranOrder'>('newest');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<NoteCategory>('təfəkkür');

  // Filter notes
  const filteredNotes = marginNotes.filter(note => {
    const matchesSearch =
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.surahName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.ayahTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.ayahNumber.toString() === searchQuery;

    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesSurah = selectedSurahFilter === 'all' || note.surahNumber === selectedSurahFilter;

    return matchesSearch && matchesCategory && matchesSurah;
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'newest') return b.updatedAt - a.updatedAt;
    if (sortBy === 'oldest') return a.updatedAt - b.updatedAt;
    if (sortBy === 'quranOrder') {
      if (a.surahNumber !== b.surahNumber) return a.surahNumber - b.surahNumber;
      return a.ayahNumber - b.ayahNumber;
    }
    return 0;
  });

  // Surahs that have notes
  const surahsWithNotes = Array.from(new Set(marginNotes.map(n => n.surahNumber)));

  const handleStartEdit = (note: MarginNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
    setEditCategory(note.category);
  };

  const handleSaveEdit = (note: MarginNote) => {
    if (!editContent.trim()) return;
    onUpdateNote(
      note.surahNumber,
      note.surahName,
      note.ayahNumber,
      note.ayahArabic,
      note.ayahTranslation,
      editContent.trim(),
      editCategory
    );
    setEditingNoteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <PenTool className="w-6 h-6 text-sky-700 dark:text-sky-400" />
            <h1 className="font-serif-sacred text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Bütün Qeydlər Toplusu
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Qurani-Kərimin bütün surə və ayələri üzrə yazdığınız bütün qeydlərin mərkəzləşdirilmiş arxivi
          </p>
        </div>

        <button
          onClick={onExportNotes}
          className="px-3.5 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shadow-2xs"
        >
          <FileDown className="w-4 h-4 text-emerald-700" />
          <span>Qeydləri Eksport Et</span>
        </button>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search Box */}
          <div className="sm:col-span-5 flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-lg">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qeydlər, ayələr və surələr içində axtar..."
              className="w-full bg-transparent focus:outline-none text-stone-900 dark:text-stone-100"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Surah Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedSurahFilter}
              onChange={(e) => setSelectedSurahFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="all">Bütün Surələr ({marginNotes.length} qeyd)</option>
              {surahsWithNotes.map(sNum => {
                const sMeta = SURAH_LIST.find(s => s.id === sNum);
                const count = marginNotes.filter(n => n.surahNumber === sNum).length;
                return (
                  <option key={sNum} value={sNum}>
                    {sMeta?.transliteration || `Surə ${sNum}`} ({count} qeyd)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="all">Bütün Kateqoriyalar</option>
              {NOTE_CATEGORIES.map(cat => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="newest">Ən yeni qeydlər</option>
              <option value="oldest">Ən köhnə qeydlər</option>
              <option value="quranOrder">Quran sırası ilə</option>
            </select>
          </div>
        </div>

        {/* Category Pill Badges (Unboxed metadata style) */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs text-stone-500">
          <span className="font-medium text-stone-400 shrink-0">Filtr:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-stone-800 text-white font-medium'
                : 'hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            Hamısı ({marginNotes.length})
          </button>
          {NOTE_CATEGORIES.map(cat => {
            const count = marginNotes.filter(n => n.category === cat.key).length;
            if (count === 0 && selectedCategory !== cat.key) return null;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(selectedCategory === cat.key ? 'all' : cat.key)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.key
                    ? 'bg-emerald-800 text-white font-medium'
                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="space-y-4">
        {sortedNotes.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-400 space-y-2">
            <PenTool className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
              Heç bir qeyd tapılmadı
            </p>
            <p className="text-xs text-stone-500">
              Axtarış filtrini dəyişin və ya Quran oxuyarkən ayələrin yanına yeni qeydlər yazın.
            </p>
          </div>
        ) : (
          sortedNotes.map(note => {
            const catConfig = NOTE_CATEGORIES.find(c => c.key === note.category) || NOTE_CATEGORIES[0];
            const isEditingThis = editingNoteId === note.id;

            return (
              <article
                key={note.id}
                className="p-5 sm:p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-emerald-600/50 transition-all shadow-2xs space-y-3"
              >
                {/* Note Header: Surah & Ayah reference + Category + Date */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToAyah(note.surahNumber, note.ayahNumber)}
                      className="font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                    >
                      <span>{note.surahName} surəsi, {note.ayahNumber}-ci ayə</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {catConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-stone-400">
                      {new Date(note.updatedAt).toLocaleDateString('az-AZ')}
                    </span>
                    {!isEditingThis ? (
                      <>
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 rounded"
                          title="Redaktə et"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-400 hover:text-rose-600 rounded"
                          title="Qeydi sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSaveEdit(note)}
                          className="p-1 bg-emerald-700 text-white rounded hover:bg-emerald-800"
                          title="Yadda saxla"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="p-1 text-stone-400 hover:text-stone-600 rounded"
                          title="İmtina"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Arabic Text & Translation Quote */}
                <div className="space-y-1.5 bg-stone-50/60 dark:bg-stone-800 p-3.5 rounded-xl border border-stone-100 dark:border-stone-800">
                  <p className="font-quran text-lg text-stone-900 dark:text-stone-100 text-right leading-loose">
                    {note.ayahArabic}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300 italic font-serif-sacred">
                    "{note.ayahTranslation}"
                  </p>
                </div>

                {/* Note Content (or Editor) */}
                {isEditingThis ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
                      {NOTE_CATEGORIES.map(c => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => setEditCategory(c.key)}
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            editCategory === c.key
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      className="w-full p-3 bg-white dark:bg-stone-900 border border-amber-300 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans whitespace-pre-wrap pl-1 border-l-2 border-amber-400 dark:border-amber-600">
                    {note.content}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { JournalEntry, LinkedVerse } from '../types';
import {
  BookMarked,
  Plus,
  Search,
  Tag,
  Star,
  Trash2,
  Edit3,
  Calendar,
  BookOpen,
  X,
  Share2,
  Check
} from 'lucide-react';

interface JournalHubProps {
  journalEntries: JournalEntry[];
  onCreateEntry: (
    title: string,
    category: string,
    content: string,
    linkedVerses?: LinkedVerse[],
    tags?: string[],
    reflectionPrompt?: string
  ) => JournalEntry;
  onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onNavigateToAyah: (surahNumber: number, ayahNumber: number) => void;
}

export const JournalHub: React.FC<JournalHubProps> = ({
  journalEntries,
  onCreateEntry,
  onUpdateEntry,
  onDeleteEntry,
  onNavigateToAyah
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    journalEntries.length > 0 ? journalEntries[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states for creating / editing
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Şəxsi Təfəkkür');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedEntry = journalEntries.find(e => e.id === selectedEntryId) || null;

  // Collect all unique tags across entries
  const allTags = Array.from(
    new Set(journalEntries.flatMap(e => e.tags || []))
  );

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.linkedVerses.some(v => v.surahName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || entry.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleStartNewEntry = () => {
    setIsCreatingNew(true);
    setIsEditing(false);
    setFormTitle('');
    setFormCategory('Şəxsi Təfəkkür');
    setFormContent('');
    setFormTags('');
  };

  const handleStartEdit = (entry: JournalEntry) => {
    setIsEditing(true);
    setIsCreatingNew(false);
    setFormTitle(entry.title);
    setFormCategory(entry.category);
    setFormContent(entry.content);
    setFormTags(entry.tags.join(', '));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (isCreatingNew) {
      const created = onCreateEntry(
        formTitle.trim(),
        formCategory,
        formContent.trim(),
        [],
        tagsArray
      );
      setSelectedEntryId(created.id);
      setIsCreatingNew(false);
    } else if (isEditing && selectedEntry) {
      onUpdateEntry(selectedEntry.id, {
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        tags: tagsArray
      });
      setIsEditing(false);
    }
  };

  const handleCopyEntryText = (entry: JournalEntry) => {
    const text = `${entry.title}\n\n${entry.content}\n\nQurani-Kərim Ayələri:\n${entry.linkedVerses.map(v => `${v.surahName} (${v.ayahNumber}): ${v.translation}`).join('\n')}\n\n(Bəyan Təfəkkür Dəftəri)`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
            <h1 className="font-serif-sacred text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Qurani Təfəkkür Dəftəri
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Qurana aid şəxsi düşüncələriniz, ayələrdən çıxardığınız dərslər və mənəvi qeydləriniz
          </p>
        </div>

        <button
          onClick={handleStartNewEntry}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Təfəkkür Yazısı</span>
        </button>
      </div>

      {/* Main Journal Workspace: Two-pane notebook layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (4 cols): Entries List & Search */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search & Tag Filter */}
          <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 rounded-lg">
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Dəftərdə axtar..."
                className="w-full text-xs bg-transparent focus:outline-none text-stone-900 dark:text-stone-100"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {allTags.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                    selectedTag === null
                      ? 'bg-stone-800 text-white font-medium'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  Bütün teqlər
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                      selectedTag === tag
                        ? 'bg-emerald-800 text-white font-medium'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Entries Scroll List */}
          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-400 text-xs">
                Yazı tapılmadı. Yeni bir təfəkkür yazısı əlavə edin.
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => {
                    setSelectedEntryId(entry.id);
                    setIsCreatingNew(false);
                    setIsEditing(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer shadow-2xs space-y-2 ${
                    selectedEntryId === entry.id && !isCreatingNew
                      ? 'bg-amber-50/90 dark:bg-stone-800/90 border-amber-400 dark:border-amber-600 ring-1 ring-amber-400/30'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-semibold text-amber-800 dark:text-amber-400">{entry.category}</span>
                    <span className="font-mono">{new Date(entry.createdAt).toLocaleDateString('az-AZ')}</span>
                  </div>

                  <h3 className="font-serif-sacred font-bold text-base text-stone-900 dark:text-stone-100 line-clamp-1">
                    {entry.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {entry.content}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-700" />
                      <span>{entry.linkedVerses.length} ayə bağlıdır</span>
                    </span>
                    {entry.starred && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane (8 cols): Active Entry Reading / Form Editor */}
        <div className="lg:col-span-8">
          {isCreatingNew || isEditing ? (
            /* Creation / Editing Form */
            <form onSubmit={handleSaveForm} className="p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <h2 className="font-serif-sacred font-bold text-xl text-stone-900 dark:text-stone-100">
                  {isCreatingNew ? 'Yeni Təfəkkür Dəftəri Yazısı' : 'Yazıya Düzəliş Et'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setIsEditing(false);
                  }}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Yazının Başlığı
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Məs: Həyat sınaqları qarşısında səbr və İnşirah surəsi..."
                    required
                    className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Kateqoriya
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100"
                    >
                      <option value="Şəxsi Təfəkkür">Şəxsi Təfəkkür</option>
                      <option value="Həyat Dərsi & Əməl">Həyat Dərsi & Əməl</option>
                      <option value="Təfsir & Məna">Təfsir & Məna</option>
                      <option value="Dua & Müraciət">Dua & Müraciət</option>
                      <option value="Cümə Xatırlatması">Cümə Xatırlatması</option>
                      <option value="Əxlaq & Nəfs Tərbiyəsi">Əxlaq & Nəfs Tərbiyəsi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Teqlər (vergüllə ayırın)
                    </label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="Səbr, İnşirah, Şükür..."
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Təfəkkür Mətni
                    </label>
                    <span className="text-[11px] text-stone-400">
                      Ruhani hisslərinizi, ayələrin sizdə oyatdığı təsiri sərbəst yazın
                    </span>
                  </div>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Bu ayə mənim bugünkü həyatıma necə toxunur? Hansı xətalarımdan çəkinməliyəm?..."
                    rows={12}
                    required
                    className="w-full p-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-700 resize-y"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Dəftərə Yadda Saxla
                </button>
              </div>
            </form>
          ) : selectedEntry ? (
            /* Selected Entry Detail View */
            <div className="p-6 sm:p-10 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              {/* Entry Header */}
              <div className="space-y-3 pb-5 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-800 dark:text-amber-400">{selectedEntry.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedEntry.createdAt).toLocaleDateString('az-AZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateEntry(selectedEntry.id, { starred: !selectedEntry.starred })}
                      className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                      title="Ulduzla işarələ"
                    >
                      <Star className={`w-4 h-4 ${selectedEntry.starred ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
                    </button>
                    <button
                      onClick={() => handleCopyEntryText(selectedEntry)}
                      className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                      title="Mətni kopyala"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-stone-500" />}
                    </button>
                    <button
                      onClick={() => handleStartEdit(selectedEntry)}
                      className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                      title="Redaktə et"
                    >
                      <Edit3 className="w-4 h-4 text-stone-500" />
                    </button>
                    <button
                      onClick={() => onDeleteEntry(selectedEntry.id)}
                      className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors text-stone-400 hover:text-rose-600"
                      title="Yazını sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="font-serif-sacred text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                  {selectedEntry.title}
                </h1>

                {selectedEntry.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    {selectedEntry.tags.map(tag => (
                      <span key={tag} className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-stone-400" />
                        <span>#{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Quran Verses Callouts */}
              {selectedEntry.linkedVerses.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs uppercase font-bold tracking-wider text-stone-500">
                    Əlaqəli Qurani-Kərim Ayələri
                  </div>
                  {selectedEntry.linkedVerses.map(v => (
                    <div
                      key={`${v.surahNumber}-${v.ayahNumber}`}
                      onClick={() => onNavigateToAyah(v.surahNumber, v.ayahNumber)}
                      className="p-4 bg-amber-50/60 dark:bg-stone-800/60 rounded-xl border border-amber-200/60 dark:border-stone-700/80 cursor-pointer hover:border-emerald-600 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                          {v.surahName} surəsi, {v.ayahNumber}-ci ayə
                        </span>
                        <span className="text-[11px] text-emerald-700 hover:underline">
                          Surədə aç →
                        </span>
                      </div>
                      <p className="font-quran text-xl text-stone-900 dark:text-stone-100 text-right leading-loose">
                        {v.arabicText}
                      </p>
                      <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-sacred italic">
                        "{v.translation}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Main Reflection Body Text */}
              <div className="pt-2 text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                {selectedEntry.content}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-400 space-y-3">
              <BookMarked className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
                Seçilmiş yazı yoxdur
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Sol tərəfdən bir yazı seçin və ya yeni bir təfəkkür yazısı başladın.
              </p>
              <button
                onClick={handleStartNewEntry}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Yeni Təfəkkür Yazısı Yaz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

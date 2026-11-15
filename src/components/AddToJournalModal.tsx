import React, { useState } from 'react';
import { LinkedVerse, JournalEntry } from '../types';
import { BookMarked, Plus, Link2, X, Check } from 'lucide-react';

interface AddToJournalModalProps {
  verse: LinkedVerse | null;
  journalEntries: JournalEntry[];
  isOpen: boolean;
  onClose: () => void;
  onCreateWithVerse: (
    title: string,
    category: string,
    content: string,
    verse: LinkedVerse,
    tags?: string[]
  ) => void;
  onLinkToExisting: (entryId: string, verse: LinkedVerse) => void;
}

export const AddToJournalModal: React.FC<AddToJournalModalProps> = ({
  verse,
  journalEntries,
  isOpen,
  onClose,
  onCreateWithVerse,
  onLinkToExisting
}) => {
  const [tab, setTab] = useState<'new' | 'existing'>('new');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Şəxsi Təfəkkür');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    journalEntries.length > 0 ? journalEntries[0].id : ''
  );
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen || !verse) return null;

  const handleCreateNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagsArr = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onCreateWithVerse(title.trim(), category, content.trim(), verse, tagsArr);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  const handleLinkExistingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntryId) return;

    onLinkToExisting(selectedEntryId, verse);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h2 className="font-serif-sacred font-bold text-lg text-stone-900 dark:text-stone-100">
              Ayəni Təfəkkür Dəftərinə Əlavə Et
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Verse Preview Card */}
        <div className="p-4 bg-amber-50/70 dark:bg-stone-800 border-b border-amber-200/50 dark:border-stone-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-emerald-800 dark:text-emerald-400">
              {verse.surahName} surəsi, {verse.ayahNumber}-ci ayə
            </span>
          </div>
          <p className="font-quran text-lg text-stone-900 dark:text-stone-100 text-right leading-loose">
            {verse.arabicText}
          </p>
          <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-sacred italic line-clamp-2">
            "{verse.translation}"
          </p>
        </div>

        {/* Success toast overlay */}
        {successToast && (
          <div className="p-3 bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Ayə uğurla təfəkkür dəftərinizə əlavə edildi!</span>
          </div>
        )}

        {/* Mode Tabs */}
        <div className="flex items-center border-b border-stone-200 dark:border-stone-800 text-xs font-medium">
          <button
            onClick={() => setTab('new')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-colors ${
              tab === 'new'
                ? 'border-b-2 border-emerald-800 text-emerald-800 dark:text-emerald-400 font-bold bg-stone-50/60 dark:bg-stone-800'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Təfəkkür Yazısı Başlat</span>
          </button>

          <button
            onClick={() => setTab('existing')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-colors ${
              tab === 'existing'
                ? 'border-b-2 border-emerald-800 text-emerald-800 dark:text-emerald-400 font-bold bg-stone-50/60 dark:bg-stone-800'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Mövcud Yazıya Əlavə Et</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {tab === 'new' ? (
            <form onSubmit={handleCreateNewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Yazının Başlığı
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Məsələn: ${verse.surahName} (${verse.ayahNumber}) haqqında düşüncələr...`}
                  required
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Kateqoriya
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  >
                    <option value="Şəxsi Təfəkkür">Şəxsi Təfəkkür</option>
                    <option value="Həyat Dərsi & Əməl">Həyat Dərsi & Əməl</option>
                    <option value="Dua & Yalvarış">Dua & Yalvarış</option>
                    <option value="Təfsir İncəliyi">Təfsir İncəliyi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Teqlər
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Səbr, Hikmət, İmtahan..."
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Şəxsi Təfəkkürünüz & Qeydləriniz
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Bu ayə qəlbinizdə nə oyatdı? Gündəlik həyatınıza necə təsir etməlidir?..."
                  rows={5}
                  required
                  className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700 leading-relaxed resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 rounded-lg"
                >
                  İmtina
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Dəftərə Əlavə Et
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLinkExistingSubmit} className="space-y-4 text-xs">
              {journalEntries.length === 0 ? (
                <div className="p-6 text-center text-stone-500">
                  Hələ heç bir dəftər yazısı mövcud deyil. Zəhmət olmasa "Yeni Təfəkkür Yazısı Başlat" bölməsindən ilk yazınızı yazın.
                </div>
              ) : (
                <>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300">
                    Ayəni hansı mövcud təfəkkür yazısına qoşmaq istəyirsiniz?
                  </label>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {journalEntries.map(entry => (
                      <label
                        key={entry.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          selectedEntryId === entry.id
                            ? 'bg-amber-50 dark:bg-stone-800 border-amber-400'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedEntry"
                          value={entry.id}
                          checked={selectedEntryId === entry.id}
                          onChange={(e) => setSelectedEntryId(e.target.value)}
                          className="mt-0.5 accent-emerald-700"
                        />
                        <div className="flex-1 space-y-0.5">
                          <div className="font-semibold text-stone-900 dark:text-stone-100">{entry.title}</div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">{entry.content}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3.5 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 rounded-lg"
                    >
                      İmtina
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                    >
                      Bu Yazıya Qoş
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

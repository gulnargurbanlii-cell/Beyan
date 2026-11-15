import React from 'react';
import { QURAN_TOPICS } from '../data/quranTopics';
import { LinkedVerse } from '../types';
import { Compass, BookOpen, BookMarked, ArrowRight } from 'lucide-react';

interface TopicsHubProps {
  onNavigateToAyah: (surahNumber: number, ayahNumber: number) => void;
  onOpenAddToJournalModal: (verse: LinkedVerse) => void;
}

export const TopicsHub: React.FC<TopicsHubProps> = ({
  onNavigateToAyah,
  onOpenAddToJournalModal
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
          <h1 className="font-serif-sacred text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Mövzular üzrə Quran Təfəkkürü
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Həyatın əsas mənəvi mövzularına aid seçilmiş ayələr, hikmətlər və təfəkkür bələdçisi
        </p>
      </div>

      {/* Topics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QURAN_TOPICS.map(topic => (
          <div
            key={topic.id}
            className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4"
          >
            <div className="space-y-1">
              <h2 className="font-serif-sacred font-bold text-xl text-stone-900 dark:text-stone-100">
                {topic.titleAz}
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                {topic.descriptionAz}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {topic.verseRefs.map((v, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-100 dark:border-stone-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                      {v.surahName} ({v.surahNumber}:{v.ayahNumber})
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onOpenAddToJournalModal({
                            surahNumber: v.surahNumber,
                            surahName: v.surahName,
                            ayahNumber: v.ayahNumber,
                            arabicText: v.textArabic,
                            translation: v.translationAz
                          })
                        }
                        className="text-stone-500 hover:text-emerald-700 flex items-center gap-1 text-[11px]"
                        title="Dəftərə əlavə et"
                      >
                        <BookMarked className="w-3 h-3" />
                        <span>Dəftərə at</span>
                      </button>

                      <button
                        onClick={() => onNavigateToAyah(v.surahNumber, v.ayahNumber)}
                        className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 text-[11px]"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Oxu</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-quran text-lg text-stone-900 dark:text-stone-100 text-right leading-loose">
                    {v.textArabic}
                  </p>

                  <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-sacred italic">
                    "{v.translationAz}"
                  </p>

                  <div className="pt-1 text-[11px] text-amber-800 dark:text-amber-400 bg-amber-50/60 dark:bg-stone-800 p-2 rounded-lg border-l-2 border-amber-400">
                    <span className="font-semibold">Təfəkkür nöqtəsi: </span>
                    <span>{v.reflectionNote}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { useQuranState } from './hooks/useQuranState';
import { ActiveTab, LinkedVerse } from './types';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { QuranReader } from './components/QuranReader';
import { JournalHub } from './components/JournalHub';
import { AllNotesHub } from './components/AllNotesHub';
import { HighlightsHub } from './components/HighlightsHub';
import { TopicsHub } from './components/TopicsHub';
import { SearchHub } from './components/SearchHub';
import { AudioPlayerDock } from './components/AudioPlayerDock';
import { AddToJournalModal } from './components/AddToJournalModal';
import { SURAH_LIST } from './data/quranMetadata';

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('NUN tətbiq xətası:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5] dark:bg-stone-950 p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-800 text-amber-200 font-quran text-2xl flex items-center justify-center">
              ن
            </div>
            <h1 className="font-serif-sacred text-xl font-bold text-stone-900 dark:text-stone-100">
              Müvəqqəti xəta baş verdi
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Məlumatların yüklənməsi zamanı gözlənilməz xəta yarandı. Səhifəni yeniləyərək davam edə bilərsiniz.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Səhifəni yenilə
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const {
    marginNotes,
    saveMarginNote,
    deleteMarginNote,
    journalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addVerseToJournalEntry,
    highlights,
    setVerseHighlight,
    removeVerseHighlight,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    settings,
    updateSettings,
    progress,
    saveReadingProgress,
    exportUserData
  } = useQuranState();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(progress.lastReadSurah || 1);
  const [targetAyahNumber, setTargetAyahNumber] = useState<number | undefined>(undefined);
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');

  // Audio recitation state
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<{ surahNumber: number; ayahNumber: number } | null>(null);

  // Add to Journal modal state
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [verseToAddToJournal, setVerseToAddToJournal] = useState<LinkedVerse | null>(null);

  // Navigation helpers
  const handleNavigateToSurah = (surahNumber: number, ayahNumber?: number) => {
    setCurrentSurahNumber(surahNumber);
    setTargetAyahNumber(ayahNumber);
    setActiveTab('reader');
  };

  const handlePlayAyah = (surahNumber: number, ayahNumber: number) => {
    setCurrentPlayingAyah({ surahNumber, ayahNumber });
  };

  const handleNextAyah = () => {
    if (!currentPlayingAyah) return;
    const currentSurahMeta = SURAH_LIST.find(s => s.id === currentPlayingAyah.surahNumber);
    if (!currentSurahMeta) return;

    if (currentPlayingAyah.ayahNumber < currentSurahMeta.versesCount) {
      setCurrentPlayingAyah({
        surahNumber: currentPlayingAyah.surahNumber,
        ayahNumber: currentPlayingAyah.ayahNumber + 1
      });
    } else if (currentPlayingAyah.surahNumber < 114) {
      // Advance to next surah
      setCurrentPlayingAyah({
        surahNumber: currentPlayingAyah.surahNumber + 1,
        ayahNumber: 1
      });
      setCurrentSurahNumber(currentPlayingAyah.surahNumber + 1);
    }
  };

  const handlePrevAyah = () => {
    if (!currentPlayingAyah) return;
    if (currentPlayingAyah.ayahNumber > 1) {
      setCurrentPlayingAyah({
        surahNumber: currentPlayingAyah.surahNumber,
        ayahNumber: currentPlayingAyah.ayahNumber - 1
      });
    }
  };

  const handleOpenAddToJournalModal = (verse: LinkedVerse) => {
    setVerseToAddToJournal(verse);
    setIsJournalModalOpen(true);
  };

  const handleCreateWithVerse = (
    title: string,
    category: string,
    content: string,
    verse: LinkedVerse,
    tags?: string[]
  ) => {
    createJournalEntry(title, category, content, [verse], tags);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors selection:bg-amber-100 dark:selection:bg-emerald-950">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={settings.theme}
        toggleTheme={toggleTheme}
        notesCount={marginNotes.length}
        journalCount={journalEntries.length}
        onOpenNewJournal={() => {
          setActiveTab('journal');
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-24">
        {activeTab === 'overview' && (
          <DashboardOverview
            marginNotes={marginNotes}
            journalEntries={journalEntries}
            highlights={highlights}
            bookmarks={bookmarks}
            lastRead={{
              surahNumber: progress.lastReadSurah,
              surahName: progress.lastReadSurahName,
              ayahNumber: progress.lastReadAyah
            }}
            onNavigateToSurah={handleNavigateToSurah}
            onNavigateTab={setActiveTab}
            onOpenNewJournal={() => setActiveTab('journal')}
            onPlayAyahAudio={handlePlayAyah}
            onExportData={exportUserData}
            onQuickSearch={(q) => {
              setInitialSearchQuery(q);
              setActiveTab('search');
            }}
          />
        )}

        {activeTab === 'reader' && (
          <QuranReader
            currentSurahNumber={currentSurahNumber}
            initialAyahNumber={targetAyahNumber}
            onSelectSurah={(num) => {
              setCurrentSurahNumber(num);
              setTargetAyahNumber(undefined);
            }}
            settings={settings}
            onUpdateSettings={updateSettings}
            marginNotes={marginNotes}
            onSaveMarginNote={saveMarginNote}
            onDeleteMarginNote={deleteMarginNote}
            highlights={highlights}
            onSetHighlight={setVerseHighlight}
            onRemoveHighlight={removeVerseHighlight}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
            onOpenAddToJournalModal={handleOpenAddToJournalModal}
            currentPlayingAyah={currentPlayingAyah}
            onPlayAyah={handlePlayAyah}
            onSaveReadingProgress={saveReadingProgress}
            onOpenSearch={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'journal' && (
          <JournalHub
            journalEntries={journalEntries}
            onCreateEntry={createJournalEntry}
            onUpdateEntry={updateJournalEntry}
            onDeleteEntry={deleteJournalEntry}
            onNavigateToAyah={handleNavigateToSurah}
          />
        )}

        {activeTab === 'notes' && (
          <AllNotesHub
            marginNotes={marginNotes}
            onUpdateNote={saveMarginNote}
            onDeleteNote={deleteMarginNote}
            onNavigateToAyah={handleNavigateToSurah}
            onExportNotes={exportUserData}
          />
        )}

        {activeTab === 'highlights' && (
          <HighlightsHub
            highlights={highlights}
            onRemoveHighlight={removeVerseHighlight}
            onNavigateToAyah={handleNavigateToSurah}
          />
        )}

        {activeTab === 'topics' && (
          <TopicsHub
            onNavigateToAyah={handleNavigateToSurah}
            onOpenAddToJournalModal={handleOpenAddToJournalModal}
          />
        )}

        {activeTab === 'search' && (
          <SearchHub
            initialQuery={initialSearchQuery}
            defaultEdition={settings.primaryTranslation}
            onNavigateToSurah={handleNavigateToSurah}
            onPlayAyahAudio={handlePlayAyah}
            onOpenAddToJournalModal={handleOpenAddToJournalModal}
          />
        )}
      </main>

      {/* Audio Recitation Floating Dock */}
      <AudioPlayerDock
        currentPlaying={currentPlayingAyah}
        selectedReciterId={settings.selectedReciterId}
        onSelectReciter={(id) => updateSettings({ selectedReciterId: id })}
        onNextAyah={handleNextAyah}
        onPrevAyah={handlePrevAyah}
        onClosePlayer={() => setCurrentPlayingAyah(null)}
      />

      {/* Add Verse to Journal Modal */}
      <AddToJournalModal
        verse={verseToAddToJournal}
        journalEntries={journalEntries}
        isOpen={isJournalModalOpen}
        onClose={() => {
          setIsJournalModalOpen(false);
          setVerseToAddToJournal(null);
        }}
        onCreateWithVerse={handleCreateWithVerse}
        onLinkToExisting={addVerseToJournalEntry}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab } from '../types';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen,
  BookMarked,
  PenTool,
  Highlighter,
  Sparkles,
  Moon,
  Sun,
  Compass,
  Search,
  LogOut,
  ChevronDown,
  Mail,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notesCount: number;
  journalCount: number;
  onOpenNewJournal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  notesCount,
  journalCount,
  onOpenNewJournal
}) => {
  const { user, authReady, signingIn, authError, clearAuthError, loginWithGmail, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [user?.photoURL]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const userInitial = (user?.displayName || user?.email || 'N').trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 md:gap-6 h-16">
          {/* Zone 1: Single text element wordmark with letter NUN */}
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 dark:bg-emerald-700 flex items-center justify-center text-amber-200 shadow-xs font-quran font-bold text-xl pb-0.5">
              ن
            </div>
            <div className="flex flex-col">
              <span className="font-serif-sacred font-bold tracking-wider text-xl text-stone-900 dark:text-stone-100 whitespace-nowrap">
                NUN
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-medium text-stone-600 dark:text-stone-300">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Başlanğıc</span>
            </button>

            <button
              onClick={() => setActiveTab('reader')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'reader'
                  ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Quran Oxu & Dinlə</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <PenTool className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Qeydlərim</span>
              {notesCount > 0 && (
                <span className="text-xs font-mono text-stone-500 dark:text-stone-400">({notesCount})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'journal'
                  ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <BookMarked className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Qeyd Dəftəri</span>
              {journalCount > 0 && (
                <span className="text-xs font-mono text-stone-500 dark:text-stone-400">({journalCount})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('highlights')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'highlights'
                  ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Highlighter className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Xətt Çəkilənlər</span>
            </button>

            <button
              onClick={() => setActiveTab('topics')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'topics'
                  ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Compass className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <span>Mövzular</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Kəlmə Axtar</span>
            </button>
          </nav>

          {/* Zone 3: Theme toggle, Gmail Account, and Primary Action */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Gündüz rejiminə keç' : 'Gecə rejiminə keç'}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
              title={theme === 'dark' ? 'Gündüz rejimi' : 'Gecə rejimi'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {authReady && !user && (
              <button
                onClick={loginWithGmail}
                disabled={signingIn}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 disabled:opacity-60"
                title="Gmail ilə hesab yarat və ya daxil ol"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span className="hidden sm:inline">{signingIn ? 'Giriş edilir...' : 'Gmail ilə Daxil Ol'}</span>
                <span className="sm:hidden">{signingIn ? '...' : 'Daxil Ol'}</span>
              </button>
            )}

            {authReady && user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                  aria-expanded={menuOpen}
                  aria-label="Hesab menyusu"
                >
                  {user.photoURL && !imgError ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Hesab şəkli'}
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-6 h-6 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-emerald-800 dark:bg-emerald-700 text-amber-200 text-xs font-semibold flex items-center justify-center shrink-0">
                      {userInitial}
                    </div>
                  )}
                  <span className="hidden xl:inline text-xs font-medium text-stone-800 dark:text-stone-200 max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 shadow-lg py-2 z-50">
                    <div className="px-3.5 py-2 border-b border-stone-100 dark:border-stone-800 space-y-0.5">
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {user.displayName || 'İstifadəçi'}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {user.email}
                      </p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 pt-1">
                        Qeydləriniz hesabınızda saxlanılır
                      </p>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          loginWithGmail();
                        }}
                        disabled={signingIn}
                        className="w-full px-3.5 py-2 text-left text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                        <span>Başqa Gmail hesabı seç</span>
                      </button>

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Hesabdan çıxış</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onOpenNewJournal}
              className="px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">Yeni Təfəkkür</span>
              <span className="sm:hidden">Yeni Qeyd</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-stone-200/60 dark:border-stone-800/60 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 ${activeTab === 'overview' ? 'bg-stone-200 dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}
          >
            İcmal
          </button>
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 ${activeTab === 'reader' ? 'bg-stone-200 dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}
          >
            Quran Oxu
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 ${activeTab === 'journal' ? 'bg-stone-200 dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}
          >
            Təfəkkür Dəftəri
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 ${activeTab === 'notes' ? 'bg-stone-200 dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}
          >
            Qeydlər ({notesCount})
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 ${activeTab === 'highlights' ? 'bg-stone-200 dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}
          >
            Xətlər
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 ${activeTab === 'topics' ? 'bg-stone-200 dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}
          >
            Mövzular
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 flex items-center gap-1 ${activeTab === 'search' ? 'bg-emerald-100 dark:bg-emerald-950/60 font-semibold text-emerald-900 dark:text-emerald-200' : 'text-stone-600 dark:text-stone-400'}`}
          >
            <Search className="w-3 h-3" />
            <span>Kəlmə Axtar</span>
          </button>
        </div>
      </div>

      {/* Inline Auth Error Banner */}
      {authError && (
        <div className="bg-rose-50 dark:bg-rose-950/60 border-t border-rose-200 dark:border-rose-900 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              onClick={clearAuthError}
              className="p-1 hover:bg-rose-200/50 dark:hover:bg-rose-900/50 rounded-md transition-colors"
              aria-label="Xətanı bağla"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

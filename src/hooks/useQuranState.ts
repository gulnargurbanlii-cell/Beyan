import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  MarginNote,
  JournalEntry,
  VerseHighlight,
  Bookmark,
  HighlightColor,
  NoteCategory,
  LinkedVerse,
  ReadingSettings,
  ReadingProgress
} from '../types';

const STORAGE_KEYS = {
  NOTES: 'nun_margin_notes_v2',
  JOURNAL: 'nun_journal_entries_v2',
  HIGHLIGHTS: 'nun_highlights_v2',
  BOOKMARKS: 'nun_bookmarks_v2',
  SETTINGS: 'nun_settings_v2',
  PROGRESS: 'nun_reading_progress_v2'
};

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSizeArabic: 27,
  fontSizeTranslation: 15,
  primaryTranslation: 'az_mammadaliyev',
  secondaryTranslation: 'none',
  showTransliteration: true,
  selectedReciterId: 'alafasy',
  playbackSpeed: 1,
  theme: 'light'
};

const DEFAULT_PROGRESS: ReadingProgress = {
  lastReadSurah: 1,
  lastReadAyah: 1,
  lastReadSurahName: 'əl-Fatihə',
  updatedAt: Date.now()
};

function toEpochMs(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value instanceof Timestamp) return value.toMillis();
  if (value && typeof value === 'object' && 'toMillis' in value && typeof (value as any).toMillis === 'function') {
    return (value as any).toMillis();
  }
  return Date.now();
}

function readLocalArray<T>(key: string): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn(`Failed reading ${key}:`, e);
  }
  return [];
}

export function useQuranState() {
  const { user, authReady } = useAuth();

  // Local-first initial states (used when guest, or before Firestore sync completes)
  const [marginNotes, setMarginNotes] = useState<MarginNote[]>(() => readLocalArray<MarginNote>(STORAGE_KEYS.NOTES));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => readLocalArray<JournalEntry>(STORAGE_KEYS.JOURNAL));
  const [highlights, setHighlights] = useState<VerseHighlight[]>(() => readLocalArray<VerseHighlight>(STORAGE_KEYS.HIGHLIGHTS));
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => readLocalArray<Bookmark>(STORAGE_KEYS.BOOKMARKS));

  const [settings, setSettings] = useState<ReadingSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed loading settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [progress, setProgress] = useState<ReadingProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading progress', e);
    }
    return DEFAULT_PROGRESS;
  });

  const [cloudSynced, setCloudSynced] = useState(false);
  const hasCloudSettingsRef = useRef(false);
  const migratedForUidRef = useRef<string | null>(null);

  // Persist local cache whenever state changes in guest mode (and settings/theme locally)
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(marginNotes));
      } catch (e) { console.warn(e); }
    }
  }, [marginNotes, user]);

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journalEntries));
      } catch (e) { console.warn(e); }
    }
  }, [journalEntries, user]);

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
      } catch (e) { console.warn(e); }
    }
  }, [highlights, user]);

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      } catch (e) { console.warn(e); }
    }
  }, [bookmarks, user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) { console.warn(e); }

    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
      } catch (e) { console.warn(e); }
    }
  }, [progress, user]);

  // Real-time Firestore listeners when authenticated with Gmail
  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      setCloudSynced(false);
      hasCloudSettingsRef.current = false;
      migratedForUidRef.current = null;
      // Restore guest localStorage data on sign out
      setMarginNotes(readLocalArray<MarginNote>(STORAGE_KEYS.NOTES));
      setJournalEntries(readLocalArray<JournalEntry>(STORAGE_KEYS.JOURNAL));
      setHighlights(readLocalArray<VerseHighlight>(STORAGE_KEYS.HIGHLIGHTS));
      setBookmarks(readLocalArray<Bookmark>(STORAGE_KEYS.BOOKMARKS));
      return;
    }

    const uid = user.uid;

    // 1. Margin Notes listener
    const notesPath = `users/${uid}/marginNotes`;
    const notesQuery = query(collection(db, 'users', uid, 'marginNotes'), where('uid', '==', uid));
    const unsubNotes = onSnapshot(
      notesQuery,
      (snapshot) => {
        const list: MarginNote[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            surahNumber: Number(data.surahNumber),
            surahName: String(data.surahName || ''),
            ayahNumber: Number(data.ayahNumber),
            ayahArabic: String(data.ayahArabic || ''),
            ayahTranslation: String(data.ayahTranslation || ''),
            content: String(data.content || ''),
            category: data.category as NoteCategory,
            createdAt: toEpochMs(data.createdAt),
            updatedAt: toEpochMs(data.updatedAt)
          };
        });
        list.sort((a, b) => b.updatedAt - a.updatedAt);
        setMarginNotes(list);
        setCloudSynced(true);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, notesPath)
    );

    // 2. Journal Entries listener
    const journalPath = `users/${uid}/journalEntries`;
    const journalQuery = query(collection(db, 'users', uid, 'journalEntries'), where('uid', '==', uid));
    const unsubJournal = onSnapshot(
      journalQuery,
      (snapshot) => {
        const list: JournalEntry[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            title: String(data.title || ''),
            category: String(data.category || 'Şəxsi Təfəkkür'),
            content: String(data.content || ''),
            reflectionPrompt: data.reflectionPrompt ? String(data.reflectionPrompt) : undefined,
            linkedVerses: Array.isArray(data.linkedVerses) ? data.linkedVerses : [],
            tags: Array.isArray(data.tags) ? data.tags : [],
            starred: Boolean(data.starred),
            createdAt: toEpochMs(data.createdAt),
            updatedAt: toEpochMs(data.updatedAt)
          };
        });
        list.sort((a, b) => b.updatedAt - a.updatedAt);
        setJournalEntries(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, journalPath)
    );

    // 3. Highlights listener
    const highlightsPath = `users/${uid}/highlights`;
    const highlightsQuery = query(collection(db, 'users', uid, 'highlights'), where('uid', '==', uid));
    const unsubHighlights = onSnapshot(
      highlightsQuery,
      (snapshot) => {
        const list: VerseHighlight[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            surahNumber: Number(data.surahNumber),
            ayahNumber: Number(data.ayahNumber),
            color: data.color as HighlightColor,
            style: data.style || 'both',
            note: data.note ? String(data.note) : undefined,
            createdAt: toEpochMs(data.createdAt)
          };
        });
        setHighlights(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, highlightsPath)
    );

    // 4. Bookmarks listener
    const bookmarksPath = `users/${uid}/bookmarks`;
    const bookmarksQuery = query(collection(db, 'users', uid, 'bookmarks'), where('uid', '==', uid));
    const unsubBookmarks = onSnapshot(
      bookmarksQuery,
      (snapshot) => {
        const list: Bookmark[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            surahNumber: Number(data.surahNumber),
            surahName: String(data.surahName || ''),
            ayahNumber: Number(data.ayahNumber),
            arabicText: String(data.arabicText || ''),
            translation: String(data.translation || ''),
            createdAt: toEpochMs(data.createdAt)
          };
        });
        list.sort((a, b) => b.createdAt - a.createdAt);
        setBookmarks(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, bookmarksPath)
    );

    // 5. Settings & Progress listener
    const settingsPath = `users/${uid}/private/settings`;
    const settingsRef = doc(db, 'users', uid, 'private', 'settings');
    const unsubSettings = onSnapshot(
      settingsRef,
      (snap) => {
        if (snap.exists()) {
          hasCloudSettingsRef.current = true;
          const data = snap.data();
          setSettings((prev) => ({
            ...prev,
            fontSizeArabic: typeof data.fontSizeArabic === 'number' ? data.fontSizeArabic : prev.fontSizeArabic,
            fontSizeTranslation: typeof data.fontSizeTranslation === 'number' ? data.fontSizeTranslation : prev.fontSizeTranslation,
            primaryTranslation: data.primaryTranslation || prev.primaryTranslation,
            secondaryTranslation: data.secondaryTranslation || prev.secondaryTranslation,
            showTransliteration: typeof data.showTransliteration === 'boolean' ? data.showTransliteration : prev.showTransliteration,
            selectedReciterId: data.selectedReciterId || prev.selectedReciterId,
            playbackSpeed: typeof data.playbackSpeed === 'number' ? data.playbackSpeed : prev.playbackSpeed,
            theme: data.theme || prev.theme
          }));
          setProgress({
            lastReadSurah: typeof data.lastReadSurah === 'number' ? data.lastReadSurah : 1,
            lastReadAyah: typeof data.lastReadAyah === 'number' ? data.lastReadAyah : 1,
            lastReadSurahName: data.lastReadSurahName || 'əl-Fatihə',
            updatedAt: toEpochMs(data.updatedAt)
          });
        } else {
          hasCloudSettingsRef.current = false;
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, settingsPath)
    );

    // Migrate any local pre-login notes/journal/highlights/bookmarks once per session login
    if (migratedForUidRef.current !== uid) {
      migratedForUidRef.current = uid;
      const localNotes = readLocalArray<MarginNote>(STORAGE_KEYS.NOTES);
      const localJournal = readLocalArray<JournalEntry>(STORAGE_KEYS.JOURNAL);
      const localHighlights = readLocalArray<VerseHighlight>(STORAGE_KEYS.HIGHLIGHTS);
      const localBookmarks = readLocalArray<Bookmark>(STORAGE_KEYS.BOOKMARKS);

      (async () => {
        try {
          for (const n of localNotes) {
            if (!n.content?.trim()) continue;
            const safeId = n.id.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 120) || `note-${Date.now()}`;
            await setDoc(doc(db, 'users', uid, 'marginNotes', safeId), {
              id: safeId,
              uid,
              surahNumber: n.surahNumber,
              surahName: (n.surahName?.trim() || `Surə ${n.surahNumber}`).slice(0, 100),
              ayahNumber: n.ayahNumber,
              ayahArabic: (n.ayahArabic?.trim() || '—').slice(0, 4000),
              ayahTranslation: (n.ayahTranslation || '').slice(0, 4000),
              content: n.content.trim().slice(0, 10000),
              category: n.category,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          if (localNotes.length > 0) localStorage.removeItem(STORAGE_KEYS.NOTES);

          for (const j of localJournal) {
            if (!j.content?.trim() && !j.title?.trim()) continue;
            const safeId = j.id.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 120) || `journal-${Date.now()}`;
            const safeTitle = (j.title?.trim() || 'Təfəkkür Qeydi').slice(0, 300);
            const payload: Record<string, unknown> = {
              id: safeId,
              uid,
              title: safeTitle,
              category: (j.category?.trim() || 'Şəxsi Təfəkkür').slice(0, 100),
              content: (j.content?.trim() || safeTitle).slice(0, 30000),
              linkedVerses: (j.linkedVerses || []).slice(0, 20),
              tags: (j.tags || []).slice(0, 15).map((t) => String(t).slice(0, 50)).filter(Boolean),
              starred: Boolean(j.starred),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            if (j.reflectionPrompt) {
              payload.reflectionPrompt = j.reflectionPrompt.slice(0, 500);
            }
            await setDoc(doc(db, 'users', uid, 'journalEntries', safeId), payload);
          }
          if (localJournal.length > 0) localStorage.removeItem(STORAGE_KEYS.JOURNAL);

          for (const h of localHighlights) {
            const safeId = `hl-${h.surahNumber}-${h.ayahNumber}`;
            const payload: Record<string, unknown> = {
              id: safeId,
              uid,
              surahNumber: h.surahNumber,
              ayahNumber: h.ayahNumber,
              color: h.color,
              style: h.style || 'both',
              createdAt: serverTimestamp()
            };
            if (h.note) payload.note = h.note.slice(0, 1000);
            await setDoc(doc(db, 'users', uid, 'highlights', safeId), payload);
          }
          if (localHighlights.length > 0) localStorage.removeItem(STORAGE_KEYS.HIGHLIGHTS);

          for (const b of localBookmarks) {
            const safeId = `bm-${b.surahNumber}-${b.ayahNumber}`;
            await setDoc(doc(db, 'users', uid, 'bookmarks', safeId), {
              id: safeId,
              uid,
              surahNumber: b.surahNumber,
              surahName: b.surahName.slice(0, 100),
              ayahNumber: b.ayahNumber,
              arabicText: b.arabicText.slice(0, 4000),
              translation: (b.translation || '').slice(0, 4000),
              createdAt: serverTimestamp()
            });
          }
          if (localBookmarks.length > 0) localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
        } catch (err) {
          console.warn('Local-to-cloud migration note:', err);
        }
      })();
    }

    return () => {
      unsubNotes();
      unsubJournal();
      unsubHighlights();
      unsubBookmarks();
      unsubSettings();
    };
  }, [user, authReady]);

  // Actions for Margin Notes
  const saveMarginNote = useCallback(
    async (
      surahNumber: number,
      surahName: string,
      ayahNumber: number,
      ayahArabic: string,
      ayahTranslation: string,
      content: string,
      category: NoteCategory = 'təfəkkür'
    ) => {
      const cleanContent = content.trim().slice(0, 10000);
      if (!cleanContent) return;

      const existing = marginNotes.find((n) => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber);

      if (user) {
        const uid = user.uid;
        if (existing) {
          const notePath = `users/${uid}/marginNotes/${existing.id}`;
          try {
            await updateDoc(doc(db, 'users', uid, 'marginNotes', existing.id), {
              content: cleanContent,
              category,
              ayahTranslation: (ayahTranslation || '').slice(0, 4000),
              updatedAt: serverTimestamp()
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, notePath);
          }
        } else {
          const newId = `note-${surahNumber}-${ayahNumber}-${Date.now()}`;
          const notePath = `users/${uid}/marginNotes/${newId}`;
          try {
            await setDoc(doc(db, 'users', uid, 'marginNotes', newId), {
              id: newId,
              uid,
              surahNumber,
              surahName: surahName.slice(0, 100),
              ayahNumber,
              ayahArabic: ayahArabic.slice(0, 4000),
              ayahTranslation: (ayahTranslation || '').slice(0, 4000),
              content: cleanContent,
              category,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, notePath);
          }
        }
      } else {
        setMarginNotes((prev) => {
          const idx = prev.findIndex((n) => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], content: cleanContent, category, updatedAt: Date.now() };
            return updated;
          }
          const newNote: MarginNote = {
            id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            surahNumber,
            surahName,
            ayahNumber,
            ayahArabic,
            ayahTranslation,
            content: cleanContent,
            category,
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          return [newNote, ...prev];
        });
      }
    },
    [marginNotes, user]
  );

  const deleteMarginNote = useCallback(
    async (id: string) => {
      if (user) {
        const notePath = `users/${user.uid}/marginNotes/${id}`;
        try {
          await deleteDoc(doc(db, 'users', user.uid, 'marginNotes', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, notePath);
        }
      } else {
        setMarginNotes((prev) => prev.filter((n) => n.id !== id));
      }
    },
    [user]
  );

  const getNoteForAyah = useCallback(
    (surahNumber: number, ayahNumber: number): MarginNote | undefined => {
      return marginNotes.find((n) => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber);
    },
    [marginNotes]
  );

  // Actions for Dedicated Journal
  const createJournalEntry = useCallback(
    (
      title: string,
      category: string,
      content: string,
      linkedVerses: LinkedVerse[] = [],
      tags: string[] = [],
      reflectionPrompt?: string
    ): JournalEntry => {
      const safeId = `journal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const safeTitle = (title.trim() || 'Təfəkkür Qeydi').slice(0, 300);
      const safeCategory = (category.trim() || 'Şəxsi Təfəkkür').slice(0, 100);
      const safeContent = (content.trim() || safeTitle).slice(0, 30000);
      const safeVerses = linkedVerses.slice(0, 20);
      const safeTags = tags.slice(0, 15).map((t) => t.trim().slice(0, 50)).filter(Boolean);

      const newEntry: JournalEntry = {
        id: safeId,
        title: safeTitle,
        category: safeCategory,
        content: safeContent,
        reflectionPrompt: reflectionPrompt?.slice(0, 500),
        linkedVerses: safeVerses,
        tags: safeTags,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        starred: false
      };

      if (user) {
        const uid = user.uid;
        const entryPath = `users/${uid}/journalEntries/${safeId}`;
        const payload: Record<string, unknown> = {
          id: safeId,
          uid,
          title: safeTitle,
          category: safeCategory,
          content: safeContent,
          linkedVerses: safeVerses,
          tags: safeTags,
          starred: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        if (reflectionPrompt) {
          payload.reflectionPrompt = reflectionPrompt.slice(0, 500);
        }
        setDoc(doc(db, 'users', uid, 'journalEntries', safeId), payload).catch((error) =>
          handleFirestoreError(error, OperationType.CREATE, entryPath)
        );
      } else {
        setJournalEntries((prev) => [newEntry, ...prev]);
      }

      return newEntry;
    },
    [user]
  );

  const updateJournalEntry = useCallback(
    async (id: string, updates: Partial<JournalEntry>) => {
      if (user) {
        const uid = user.uid;
        const entryPath = `users/${uid}/journalEntries/${id}`;
        const allowedPayload: Record<string, unknown> = { updatedAt: serverTimestamp() };
        if (updates.title !== undefined) allowedPayload.title = (updates.title.trim() || 'Təfəkkür Qeydi').slice(0, 300);
        if (updates.category !== undefined) allowedPayload.category = (updates.category.trim() || 'Şəxsi Təfəkkür').slice(0, 100);
        if (updates.content !== undefined) allowedPayload.content = (updates.content.trim() || 'Qeyd').slice(0, 30000);
        if (updates.reflectionPrompt !== undefined) allowedPayload.reflectionPrompt = updates.reflectionPrompt.slice(0, 500);
        if (updates.linkedVerses !== undefined) allowedPayload.linkedVerses = updates.linkedVerses.slice(0, 20);
        if (updates.tags !== undefined) allowedPayload.tags = updates.tags.slice(0, 15).map((t) => t.slice(0, 50));
        if (updates.starred !== undefined) allowedPayload.starred = Boolean(updates.starred);

        try {
          await updateDoc(doc(db, 'users', uid, 'journalEntries', id), allowedPayload);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, entryPath);
        }
      } else {
        setJournalEntries((prev) =>
          prev.map((entry) => (entry.id === id ? { ...entry, ...updates, updatedAt: Date.now() } : entry))
        );
      }
    },
    [user]
  );

  const deleteJournalEntry = useCallback(
    async (id: string) => {
      if (user) {
        const entryPath = `users/${user.uid}/journalEntries/${id}`;
        try {
          await deleteDoc(doc(db, 'users', user.uid, 'journalEntries', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, entryPath);
        }
      } else {
        setJournalEntries((prev) => prev.filter((e) => e.id !== id));
      }
    },
    [user]
  );

  const addVerseToJournalEntry = useCallback(
    async (entryId: string, verse: LinkedVerse) => {
      const target = journalEntries.find((e) => e.id === entryId);
      if (!target) return;

      const exists = target.linkedVerses.some(
        (v) => v.surahNumber === verse.surahNumber && v.ayahNumber === verse.ayahNumber
      );
      if (exists) return;

      const updatedVerses = [...target.linkedVerses, verse].slice(0, 20);

      if (user) {
        const entryPath = `users/${user.uid}/journalEntries/${entryId}`;
        try {
          await updateDoc(doc(db, 'users', user.uid, 'journalEntries', entryId), {
            linkedVerses: updatedVerses,
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, entryPath);
        }
      } else {
        setJournalEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, linkedVerses: updatedVerses, updatedAt: Date.now() } : entry
          )
        );
      }
    },
    [journalEntries, user]
  );

  // Actions for Highlights & Underlines
  const setVerseHighlight = useCallback(
    async (
      surahNumber: number,
      ayahNumber: number,
      color: HighlightColor,
      style: 'underline' | 'background' | 'both' = 'both',
      note?: string
    ) => {
      const hlId = `hl-${surahNumber}-${ayahNumber}`;

      if (user) {
        const uid = user.uid;
        const hlPath = `users/${uid}/highlights/${hlId}`;
        const existing = highlights.find((h) => h.surahNumber === surahNumber && h.ayahNumber === ayahNumber);

        if (existing) {
          const updates: Record<string, unknown> = { color, style };
          if (note !== undefined) updates.note = note.slice(0, 1000);
          try {
            await updateDoc(doc(db, 'users', uid, 'highlights', existing.id), updates);
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, hlPath);
          }
        } else {
          const payload: Record<string, unknown> = {
            id: hlId,
            uid,
            surahNumber,
            ayahNumber,
            color,
            style,
            createdAt: serverTimestamp()
          };
          if (note) payload.note = note.slice(0, 1000);
          try {
            await setDoc(doc(db, 'users', uid, 'highlights', hlId), payload);
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, hlPath);
          }
        }
      } else {
        setHighlights((prev) => {
          const filtered = prev.filter((h) => !(h.surahNumber === surahNumber && h.ayahNumber === ayahNumber));
          const newHl: VerseHighlight = {
            id: hlId,
            surahNumber,
            ayahNumber,
            color,
            style,
            note,
            createdAt: Date.now()
          };
          return [...filtered, newHl];
        });
      }
    },
    [highlights, user]
  );

  const removeVerseHighlight = useCallback(
    async (surahNumber: number, ayahNumber: number) => {
      const existing = highlights.find((h) => h.surahNumber === surahNumber && h.ayahNumber === ayahNumber);
      const targetId = existing?.id || `hl-${surahNumber}-${ayahNumber}`;

      if (user) {
        const hlPath = `users/${user.uid}/highlights/${targetId}`;
        try {
          await deleteDoc(doc(db, 'users', user.uid, 'highlights', targetId));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, hlPath);
        }
      } else {
        setHighlights((prev) => prev.filter((h) => !(h.surahNumber === surahNumber && h.ayahNumber === ayahNumber)));
      }
    },
    [highlights, user]
  );

  const getHighlightForAyah = useCallback(
    (surahNumber: number, ayahNumber: number): VerseHighlight | undefined => {
      return highlights.find((h) => h.surahNumber === surahNumber && h.ayahNumber === ayahNumber);
    },
    [highlights]
  );

  // Bookmarks
  const toggleBookmark = useCallback(
    async (
      surahNumber: number,
      surahName: string,
      ayahNumber: number,
      arabicText: string,
      translation: string
    ) => {
      const existing = bookmarks.find((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
      const bmId = existing?.id || `bm-${surahNumber}-${ayahNumber}`;

      if (user) {
        const uid = user.uid;
        const bmPath = `users/${uid}/bookmarks/${bmId}`;
        if (existing) {
          try {
            await deleteDoc(doc(db, 'users', uid, 'bookmarks', bmId));
          } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, bmPath);
          }
        } else {
          try {
            await setDoc(doc(db, 'users', uid, 'bookmarks', bmId), {
              id: bmId,
              uid,
              surahNumber,
              surahName: surahName.slice(0, 100),
              ayahNumber,
              arabicText: arabicText.slice(0, 4000),
              translation: (translation || '').slice(0, 4000),
              createdAt: serverTimestamp()
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, bmPath);
          }
        }
      } else {
        setBookmarks((prev) => {
          const exists = prev.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
          if (exists) {
            return prev.filter((b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber));
          } else {
            const newBm: Bookmark = {
              id: bmId,
              surahNumber,
              surahName,
              ayahNumber,
              arabicText,
              translation,
              createdAt: Date.now()
            };
            return [newBm, ...prev];
          }
        });
      }
    },
    [bookmarks, user]
  );

  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumber: number): boolean => {
      return bookmarks.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
    },
    [bookmarks]
  );

  // Helper to sync settings/progress doc cleanly to Firestore
  const writeCloudSettings = useCallback(
    async (nextSettings: ReadingSettings, nextProgress: ReadingProgress, changedFields: Record<string, unknown>) => {
      if (!user) return;
      const uid = user.uid;
      const settingsPath = `users/${uid}/private/settings`;
      const settingsRef = doc(db, 'users', uid, 'private', 'settings');

      if (!hasCloudSettingsRef.current) {
        hasCloudSettingsRef.current = true;
        try {
          await setDoc(settingsRef, {
            uid,
            fontSizeArabic: nextSettings.fontSizeArabic,
            fontSizeTranslation: nextSettings.fontSizeTranslation,
            primaryTranslation: nextSettings.primaryTranslation,
            secondaryTranslation: nextSettings.secondaryTranslation,
            showTransliteration: nextSettings.showTransliteration,
            selectedReciterId: nextSettings.selectedReciterId.slice(0, 64),
            playbackSpeed: nextSettings.playbackSpeed,
            theme: nextSettings.theme,
            lastReadSurah: nextProgress.lastReadSurah,
            lastReadAyah: nextProgress.lastReadAyah,
            lastReadSurahName: nextProgress.lastReadSurahName.slice(0, 100),
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          hasCloudSettingsRef.current = false;
          handleFirestoreError(error, OperationType.CREATE, settingsPath);
        }
      } else {
        try {
          await updateDoc(settingsRef, {
            ...changedFields,
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, settingsPath);
        }
      }
    },
    [user]
  );

  // Reading Progress update
  const saveReadingProgress = useCallback(
    (surahNumber: number, surahName: string, ayahNumber: number) => {
      const nextProgress: ReadingProgress = {
        lastReadSurah: surahNumber,
        lastReadSurahName: surahName.slice(0, 100),
        lastReadAyah: ayahNumber,
        updatedAt: Date.now()
      };
      setProgress(nextProgress);
      writeCloudSettings(settings, nextProgress, {
        lastReadSurah: surahNumber,
        lastReadAyah: ayahNumber,
        lastReadSurahName: surahName.slice(0, 100)
      });
    },
    [settings, writeCloudSettings]
  );

  // Update Settings
  const updateSettings = useCallback(
    (newSettings: Partial<ReadingSettings>) => {
      setSettings((prev) => {
        const nextSettings = { ...prev, ...newSettings };
        const changedFields: Record<string, unknown> = {};
        if (newSettings.fontSizeArabic !== undefined) changedFields.fontSizeArabic = newSettings.fontSizeArabic;
        if (newSettings.fontSizeTranslation !== undefined) changedFields.fontSizeTranslation = newSettings.fontSizeTranslation;
        if (newSettings.primaryTranslation !== undefined) changedFields.primaryTranslation = newSettings.primaryTranslation;
        if (newSettings.secondaryTranslation !== undefined) changedFields.secondaryTranslation = newSettings.secondaryTranslation;
        if (newSettings.showTransliteration !== undefined) changedFields.showTransliteration = newSettings.showTransliteration;
        if (newSettings.selectedReciterId !== undefined) changedFields.selectedReciterId = newSettings.selectedReciterId.slice(0, 64);
        if (newSettings.playbackSpeed !== undefined) changedFields.playbackSpeed = newSettings.playbackSpeed;
        if (newSettings.theme !== undefined) changedFields.theme = newSettings.theme;

        writeCloudSettings(nextSettings, progress, changedFields);
        return nextSettings;
      });
    },
    [progress, writeCloudSettings]
  );

  // Export all user data as JSON
  const exportUserData = useCallback(() => {
    const data = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      accountEmail: user?.email || 'yerli-istifadeci',
      marginNotes,
      journalEntries,
      highlights,
      bookmarks,
      progress
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nun_quran_qeydler_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [marginNotes, journalEntries, highlights, bookmarks, progress, user]);

  return {
    marginNotes,
    saveMarginNote,
    deleteMarginNote,
    getNoteForAyah,

    journalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addVerseToJournalEntry,

    highlights,
    setVerseHighlight,
    removeVerseHighlight,
    getHighlightForAyah,

    bookmarks,
    toggleBookmark,
    isBookmarked,

    settings,
    updateSettings,

    progress,
    saveReadingProgress,

    exportUserData,
    cloudSynced
  };
}

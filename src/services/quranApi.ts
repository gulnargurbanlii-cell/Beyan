import { Ayah, QuranSearchResult, TranslationKey } from '../types';
import { OFFLINE_SURAHS } from '../data/sampleQuranData';
import { SURAH_LIST } from '../data/quranMetadata';
import { RECITERS } from '../data/reciters';

// Format numbers to 3 digits e.g. 1 -> "001"
export function padZero(num: number, size: number = 3): string {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

// Audio URL builder using EveryAyah
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterId: string = 'alafasy'): string {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const sStr = padZero(surahNumber, 3);
  const aStr = padZero(ayahNumber, 3);
  return `https://everyayah.com/data/${reciter.subfolder}/${sStr}${aStr}.mp3`;
}

// Surah full audio link
export function getSurahAudioUrl(surahNumber: number): string {
  const sStr = padZero(surahNumber, 3);
  return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${sStr}.mp3`;
}

// In-memory runtime cache for fetched surahs
const runtimeCache: Record<number, Ayah[]> = {};

export async function fetchSurahData(surahNumber: number): Promise<{ ayahs: Ayah[]; source: 'offline' | 'cache' | 'network' }> {
  // 1. Check runtime cache
  if (runtimeCache[surahNumber]) {
    return { ayahs: runtimeCache[surahNumber], source: 'cache' };
  }

  // 2. Check localStorage cache
  try {
    const localSaved = localStorage.getItem(`bayan_surah_${surahNumber}`);
    if (localSaved) {
      const parsed = JSON.parse(localSaved) as Ayah[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        runtimeCache[surahNumber] = parsed;
        return { ayahs: parsed, source: 'cache' };
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  // 3. Check offline pre-loaded data first if available
  if (OFFLINE_SURAHS[surahNumber]) {
    runtimeCache[surahNumber] = OFFLINE_SURAHS[surahNumber];
    return { ayahs: OFFLINE_SURAHS[surahNumber], source: 'offline' };
  }

  // 4. Fetch from Al-Quran Cloud API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const editions = 'quran-uthmani,az.mammadaliyev,az.musayev,en.sahih,tr.diyanet,ru.kuliev';
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/${editions}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const json = await response.json();
    if (!json.data || !Array.isArray(json.data) || json.data.length === 0) {
      throw new Error('Invalid Quran data format');
    }

    const arabicEd = json.data[0];
    const mamEd = json.data[1];
    const musEd = json.data[2];
    const enEd = json.data[3];
    const trEd = json.data[4];
    const ruEd = json.data[5];

    const ayahsCount = arabicEd.ayahs.length;
    const ayahs: Ayah[] = [];

    for (let i = 0; i < ayahsCount; i++) {
      const arAyah = arabicEd.ayahs[i];
      const ayahNum = arAyah.numberInSurah;

      ayahs.push({
        numberInSurah: ayahNum,
        globalNumber: arAyah.number,
        arabicText: arAyah.text,
        translations: {
          az_mammadaliyev: mamEd?.ayahs[i]?.text || 'Tərcümə yüklənir...',
          az_musayev: musEd?.ayahs[i]?.text || mamEd?.ayahs[i]?.text || '',
          en_sahih: enEd?.ayahs[i]?.text || '',
          tr_diyanet: trEd?.ayahs[i]?.text || '',
          ru_kuliev: ruEd?.ayahs[i]?.text || ''
        },
        juz: arAyah.juz,
        page: arAyah.page,
        sajda: Boolean(arAyah.sajda)
      });
    }

    runtimeCache[surahNumber] = ayahs;
    try {
      localStorage.setItem(`bayan_surah_${surahNumber}`, JSON.stringify(ayahs));
    } catch {
      // ignore storage quota
    }

    return { ayahs, source: 'network' };
  } catch (error) {
    console.error('Failed to fetch surah online:', error);
    if (OFFLINE_SURAHS[surahNumber]) {
      return { ayahs: OFFLINE_SURAHS[surahNumber], source: 'offline' };
    }
    throw error;
  }
}

// ==========================================
// FULL QURAN WORD & PHRASE SEARCH ENGINE
// ==========================================

export type SearchEdition = TranslationKey | 'ar_uthmani';

const TRANSLATION_TO_API_EDITION: Record<SearchEdition, string> = {
  az_mammadaliyev: 'az.mammadaliyev',
  az_musayev: 'az.musayev',
  tr_diyanet: 'tr.diyanet',
  en_sahih: 'en.sahih',
  ru_kuliev: 'ru.kuliev',
  ar_uthmani: 'quran-uthmani'
};

interface IndexedAyahRecord {
  surahNumber: number;
  ayahNumber: number;
  text: string;
  textLower: string;
  textNormalized: string;
}

const fullQuranMemoryCache: Partial<Record<string, IndexedAyahRecord[]>> = {};

// Normalize Azerbaijani/Turkish/Arabic diacritics for forgiving search (e.g. "ibadet" matches "ibadət", Arabic without harakat)
export function normalizeForSearch(input: string): string {
  return input
    .toLocaleLowerCase('az-AZ')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Strip Arabic tashkeel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/\s+/g, ' ')
    .trim();
}

// IndexedDB helper for caching full Quran editions (~1.5MB each) so searches stay instant across reloads
function openSearchDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open('nun_quran_search_db', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('editions')) {
        db.createObjectStore('editions');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCachedEdition(editionApiId: string): Promise<IndexedAyahRecord[] | null> {
  if (fullQuranMemoryCache[editionApiId]) {
    return fullQuranMemoryCache[editionApiId]!;
  }
  try {
    const db = await openSearchDB();
    return await new Promise((resolve) => {
      const tx = db.transaction('editions', 'readonly');
      const store = tx.objectStore('editions');
      const getReq = store.get(editionApiId);
      getReq.onsuccess = () => {
        const data = getReq.result as IndexedAyahRecord[] | undefined;
        if (data && Array.isArray(data) && data.length > 6000) {
          fullQuranMemoryCache[editionApiId] = data;
          resolve(data);
        } else {
          resolve(null);
        }
      };
      getReq.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveCachedEdition(editionApiId: string, records: IndexedAyahRecord[]): Promise<void> {
  fullQuranMemoryCache[editionApiId] = records;
  try {
    const db = await openSearchDB();
    const tx = db.transaction('editions', 'readwrite');
    tx.objectStore('editions').put(records, editionApiId);
  } catch {
    // Ignore IDB storage failures
  }
}

async function loadFullEditionIndex(editionApiId: string): Promise<IndexedAyahRecord[]> {
  const cached = await getCachedEdition(editionApiId);
  if (cached) return cached;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000);
  const response = await fetch(`https://api.alquran.cloud/v1/quran/${editionApiId}`, {
    signal: controller.signal
  });
  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Axtarış bazası yüklənə bilmədi (status ${response.status})`);
  }

  const json = await response.json();
  const surahs = json?.data?.surahs;
  if (!Array.isArray(surahs) || surahs.length === 0) {
    throw new Error('Yanlış Quran məlumat formatı');
  }

  const records: IndexedAyahRecord[] = [];
  for (const surah of surahs) {
    const surahNum = Number(surah.number);
    for (const ayah of surah.ayahs || []) {
      const txt = String(ayah.text || '');
      records.push({
        surahNumber: surahNum,
        ayahNumber: Number(ayah.numberInSurah),
        text: txt,
        textLower: txt.toLocaleLowerCase('az-AZ'),
        textNormalized: normalizeForSearch(txt)
      });
    }
  }

  await saveCachedEdition(editionApiId, records);
  return records;
}

export interface QuranSearchResponse {
  results: QuranSearchResult[];
  totalMatches: number;
  matchedSurahs: typeof SURAH_LIST;
  directRef: { surahNumber: number; ayahNumber: number } | null;
  source: 'full_index' | 'offline_fallback';
}

export async function searchQuranCatalog(
  rawQuery: string,
  edition: SearchEdition = 'az_mammadaliyev',
  limit: number = 120
): Promise<QuranSearchResponse> {
  const query = rawQuery.trim();
  if (!query) {
    return { results: [], totalMatches: 0, matchedSurahs: [], directRef: null, source: 'full_index' };
  }

  // 1. Check if user typed a direct reference like "2:255", "94 5", or "Nisa 36"
  let directRef: { surahNumber: number; ayahNumber: number } | null = null;
  const numRefMatch = query.match(/^(\d{1,3})\s*[:./\-\s]\s*(\d{1,3})$/);
  if (numRefMatch) {
    const sNum = Number(numRefMatch[1]);
    const aNum = Number(numRefMatch[2]);
    const sMeta = SURAH_LIST.find(s => s.id === sNum);
    if (sMeta && aNum >= 1 && aNum <= sMeta.versesCount) {
      directRef = { surahNumber: sNum, ayahNumber: aNum };
    }
  } else {
    // Check "SurahName AyahNumber" e.g. "Nisa 36" or "Bəqərə 255"
    const nameRefMatch = query.match(/^([^\d]+?)\s+(\d{1,3})$/);
    if (nameRefMatch) {
      const namePart = normalizeForSearch(nameRefMatch[1]);
      const aNum = Number(nameRefMatch[2]);
      const foundSurah = SURAH_LIST.find(s =>
        normalizeForSearch(s.transliteration).includes(namePart) ||
        normalizeForSearch(s.englishName).includes(namePart) ||
        normalizeForSearch(s.meaningAz).includes(namePart)
      );
      if (foundSurah && aNum >= 1 && aNum <= foundSurah.versesCount) {
        directRef = { surahNumber: foundSurah.id, ayahNumber: aNum };
      }
    }
  }

  // 2. Match Surahs by name, meaning, or number
  const normalizedQuery = normalizeForSearch(query);
  const lowerQuery = query.toLocaleLowerCase('az-AZ');

  const matchedSurahs = SURAH_LIST.filter(s =>
    s.id.toString() === query ||
    normalizeForSearch(s.transliteration).includes(normalizedQuery) ||
    normalizeForSearch(s.englishName).includes(normalizedQuery) ||
    normalizeForSearch(s.meaningAz).includes(normalizedQuery) ||
    s.name.includes(query)
  );

  // 3. Search verses across full Quran (and Arabic index so results display Arabic + translation)
  try {
    const editionApiId = TRANSLATION_TO_API_EDITION[edition];
    const [targetRecords, arabicRecords] = await Promise.all([
      loadFullEditionIndex(editionApiId),
      editionApiId === 'quran-uthmani' ? Promise.resolve(null) : loadFullEditionIndex('quran-uthmani')
    ]);

    // Build quick lookup map for Arabic text by "surah:ayah"
    const arabicMap = new Map<string, string>();
    if (arabicRecords) {
      for (const rec of arabicRecords) {
        arabicMap.set(`${rec.surahNumber}:${rec.ayahNumber}`, rec.text);
      }
    }

    // If user searched in Arabic, also load az_mammadaliyev so they see the meaning alongside Arabic
    const azRecords = editionApiId === 'quran-uthmani'
      ? await loadFullEditionIndex('az.mammadaliyev')
      : null;
    const azMap = new Map<string, string>();
    if (azRecords) {
      for (const rec of azRecords) {
        azMap.set(`${rec.surahNumber}:${rec.ayahNumber}`, rec.text);
      }
    }

    const exactHits: IndexedAyahRecord[] = [];
    const normalizedHits: IndexedAyahRecord[] = [];

    for (const rec of targetRecords) {
      if (rec.textLower.includes(lowerQuery)) {
        exactHits.push(rec);
      } else if (normalizedQuery.length >= 2 && rec.textNormalized.includes(normalizedQuery)) {
        normalizedHits.push(rec);
      }
    }

    const combinedHits = [...exactHits, ...normalizedHits];
    const totalMatches = combinedHits.length;

    const results: QuranSearchResult[] = combinedHits.slice(0, limit).map(hit => {
      const sMeta = SURAH_LIST.find(s => s.id === hit.surahNumber) || SURAH_LIST[0];
      const key = `${hit.surahNumber}:${hit.ayahNumber}`;
      return {
        surahNumber: hit.surahNumber,
        surahName: sMeta.transliteration,
        surahArabicName: sMeta.name,
        ayahNumber: hit.ayahNumber,
        arabicText: editionApiId === 'quran-uthmani' ? hit.text : (arabicMap.get(key) || ''),
        translationText: editionApiId === 'quran-uthmani' ? (azMap.get(key) || '') : hit.text,
        revelationType: sMeta.revelationType
      };
    });

    return { results, totalMatches, matchedSurahs, directRef, source: 'full_index' };
  } catch (err) {
    console.warn('Full Quran index unavailable, using offline fallback:', err);

    // Offline fallback across OFFLINE_SURAHS
    const fallbackResults: QuranSearchResult[] = [];
    const transKey: TranslationKey = edition === 'ar_uthmani' ? 'az_mammadaliyev' : edition;

    for (const [sIdStr, ayahs] of Object.entries(OFFLINE_SURAHS)) {
      const sId = Number(sIdStr);
      const sMeta = SURAH_LIST.find(s => s.id === sId);
      if (!sMeta) continue;
      for (const ayah of ayahs) {
        const txt = ayah.translations[transKey] || '';
        const haystack = edition === 'ar_uthmani' ? ayah.arabicText : txt;
        if (
          haystack.toLocaleLowerCase('az-AZ').includes(lowerQuery) ||
          normalizeForSearch(haystack).includes(normalizedQuery)
        ) {
          fallbackResults.push({
            surahNumber: sId,
            surahName: sMeta.transliteration,
            surahArabicName: sMeta.name,
            ayahNumber: ayah.numberInSurah,
            arabicText: ayah.arabicText,
            translationText: txt,
            revelationType: sMeta.revelationType
          });
        }
      }
    }

    return {
      results: fallbackResults.slice(0, limit),
      totalMatches: fallbackResults.length,
      matchedSurahs,
      directRef,
      source: 'offline_fallback'
    };
  }
}

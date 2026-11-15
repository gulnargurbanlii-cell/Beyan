import React, { useEffect, useRef, useState } from 'react';
import { Reciter } from '../types';
import { RECITERS } from '../data/reciters';
import { SURAH_LIST } from '../data/quranMetadata';
import { getAyahAudioUrl } from '../services/quranApi';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  X,
  Radio
} from 'lucide-react';

interface AudioPlayerDockProps {
  currentPlaying: { surahNumber: number; ayahNumber: number } | null;
  selectedReciterId: string;
  onSelectReciter: (reciterId: string) => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onClosePlayer: () => void;
}

export const AudioPlayerDock: React.FC<AudioPlayerDockProps> = ({
  currentPlaying,
  selectedReciterId,
  onSelectReciter,
  onNextAyah,
  onPrevAyah,
  onClosePlayer
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoopingAyah, setIsLoopingAyah] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const activeReciter = RECITERS.find(r => r.id === selectedReciterId) || RECITERS[0];
  const surahMeta = currentPlaying ? SURAH_LIST.find(s => s.id === currentPlaying.surahNumber) : null;

  // Whenever currentPlaying or selectedReciterId changes, load and play audio
  useEffect(() => {
    if (!currentPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    const audioUrl = getAyahAudioUrl(
      currentPlaying.surahNumber,
      currentPlaying.ayahNumber,
      selectedReciterId
    );

    if (audioRef.current) {
      setAudioError(false);
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn('Auto-play blocked or audio load error:', err);
          setIsPlaying(false);
        });
    }
  }, [currentPlaying, selectedReciterId]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (isLoopingAyah) {
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } else {
        // Automatically progress to next ayah!
        onNextAyah();
      }
    };
    const onError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [isLoopingAyah, onNextAyah]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!currentPlaying) return null;

  const formatSecs = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-stone-900 text-stone-100 border-t border-stone-800 shadow-2xl py-3 px-4 sm:px-6 transition-all">
      <audio ref={audioRef} />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300 font-bold font-serif-sacred shrink-0">
            {currentPlaying.ayahNumber}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white truncate">
                {surahMeta?.transliteration} surəsi
              </span>
              <span className="text-xs text-amber-400 font-mono">
                {currentPlaying.ayahNumber}-ci ayə
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Radio className="w-3 h-3 text-emerald-400" />
              <select
                value={selectedReciterId}
                onChange={(e) => onSelectReciter(e.target.value)}
                className="bg-transparent text-stone-300 text-xs focus:outline-none cursor-pointer hover:text-white"
              >
                {RECITERS.map(r => (
                  <option key={r.id} value={r.id} className="bg-stone-900 text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={onClosePlayer}
            className="sm:hidden p-1.5 text-stone-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Controls & Timeline */}
        <div className="flex flex-col items-center gap-1.5 w-full sm:w-80">
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevAyah}
              className="p-1.5 text-stone-400 hover:text-white transition-colors"
              title="Əvvəlki ayə"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center transition-transform active:scale-95 shadow-md"
              title={isPlaying ? 'Dayandır' : 'Oxut'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-stone-950" />
              ) : (
                <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={onNextAyah}
              className="p-1.5 text-stone-400 hover:text-white transition-colors"
              title="Növbəti ayə"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Simple progress indicator */}
          <div className="w-full flex items-center gap-2 text-[10px] text-stone-400 font-mono">
            <span>{formatSecs(currentTime)}</span>
            <div className="flex-1 h-1 bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span>{formatSecs(duration)}</span>
          </div>

          {audioError && (
            <span className="text-[10px] text-rose-400">
              Səs faylı yüklənə bilmədi (növbəti ayəyə keçin)
            </span>
          )}
        </div>

        {/* Secondary controls (Speed, Repeat, Mute, Close) */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setIsLoopingAyah(!isLoopingAyah)}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
              isLoopingAyah ? 'text-amber-300 bg-stone-800' : 'text-stone-400 hover:text-white'
            }`}
            title={isLoopingAyah ? 'Bu ayə təkrar edilir' : 'Ayə təkrarını aç'}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="text-[11px]">Təkrar</span>
          </button>

          <button
            onClick={handleSpeedChange}
            className="px-2 py-1 rounded bg-stone-800 text-[11px] font-mono text-stone-300 hover:text-white"
            title="Sürəti dəyiş"
          >
            {playbackSpeed}x
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 text-stone-400 hover:text-white"
            title={isMuted ? 'Səsi aç' : 'Səsi bağla'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClosePlayer}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg ml-1"
            title="Pleyeri bağla"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

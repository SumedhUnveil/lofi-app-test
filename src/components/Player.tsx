import React, { useRef, useState } from 'react';
import { useLofiTracks } from '../hooks/useLofiTracks';
import Sheet from './ui/sheet';
import ReactAudioSpectrum from 'react-audio-spectrum';
import rainSound from '../assets/rain.mp3';

const Player: React.FC = () => {
  const { tracks: fetchedTracks, loading, error } = useLofiTracks(10);
  const [tracks, setTracks] = useState<any[]>([]);
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [rainOn, setRainOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sync local tracks with fetched tracks
  React.useEffect(() => {
    setTracks(fetchedTracks);
  }, [fetchedTracks]);

  // Play/pause handler
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying((v) => !v);
  };

  // Next track
  const handleNext = () => {
    setSelected((prev) => (tracks.length ? (prev + 1) % tracks.length : 0));
    setIsPlaying(true);
  };

  // Previous track
  const handlePrev = () => {
    setSelected((prev) => (tracks.length ? (prev - 1 + tracks.length) % tracks.length : 0));
    setIsPlaying(false);
  };

  // When track changes, auto play if was playing
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
    // eslint-disable-next-line
  }, [selected]);

  // When play/pause state changes, sync with audio element
  React.useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Auto-play next track when current ends
  const handleEnded = () => {
    setSelected((prev) => (tracks.length ? (prev + 1) % tracks.length : 0));
    setIsPlaying(true);
  };

  // Reorder tracks
  const handleReorder = (from: number, to: number) => {
    if (to < 0 || to >= tracks.length) return;
    const newTracks = [...tracks];
    [newTracks[from], newTracks[to]] = [newTracks[to], newTracks[from]];
    setTracks(newTracks);
    // Update selected index if needed
    if (selected === from) setSelected(to);
    else if (selected === to) setSelected(from);
  };

  // Rain toggle logic
  const handleRainToggle = () => {
    setRainOn((v) => {
      const next = !v;
      if (rainRef.current) {
        if (next) {
          rainRef.current.volume = 0.3;
          rainRef.current.loop = true;
          rainRef.current.play().catch(() => {});
        } else {
          rainRef.current.pause();
          rainRef.current.currentTime = 0;
        }
      }
      return next;
    });
  };

  const current = tracks[selected];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232733] via-[#232733] to-[#181a20] dark:bg-gradient-to-br dark:from-[#232733] dark:via-[#232733] dark:to-[#181a20]">
      {/* Sidebar Button */}
      <button className="fixed top-6 left-6 px-4 py-2 rounded-lg bg-pink-200 hover:bg-pink-300 text-pink-900 font-semibold shadow-lg z-20" title="Open Sidebar" onClick={() => setSidebarOpen(true)}>
        ☰ Tracks
      </button>
      <div className="relative w-[370px] rounded-3xl bg-black/60 dark:bg-black/70 shadow-2xl backdrop-blur-xl p-8 flex flex-col items-center">
        {/* Top row: Heart and Sun (settings/theme) */}
        <div className="absolute top-5 left-5">
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl shadow">
            <span role="img" aria-label="favorite">❤</span>
          </button>
        </div>
        <div className="absolute top-5 right-5">
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl shadow">
            <span role="img" aria-label="theme">☀️</span>
          </button>
        </div>
        {/* Visualizer or Album Art */}
        {current && !loading && (
          showVisualizer ? (
            <ReactAudioSpectrum
              id="audio-spectrum"
              height={120}
              width={320}
              audioId="audio-element"
              capColor={'#fff'}
              capHeight={2}
              meterWidth={8}
              meterCount={48}
              meterColor={[
                { stop: 0, color: '#fbcfe8' },
                { stop: 0.33, color: '#ddd6fe' },
                { stop: 0.66, color: '#a7f3d0' },
                { stop: 1, color: '#bae6fd' }
              ]}
              gap={4}
            />
          ) : (
            <img src={current.cover} alt={current.title} className="w-32 h-32 rounded-2xl shadow-lg object-cover mb-6 mt-2" />
          )
        )}
        {/* Track Info */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-sm text-gray-400 mb-1">{current?.artist}</div>
          <div className="text-xl font-bold text-white text-center leading-tight mb-1">{current?.title}</div>
        </div>
        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-4">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl shadow-lg" onClick={handlePrev} disabled={loading || !tracks.length}>
            <span role="img" aria-label="previous">⏮️</span>
          </button>
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-3xl shadow-xl border-4 border-white/10" onClick={handlePlayPause} disabled={loading || !tracks.length}>
            {isPlaying ? <span role="img" aria-label="pause">❚❚</span> : <span role="img" aria-label="play">►</span>}
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl shadow-lg" onClick={handleNext} disabled={loading || !tracks.length}>
            <span role="img" aria-label="next">⏭️</span>
          </button>
        </div>
        {/* Extra Controls: Rain & Visualizer */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded bg-blue-200 hover:bg-blue-300 text-blue-900 font-medium shadow ${rainOn ? 'ring-2 ring-blue-400' : ''}`}
            title="Toggle Rain"
            onClick={handleRainToggle}
          >
            {rainOn ? 'Rain On' : 'Rain Off'}
          </button>
          <button
            className={`px-4 py-2 rounded bg-purple-200 hover:bg-purple-300 text-purple-900 font-medium shadow ${showVisualizer ? 'ring-2 ring-purple-400' : ''}`}
            title="Toggle Visualizer"
            onClick={() => setShowVisualizer(v => !v)}
            disabled={loading || !tracks.length}
          >
            {showVisualizer ? 'Hide Visualizer' : 'Show Visualizer'}
          </button>
        </div>
        {/* Progress Bar */}
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center w-full mb-1">
            <span className="text-xs text-gray-400 w-10 text-left" id="current-time">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={e => {
                const time = Number(e.target.value);
                setCurrentTime(time);
                if (audioRef.current) audioRef.current.currentTime = time;
              }}
              className="flex-1 mx-2 accent-yellow-300 h-1 rounded-lg bg-gray-700/60"
              style={{ accentColor: '#ffe082' }}
              disabled={duration === 0}
            />
            <span className="text-xs text-gray-400 w-10 text-right" id="duration">{formatTime(duration)}</span>
          </div>
          <div className="flex justify-center w-full mt-1">
            <button className="text-gray-400 hover:text-yellow-300 text-xl mx-auto" title="Repeat" disabled>
              <span role="img" aria-label="repeat">🔁</span>
            </button>
          </div>
        </div>
        {/* Audio element (hidden) */}
        {current && (
          <audio
            ref={audioRef}
            id="audio-element"
            src={current.preview}
            onEnded={handleEnded}
            preload="auto"
            crossOrigin="anonymous"
            style={{ display: 'none' }}
            onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
          />
        )}
        {/* Rain audio element (hidden) */}
        <audio ref={rainRef} src={rainSound} preload="auto" className="hidden" loop />
      </div>
      {/* Sidebar/Sheet for track list and reordering */}
      <Sheet
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        tracks={tracks}
        selected={selected}
        onSelect={(idx: number) => { setSelected(idx); setSidebarOpen(false); }}
        onReorder={handleReorder}
      />
    </div>
  );
};

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default Player; 
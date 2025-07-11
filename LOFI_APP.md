# LofiMusic App – Architecture & Features

## Overview
LofiMusic is a modern, glassmorphic, and interactive web music player focused on lofi tracks. It features a beautiful, animated UI, a responsive player, a sidebar for track selection and reordering, and a real-time audio visualizer. The app is built with React, TypeScript, and Vite, and leverages Tailwind CSS for styling and Radix UI for accessible UI primitives.

---

## Features

- **Lofi Track Streaming:** Fetches lofi tracks from the Deezer API (via a CORS proxy), displaying cover art, artist, album, and a 30-second preview.
- **Animated Visualizer:** Real-time audio spectrum visualizer using `react-audio-spectrum`, styled with a pastel color palette matching the app's blobs.
- **Glassmorphic UI:** Uses backdrop blur, translucency, and animated pastel blobs for a modern, frosted-glass look.
- **Responsive Design:** Works on both desktop and mobile, with a collapsible sidebar for track selection.
- **Track Reordering:** Users can reorder tracks in the sidebar using up/down arrows; the order persists in local state.
- **Auto-Play Next Track:** When a track ends, the next track auto-plays (wraps around at the end).
- **Rain Sound Toggle:** Optional rain ambience can be toggled on/off, playing in the background.
- **Album Art/Visualizer Toggle:** Users can switch between album art and the visualizer view.
- **Progress Bar & Seeking:** Interactive waveform/progress bar allows seeking within the track.
- **Track Info:** Displays current track's cover, title, artist, and album.
- **Sidebar Sheet:** Track list is shown in a Radix UI Sheet (slide-over panel) on all screen sizes.
- **Glassmorphic Overlay:** A translucent overlay sits above the animated blobs, enhancing the glass effect.
- **Pastel Animated Blobs:** Multiple animated SVG blobs move in the background, using a pastel palette (pink, purple, teal, light blue).
- **Theme Toggle:** Light and dark mode support via context and Tailwind CSS.

---

## Architecture & Folder Structure

```
LofiMusic/
  src/
    components/
      Player.tsx         # Main player UI and logic
      ui/
        sheet.tsx        # Sidebar/Sheet component (Radix UI)
    hooks/
      useLofiTracks.ts   # Custom hook for fetching lofi tracks
      useStations.ts     # (Stub) Custom hook for radio stations (not fully implemented)
    utils/
      deezerApi.ts       # Deezer API integration and data mapping
    context/
      ThemeContext.tsx   # Theme (light/dark) context provider
    assets/
      rain.mp3           # Local rain ambience audio
      react.svg          # React logo asset
    index.css            # Tailwind, glassmorphism, blob animations
    App.tsx              # App entry, renders Player
    main.tsx             # ReactDOM entry point
    ...
  package.json
  tailwind.config.js
  postcss.config.cjs
  ...
```

---

## Main Components

### Player
- Manages track list, selected track, play/pause, progress, rain toggle, view (album/visualizer), and reordering.
- Uses `<audio>` for playback and `<ReactAudioSpectrum />` for visualization.
- `<audio>` element is configured with `crossOrigin="anonymous"` and is hidden via `style={{ display: 'none' }}` for seamless playback and visualizer support.
- Sidebar (Radix UI Sheet) for track list, selection, and reordering.
- Controls: Play/pause, next/prev, rain toggle, progress bar.
- Animated pastel blobs and glass overlay for background.

#### Example: Using `react-audio-spectrum` for Visualization
```jsx
<ReactAudioSpectrum
  id="audio-spectrum"
  height={256}
  width={820}
  audioId="audio-element"
  capColor={'#fff'}
  capHeight={2}
  meterWidth={10}
  meterCount={100}
  meterColor={[
    { stop: 0, color: '#fbcfe8' }, // pastel pink
    { stop: 0.33, color: '#ddd6fe' }, // pastel purple
    { stop: 0.66, color: '#a7f3d0' }, // pastel teal
    { stop: 1, color: '#bae6fd' } // pastel light blue
  ]}
  gap={4}
/>
```

#### Example: Rain Sound Toggle Logic
```jsx
const [rainOn, setRainOn] = useState(false);
const rainRef = useRef<HTMLAudioElement | null>(null);

<button onClick={() => {
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
}}>
  Toggle Rain
</button>
<audio ref={rainRef} src={rainSound} preload="auto" className="hidden" loop />
```

#### Example: Track Reordering in Sidebar
```jsx
<button
  onClick={e => {
    e.stopPropagation();
    if (i > 0) {
      const newTracks = [...tracks];
      [newTracks[i-1], newTracks[i]] = [newTracks[i], newTracks[i-1]];
      setTracks(newTracks);
      if (selected === i) setSelected(i-1);
      else if (selected === i-1) setSelected(i);
    }
  }}
  disabled={i === 0}
>
  ▲
</button>
<button
  onClick={e => {
    e.stopPropagation();
    if (i < tracks.length-1) {
      const newTracks = [...tracks];
      [newTracks[i+1], newTracks[i]] = [newTracks[i], newTracks[i+1]];
      setTracks(newTracks);
      if (selected === i) setSelected(i+1);
      else if (selected === i+1) setSelected(i);
    }
  }}
  disabled={i === tracks.length-1}
>
  ▼
</button>
```

### Sheet (Sidebar)
- Radix UI Sheet: Slide-over panel for track list, always available on all screen sizes.
- Track List: Shows cover, title, artist, album, and up/down arrows for reordering.
- Selection: Clicking a track selects and plays it.

### Visualizer
- `react-audio-spectrum`: Audio visualizer with pastel pink, purple, teal, and light blue gradient.
- Responsive: Sized to fit main content area, only visible in visualizer view.

### Rain Sound
- `rain.mp3`: Local asset, toggled on/off, plays in loop at low volume.

### Theme Context
- Light/dark mode toggle using React context and Tailwind CSS.

#### Example: Theme Context Usage
```jsx
const { theme, toggleTheme } = useTheme();
<button onClick={toggleTheme}>
  Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
</button>
```

---

## CSS & Animations

- **index.css:** Contains custom properties for theme, glassmorphism, and blob keyframes.
- **Blob Animations:** Classes like `.animate-blob1`, `.animate-blob2`, `.animate-blob3` define different durations and transforms for animated pastel blobs.
- **Glass Overlay:** Uses `.bg-white/20` with `backdrop-blur-2xl` for a frosted glass effect.
- **Custom Scrollbar:** For horizontal track list.
- **Fade-in Animation:** For smooth content appearance.

---

## API & Data

### Deezer API
- **Endpoint:** `https://api.deezer.com/search?q=lofi&limit={limit}`
- **Proxy:** All requests are routed through `https://corsproxy.io/?{encoded_url}` for browser compatibility.
- **Data Mapping:** Each track is mapped to:
  - `id`: number
  - `title`: string
  - `artist`: string
  - `album`: string
  - `cover`: string (album cover image)
  - `preview`: string (30s audio preview)
  - `duration`: number (seconds)

#### Example: Fetching Lofi Tracks
```ts
export async function fetchLofiTracks(limit = 10): Promise<DeezerTrack[]> {
  const url = `https://api.deezer.com/search?q=lofi&limit=${limit}`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error('Failed to fetch tracks from Deezer');
  const data = await res.json();
  if (!Array.isArray(data.data)) throw new Error('Invalid Deezer response');
  return data.data.map((track: any) => ({
    id: track.id,
    title: track.title,
    artist: track.artist.name,
    album: track.album.title,
    cover: track.album.cover_medium,
    preview: track.preview,
    duration: track.duration,
  }));
}
```

### Custom Hooks
- `useLofiTracks(limit: number)` – Fetches and returns `{ tracks, loading, error }` for lofi tracks.
- `useStations(limit: number)` – (Stub) Intended for radio stations, not fully implemented.

#### Example: useLofiTracks Hook
```ts
export function useLofiTracks(limit = 10) {
  const [tracks, setTracks] = useState<DeezerTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchLofiTracks(limit)
      .then((data: DeezerTrack[]) => {
        setTracks(data);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message || 'Error fetching tracks');
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return { tracks, loading, error };
}
```

---

## UI Libraries & Design Language

- **React** (with hooks, functional components)
- **TypeScript** (strict typing)
- **Vite** (dev/build tool)
- **Tailwind CSS** (utility-first, custom theme, glassmorphism, pastel palette)
- **tw-animate-css** (for custom animations)
- **Radix UI** (`@radix-ui/react-dialog` for Sheet/Sidebar)
- **react-audio-spectrum** (audio visualizer)
- **Lucide React** (icon set)
- **Custom CSS** for animated blobs and glassmorphic overlay

### Design Language
- **Glassmorphism:** Uses `backdrop-blur`, semi-transparent backgrounds, and soft borders.
- **Pastel Colors:** Pink, purple, teal, and light blue dominate the palette.
- **Animated Blobs:** SVG blobs with blur and opacity animate in the background.
- **Modern UI:** Rounded corners, soft shadows, and smooth transitions.
- **Accessibility:** Uses Radix UI for accessible dialogs/sheets, and semantic HTML.

---

## Notable Details

- No genre filtering (tracks do not have genre info from Deezer API).
- Track reordering is local to the session (not persisted).
- Auto-play next track wraps to the first track at the end.
- Visualizer and album art are toggled via UI buttons.
- All network requests are proxied for CORS.
- No authentication or user accounts.
- No server-side code; all client-side.

---

## How to Recreate

- Use React + TypeScript + Vite.
- Use Tailwind CSS for all styling, with custom theme for glassmorphism and pastels.
- Use Radix UI for Sheet/Sidebar.
- Use react-audio-spectrum for the visualizer.
- Fetch tracks from Deezer API (with CORS proxy).
- Implement animated pastel blobs and glass overlay in the background.
- Implement all features and UI as described above. 
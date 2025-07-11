export type DeezerTrack = {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  preview: string;
  duration: number;
};

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
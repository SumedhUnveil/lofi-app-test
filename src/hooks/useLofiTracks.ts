import { useState, useEffect } from 'react';
import { fetchLofiTracks } from '../utils/deezerApi';
import type { DeezerTrack } from '../utils/deezerApi';

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
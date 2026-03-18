'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tattoobase_saved_artists';

export function useSavedArtists() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedIds(new Set(JSON.parse(raw)));
    } catch {}
    setMounted(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: string) => savedIds.has(id),
    [savedIds]
  );

  const getAllSaved = useCallback(
    () => [...savedIds],
    [savedIds]
  );

  return { isSaved, toggle, getAllSaved, mounted };
}

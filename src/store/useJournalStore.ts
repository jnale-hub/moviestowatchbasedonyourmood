import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export type WatchStage = 'before' | 'during' | 'after' | null;

export interface JournalEntry {
  id: string;
  topicId?: number;
  topicType: 'movie' | 'cast' | 'general';
  topicName: string;
  stage: WatchStage;
  text: string;
  createdAt: number;
}

export interface SavedMovie {
  id: number;
  title: string;
  posterPath: string | null;
}

interface JournalStore {
  entries: JournalEntry[];
  watchlist: SavedMovie[];
  isLoaded: boolean;
  

  fetchInitialData: () => Promise<void>;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  toggleWatchlist: (movie: SavedMovie) => Promise<void>;
  isInWatchlist: (id: number) => boolean;

  // Composer Control
  isComposing: boolean;
  composerContext: { id: number; type: 'movie' | 'cast'; name: string } | null;
  openComposer: (context?: { id: number; type: 'movie' | 'cast'; name: string } | null) => void;
  closeComposer: () => void;
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  watchlist: [],
  isLoaded: false,

  fetchInitialData: async () => {
    try {
      const [entriesResponse, watchlistResponse] = await Promise.all([
        supabase.from('journal_entries').select('*').order('created_at', { ascending: false }),
        supabase.from('watchlist').select('*')
      ]);

      if (entriesResponse.error) throw entriesResponse.error;
      if (watchlistResponse.error) throw watchlistResponse.error;

      const mappedEntries = (entriesResponse.data || []).map(e => ({
        id: e.id,
        topicId: e.topic_id,
        topicType: e.topic_type,
        topicName: e.topic_name,
        stage: e.stage,
        text: e.text,
        createdAt: e.created_at
      }));

      const mappedWatchlist = (watchlistResponse.data || []).map(w => ({
        id: w.id,
        title: w.title,
        posterPath: w.poster_path
      }));

      set({ entries: mappedEntries, watchlist: mappedWatchlist, isLoaded: true });
    } catch (error) {
      console.error("Failed to load cloud data:", error);
      set({ isLoaded: true }); 
    }
  },
  
  addEntry: async (entryData) => {
    const previousEntries = get().entries;
    const newEntry = { 
      ...entryData, 
      id: Math.random().toString(36).substring(2, 9), 
      createdAt: Date.now() 
    };

    set({ entries: [newEntry, ...previousEntries] });

    const { error } = await supabase.from('journal_entries').insert([{
      id: newEntry.id,
      topic_id: newEntry.topicId,
      topic_type: newEntry.topicType,
      topic_name: newEntry.topicName,
      stage: newEntry.stage,
      text: newEntry.text,
      created_at: newEntry.createdAt
    }]);

    if (error) {
      console.error("Failed to save entry:", error);
      set({ entries: previousEntries });
      Alert.alert("Connection Error", "Failed to save your thought. Please check your internet.");
    }
  },

  toggleWatchlist: async (movie) => {
    const state = get();
    const previousWatchlist = state.watchlist;
    const exists = previousWatchlist.some(m => m.id === movie.id);
    
    if (exists) {
      set({ watchlist: previousWatchlist.filter(m => m.id !== movie.id) });
      const { error } = await supabase.from('watchlist').delete().eq('id', movie.id);
      
      if (error) {
        set({ watchlist: previousWatchlist });
        Alert.alert("Error", "Could not remove movie from watchlist.");
      }
    } else {
      set({ watchlist: [movie, ...previousWatchlist] });
      const { error } = await supabase.from('watchlist').insert([{
        id: movie.id,
        title: movie.title,
        poster_path: movie.posterPath
      }]);

      if (error) {
        set({ watchlist: previousWatchlist });
        Alert.alert("Error", "Could not save movie to watchlist.");
      }
    }
  },

  isInWatchlist: (id) => get().watchlist.some(m => m.id === id),

  // Composer Control
  isComposing: false,
  composerContext: null,
  openComposer: (context = null) => set({ isComposing: true, composerContext: context }),
  closeComposer: () => set({ isComposing: false, composerContext: null }),
}));

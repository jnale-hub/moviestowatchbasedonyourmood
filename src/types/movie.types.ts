export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type Vibe = 
  | 'laugh' 
  | 'adrenaline' 
  | 'think' 
  | 'cry' 
  | 'scare' 
  | 'chill';

export interface VibeMapping {
  vibe: Vibe;
  genres: string;
  sortBy: string;
  minRating?: number;
}


export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  key: string;
  site: string;
  type: string;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface WatchProvidersResponse {
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}

export interface MovieDetails extends Movie {
  runtime: number;
  overview: string;
  videos: {
    results: Video[];
  };
  credits: {
    cast: CastMember[];
  };
  'watch/providers': WatchProvidersResponse; 
}

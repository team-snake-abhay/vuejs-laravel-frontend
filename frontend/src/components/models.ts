export interface Chapter {
  id?: number;
  name: string;
  user_id: number;
  updated_at?: string;
  created_at?: string;
}

export interface Quote {
  id?: number;
  quote: string;
  author: string;
}
export interface Url {
  id?: number;
  url: string;
  title: string;
  source?: string;
  image?: string;
}
export interface Definition {
  id?: number;
  definition: string;
  term: string;
}

export interface Profile {
  id?: number;
  profileImage?: string;
  firstName: string;
  lastName?: string;
  enterpriseTitle?: string;
  twitter?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  website?: string | null;
}
export interface Image {
  id?: number;
  image: string;
  caption?: string;
}
export interface List {
  id?: number;
  title: string;
  listType: string;
  list: Array<string>;
}

export interface CTA {
  id?: number;
  text: string;
  link: string;
}

// TODO: remove audioId
export interface Story {
  id: number;
  cards: Card[];
  title: string;
  thumbnail: string;
  chapter_name?: string;
  pw?: string | null;
  audio_id: number;
  created_at: string;
  uuid?: string;
  status?: StoryStatus;
  total_view?: number;
  chapter_id?: number;
  user_id?: null | number;
  like?: number;
  dislike?: number;
  heart?: number;
  satisfied?: number;
  sad?: number;
  angry?: number;
  background_audio?: string;
  background_volume?: null | number;
  background_image?: string;
}

export interface PublicStory {
  id: number;
  cards: Card[];
  title: string;
  thumbnail: string;
  chapter_name?: string;
  pw?: string | null;
  audio_id: number;
  created_at: string;
  uuid?: string;
  status?: StoryStatus;
  audio_url: string;
  user_name: string;
  total_view?: number;
  user_id?: null | number;
  chapter_id?: null | number;
  background_audio?: null | string;
  background_volume?: null | number;
  audio_meta_info: audioMetaInfo;
  background_image?: string;
  ownerSubscription?: string;
}

export interface audioMetaInfo {
  audio_length: null | number;
  file_size: null | number;
}
export interface newStory {
  tmpId: string;
  id?: number;
  cards: Card[];
  title: string;
  thumbnail: string;
  chapter_name?: string;
  pw?: string;
  audio_id: number;
  uuid?: string;
}

export interface Card {
  type: string;
  data: any;
  word: AudioTextRefPoint;
}

export interface AudioTextRefPoint {
  start: number;
  word: string;
  end: number;
}
export type Subscription = 'basic' | 'pro' | 'proplus' | 'recurring';
type StoryStatus = 'draft' | 'published';
export type Reaction =
  | 'like'
  | 'dislike'
  | 'heart'
  | 'satisfied'
  | 'sad'
  | 'angry';
export interface User {
  id: number;
  name: string;
  email: string;
  type: string;
  subscription: Subscription;
}
export interface LoginRequestObj {
  email: string;
  password: string;
}
export interface AudioRequestObj {
  title: string;
  audio: any;
}

export interface Audio {
  title: string;
  local_path: string;
  transcript: Array<AudioTextRefPoint>;
  id?: number;
  meta_info?: audioMetaInfo;
}
export interface BackgroundAudio {
  title: string;
  path: string;
  id?: number;
}

export interface ReactionRequestObj {
  id: number;
  reaction: Reaction;
}

// examples
export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface PermissionList {
  pass: boolean;
  embPlayer: boolean;
  chapter: boolean;
  stryCmnt: boolean;
  dailyStoryLimit: number;
  monthlyStoryLimit: number;
  storyLength: number;
  imageSearch: boolean;
  backgroundMusic: boolean;
  cta: boolean;
}

export interface StoryCount {
  daily: number;
  monthly: number;
}

export type ImgOrientation = 'landscape' | 'portrait' | 'squarish' | null;

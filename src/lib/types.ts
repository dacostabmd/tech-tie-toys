export type RoomMode = "social" | "professional";
export type MediaKind = "auto" | "music" | "video" | "movie";
export type MediaSource = "youtube" | "file";

import type { CharacterConfig } from "@/components/character/catalog";

export type AvatarConfig = CharacterConfig;

export interface PublicUser {
  id: number;
  name: string;
  avatar: AvatarConfig;
}

export interface Me extends PublicUser {
  tokens: number;
  owned: string[];
}

/** Chat moderation set by the room owner (the base profanity list always applies). */
export interface RoomModeration {
  enabled: boolean;
  censorStyle: "asterisk" | "censor";
  words: string[];
}

export interface RoomInfo {
  id: string;
  name: string;
  mode: RoomMode;
  ownerId: number;
  ownerName?: string;
  online?: number;
  createdAt: string;
}

export interface QueueItem {
  id: string;
  source: MediaSource;
  /** YouTube video id or direct file URL */
  ref: string;
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  kind: MediaKind;
  addedBy: PublicUser;
}

export interface NowPlaying {
  item: QueueItem;
  startedAt: number;
  duration: number | null;
}

export interface ChatMessage {
  id: string;
  user: PublicUser;
  text: string;
  at: number;
  system?: boolean;
}

export interface Presence extends PublicUser {
  socketId: string;
  x: number;
  y: number;
}

export interface StreamInfo {
  socketId: string;
  user: PublicUser;
  kind: "screen" | "camera";
}

export interface RoomState {
  room: RoomInfo;
  queue: QueueItem[];
  current: NowPlaying | null;
  chat: ChatMessage[];
  presence: Presence[];
  stream: StreamInfo | null;
  skipVotes: number;
  serverNow: number;
}

export interface Analysis {
  kind: "music" | "video" | "movie";
  headline: string;
  summary: string;
  sections: { title: string; body: string }[];
  facts: string[];
  tags: string[];
  rating: { score: number; verdict: string } | null;
}

export interface Playlist {
  id: number;
  name: string;
  items: PlaylistItem[];
}

export interface PlaylistItem {
  id: number;
  url: string;
  title: string;
}

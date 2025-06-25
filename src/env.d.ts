import type Marquee3k from "marquee3000";
import "@gouch/to-title-case";

declare global {
  interface Window {
    Marquee3k: Marquee3k;
  }

  interface String {
    toRespectfulLowerCase(): string;
    toTitleCase(): string;
  }
}

// only lowercase if the text is in grammatical title case
String.prototype.toRespectfulLowerCase = function () {
  if (this === this.toUpperCase() || this === this.toLowerCase()) {
    return this.toString();
  }
  // if text is titlecase or first letter of the entire string is uppercase,
  // convert it to lowercase
  if (
    this.toTitleCase() === this ||
    this.charAt(0) === this.charAt(0).toUpperCase()
  ) {
    return this.toLowerCase();
  }
  return this.toString();
};

export type Track = {
  release: {
    url: string;
    name: string;
    image_url: string;
  };
  artists: {
    name: string;
    join_phrase: string;
    url: string;
  }[];
  name: string;
  url: string;
};

export type ListenBrainzRes = {
  latest_listen_ts: number | undefined;
  listens: Array<{
    inserted_at: number;
    listened_at: number | null;
    recording_msid: string;
    track_metadata: {
      additional_info: {
        duration_ms: number;
        media_player: string;
        music_service: string;
        recording_msid: string;
        submission_client: string;
        isrc: string;
      };
      artist_name: string;
      mbid_mapping: {
        artist_mbids: Array<string>;
        artists: Array<{
          artist_credit_name: string;
          artist_mbid: string;
          join_phrase: string;
        }>;
        caa_id: number;
        caa_release_mbid: string;
        recording_mbid: string;
        recording_name: string;
        release_mbid: string;
      };
      track_name: string;
      release_name: string;
    };
    user_name: string;
  }>;
  oldest_listen_ts: number;
  user_id: string;
};

export type AniListMedia = {
  data: {
    User: {
      favourites: {
        anime: {
          nodes: Array<{
            title: {
              english: string;
              native: string;
            };
            coverImage: {
              color: string;
            };
            siteUrl: string;
            bannerImage: string;
          }>;
        };
      };
    };
    MediaList: {
      user: {
        name: string;
      };
      media: {
        title: {
          english: string;
          native: string;
        };
        siteUrl: string;
        bannerImage: string;
      };
    };
    MediaListCollection: {
      lists: Array<{
        status: string;
        entries: Array<{
          media: {
            coverImage: {
              color: string;
            };
            title: {
              english: string;
              native: string;
            };
            siteUrl: string;
          };
        }>;
      }>;
    };
  };
};

export type WebMention = {
  type: string;
  name: string;
  children: [
    {
      type: string;
      author: {
        type: string;
        name: string;
        photo: string;
        url: string;
      };
      url: string;
      published: string | null;
      "wm-received": string | null;
      "wm-id": number;
      "wm-source": string;
      "wm-target": string;
      "wm-protocol": string;
      content: {
        text: string;
      };
      "in-reply-to": string;
      "wm-property": string;
      "wm-private": boolean;
    },
  ];
};

export type MusicBrainzReleaseLookup = {
  quality: string;
  "packaging-id": string;
  packaging: string;
  title: string;
  barcode: string;
  "artist-credit": Array<{
    artist: {
      type: string;
      name: string;
      id: string;
      "sort-name": string;
      country: any;
      "type-id": string;
      disambiguation: string;
    };
    name: string;
    joinphrase: string;
  }>;
  id: string;
  "cover-art-archive": {
    front: boolean;
    back: boolean;
    darkened: boolean;
    count: number;
    artwork: boolean;
  };
  asin: any;
  status: string;
  "status-id": string;
  country: string;
  "release-events": Array<{
    area: {
      "iso-3166-1-codes": Array<string>;
      name: string;
      id: string;
      "sort-name": string;
      disambiguation: string;
      "type-id": any;
      type: any;
    };
    date: string;
  }>;
  "text-representation": {
    script: string;
    language: string;
  };
  date: string;
  disambiguation: string;
  media: Array<{
    tracks: Array<{
      position: number;
      title: string;
      id: string;
      number: string;
      "artist-credit": Array<{
        artist: {
          name: string;
          type?: string;
          "sort-name": string;
          "type-id"?: string;
          country: any;
          disambiguation: string;
          id: string;
        };
        joinphrase: string;
        name: string;
      }>;
      recording: {
        title: string;
        "first-release-date": string;
        id: string;
        disambiguation: string;
        "artist-credit": Array<{
          name: string;
          joinphrase: string;
          artist: {
            "type-id"?: string;
            country: any;
            disambiguation: string;
            id: string;
            name: string;
            type?: string;
            "sort-name": string;
          };
        }>;
        video: boolean;
        length: number;
      };
      length: number;
    }>;
  }>;
};

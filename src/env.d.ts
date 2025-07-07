import type Marquee3k from "marquee3000";
import "@gouch/to-title-case";

declare global {
  interface String {
    toRespectfulLowerCase(): string;
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
    image_palette: [number, number, number][];
  };
  artists: {
    name: string;
    join_phrase: string;
    url: string;
  }[];
  name: string;
  url: string;
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
  children: {
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
  }[];
};

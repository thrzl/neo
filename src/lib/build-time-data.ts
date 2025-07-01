import type { AniListMedia } from "../env";

export const defaultListenBrainzResponse = {
  count: 25,
  from_ts: 1751241600,
  last_updated: 1751336518,
  offset: 0,
  range: "this_week",
  releases: [
    {
      artist_mbids: ["da943be1-5611-4bf9-ac4c-0eef1bc0c16b"],
      artist_name: "MIKE",
      artists: [
        {
          artist_credit_name: "MIKE",
          artist_mbid: "da943be1-5611-4bf9-ac4c-0eef1bc0c16b",
          join_phrase: "",
        },
      ],
      caa_id: 29672355782,
      caa_release_mbid: "936d4e37-a841-4925-9953-b0f1bc059e32",
      listen_count: 12,
      release_mbid: "936d4e37-a841-4925-9953-b0f1bc059e32",
      release_name: "“Disco!”",
    },
    {
      artist_mbids: ["30991fe5-93bd-4a39-98cd-302e62145997"],
      artist_name: "untiljapan",
      artists: [
        {
          artist_credit_name: "untiljapan",
          artist_mbid: "30991fe5-93bd-4a39-98cd-302e62145997",
          join_phrase: "",
        },
      ],
      caa_id: 42160442197,
      caa_release_mbid: "0af00070-1d8f-494a-beb6-f0a1c6da5987",
      listen_count: 12,
      release_mbid: "0af00070-1d8f-494a-beb6-f0a1c6da5987",
      release_name: "trompe l’oeil",
    },
    {
      artist_mbids: ["bf1518de-586d-43a2-b4dd-9074b03d22d4"],
      artist_name: "bunii",
      artists: [
        {
          artist_credit_name: "bunii",
          artist_mbid: "bf1518de-586d-43a2-b4dd-9074b03d22d4",
          join_phrase: "",
        },
      ],
      caa_id: 41352139840,
      caa_release_mbid: "806d2f8e-ff4f-4bc0-a1ea-05e1a0401bb5",
      listen_count: 10,
      release_mbid: "806d2f8e-ff4f-4bc0-a1ea-05e1a0401bb5",
      release_name: "8:30 is too early",
    },
    {
      artist_mbids: ["175a1b69-7a19-4881-b1ca-fe6b84ff3a2d"],
      artist_name: "MAVI",
      artists: [
        {
          artist_credit_name: "MAVI",
          artist_mbid: "175a1b69-7a19-4881-b1ca-fe6b84ff3a2d",
          join_phrase: "",
        },
      ],
      caa_id: 39566202781,
      caa_release_mbid: "adac7e45-ae34-41d4-bf5f-918dc9cdd60d",
      listen_count: 7,
      release_mbid: "adac7e45-ae34-41d4-bf5f-918dc9cdd60d",
      release_name: "shadowbox",
    },
    {
      artist_mbids: ["da943be1-5611-4bf9-ac4c-0eef1bc0c16b"],
      artist_name: "MIKE",
      artists: [
        {
          artist_credit_name: "MIKE",
          artist_mbid: "da943be1-5611-4bf9-ac4c-0eef1bc0c16b",
          join_phrase: "",
        },
      ],
      caa_id: 34401358583,
      caa_release_mbid: "96589c4a-0c37-415b-bcb3-0e111a5dc4e5",
      listen_count: 6,
      release_mbid: "96589c4a-0c37-415b-bcb3-0e111a5dc4e5",
      release_name: "Beware of the Monkey",
    },
  ],
  to_ts: 1751846400,
  total_release_count: 75,
  user_id: "thrizzle",
};

export const defaultAniListResponse = {
  data: {
    User: {
      favourites: {
        anime: {
          nodes: [
            {
              title: {
                english: "Nichijou - My Ordinary Life",
                native: "日常",
              },
              coverImage: {
                color: "#e4bb93",
              },
              siteUrl: "https://anilist.co/anime/10165",
              bannerImage:
                "https://s4.anilist.co/file/anilistcdn/media/anime/banner/10165-1O0xQsic1qpB.jpg",
            },
            {
              title: {
                english: "The Apothecary Diaries Season 2",
                native: "薬屋のひとりごと 第2期",
              },
              coverImage: {
                color: "#e4bb50",
              },
              siteUrl: "https://anilist.co/anime/176301",
              bannerImage:
                "https://s4.anilist.co/file/anilistcdn/media/anime/banner/176301-GkuTF1YTT6b2.jpg",
            },
            {
              title: {
                english: "The Apothecary Diaries",
                native: "薬屋のひとりごと",
              },
              coverImage: {
                color: "#f1865d",
              },
              siteUrl: "https://anilist.co/anime/161645",
              bannerImage:
                "https://s4.anilist.co/file/anilistcdn/media/anime/banner/161645-oqzTZYIvviWI.jpg",
            },
          ],
        },
      },
    },
    MediaList: {
      user: {
        name: "thrizzle",
      },
      media: {
        title: {
          english: "Pompo: The Cinéphile",
          native: "映画大好きポンポさん",
        },
        siteUrl: "https://anilist.co/anime/99900",
        bannerImage:
          "https://s4.anilist.co/file/anilistcdn/media/anime/banner/99900-RE4la37rcBkQ.jpg",
      },
    },
    MediaListCollection: {
      lists: [
        {
          status: "PLANNING",
          entries: [
            {
              media: {
                coverImage: {
                  color: "#e4a15d",
                },
                title: {
                  english: "Pompo: The Cinéphile",
                  native: "映画大好きポンポさん",
                },
                siteUrl: "https://anilist.co/anime/99900",
                isFavourite: false,
              },
            },
            {
              media: {
                coverImage: {
                  color: "#e4e4ae",
                },
                title: {
                  english: "WITCH WATCH",
                  native: "ウィッチウォッチ",
                },
                siteUrl: "https://anilist.co/anime/180367",
                isFavourite: false,
              },
            },
            {
              media: {
                coverImage: {
                  color: "#f1c9f1",
                },
                title: {
                  english: "I Want to Eat Your Pancreas",
                  native: "君の膵臓をたべたい",
                },
                siteUrl: "https://anilist.co/anime/99750",
                isFavourite: false,
              },
            },
            {
              media: {
                coverImage: {
                  color: "#e4ae5d",
                },
                title: {
                  english: "LAZARUS",
                  native: "ラザロ",
                },
                siteUrl: "https://anilist.co/anime/167336",
                isFavourite: false,
              },
            },
            {
              media: {
                coverImage: {
                  color: "#50bbe4",
                },
                title: {
                  english: "mono",
                  native: "mono",
                },
                siteUrl: "https://anilist.co/anime/176246",
                isFavourite: false,
              },
            },
            {
              media: {
                coverImage: {
                  color: "#1a506b",
                },
                title: {
                  english: "Tsukigakirei",
                  native: "月がきれい",
                },
                siteUrl: "https://anilist.co/anime/98202",
                isFavourite: false,
              },
            },
          ],
        },
        {
          status: "PAUSED",
          entries: [
            {
              media: {
                coverImage: {
                  color: "#f1bb1a",
                },
                title: {
                  english: "The Disastrous Life of Saiki K.",
                  native: "斉木楠雄のΨ難",
                },
                siteUrl: "https://anilist.co/anime/21804",
                isFavourite: false,
              },
            },
          ],
        },
        {
          status: "COMPLETED",
          entries: [
            {
              media: {
                coverImage: {
                  color: "#5dbbe4",
                },
                title: {
                  english: "A Silent Voice",
                  native: "聲の形",
                },
                siteUrl: "https://anilist.co/anime/20954",
                isFavourite: false,
              },
            },
            {
              media: {
                coverImage: {
                  color: "#e46b43",
                },
                title: {
                  english: "Pokémon: Paldean Winds",
                  native: "放課後のブレス ",
                },
                siteUrl: "https://anilist.co/anime/168092",
                isFavourite: false,
              },
            },
            {
              media: {
                coverImage: {
                  color: "#f1865d",
                },
                title: {
                  english: "The Apothecary Diaries",
                  native: "薬屋のひとりごと",
                },
                siteUrl: "https://anilist.co/anime/161645",
                isFavourite: false,
              },
            },
            {
              media: {
                coverImage: {
                  color: "#e4bb93",
                },
                title: {
                  english: "Nichijou - My Ordinary Life",
                  native: "日常",
                },
                siteUrl: "https://anilist.co/anime/10165",
                isFavourite: false,
              },
            },
          ],
        },
        {
          status: "CURRENT",
          entries: [
            {
              media: {
                coverImage: {
                  color: "#e4bb50",
                },
                title: {
                  english: "The Apothecary Diaries Season 2",
                  native: "薬屋のひとりごと 第2期",
                },
                siteUrl: "https://anilist.co/anime/176301",
                isFavourite: false,
              },
            },
          ],
        },
      ],
    },
  },
};

export const anilistGraphQLQuery = `
query ExampleQuery($name: String, $userName: String, $status: MediaListStatus, $type: MediaType, $perPage: Int, $mediaListCollectionType2: MediaType, $mediaListCollectionUserName2: String) {
  User(name: $name) {
    favourites {
      anime(perPage: $perPage) {
        nodes {
          title {
            english
            native
          }
          coverImage {
            color
          }
          siteUrl
          bannerImage
        }
      }
    }
  }
  MediaList(userName: $userName, status: $status, type: $type) {
    user {
      name
    }
    media {
      title {
        english
        native
      }
      siteUrl
      bannerImage
    }
  }
  MediaListCollection(type: $mediaListCollectionType2, userName: $mediaListCollectionUserName2) {
    lists {
      status
      entries {
        media {
          coverImage {
            color
          }
          title {
            english
            native
          }
          siteUrl
          isFavourite
        }
      }
    }
  }
}

`;
export const anilistGraphQLVariables = {
  name: "thrizzle",
  status: "PLANNING",
  userName: "thrizzle",
  type: "ANIME",
  mediaListCollectionType2: "ANIME",
  mediaListCollectionUserName2: "thrizzle",
  chunk: 1,
};

export async function fetchAniListData(): Promise<AniListMedia["data"]> {
  if (!import.meta.env.PROD) {
    return defaultAniListResponse.data;
  }
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: anilistGraphQLQuery,
      variables: anilistGraphQLVariables,
    }),
  });

  const json: AniListMedia = await response.json();
  return json.data;
}

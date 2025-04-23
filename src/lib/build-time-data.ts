import type { AniListMedia } from "./types";

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

`
export const anilistGraphQLVariables = {
    "name": "thrizzle",
    "status": "PLANNING",
    "userName": "thrizzle",
    "type": "ANIME",
    "mediaListCollectionType2": "ANIME",
    "mediaListCollectionUserName2": "thrizzle",
    "chunk": 1
  }

export async function fetchAniListData() {
    const response = await fetch(
        "https://graphql.anilist.co",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: anilistGraphQLQuery,
            variables: anilistGraphQLVariables,
          }),
        }
      );
      
      
      const json: AniListMedia = await response.json();
      return json.data;
}
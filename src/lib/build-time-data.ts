import type { AniListMedia } from "../env";

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

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

export type ListenBrainzRes = {
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

export type ListenBrainzMetadata = {
	artist_credit_name: string;
	artist_mbids: Array<string>;
	recording_mbid: string;
	recording_name: string;
	release_mbid: string;
	release_name: string;
};

export type MusicBrainzRecordingSearch = {
	created: string;
	count: number;
	offset: number;
	recordings: Array<{
		id: string;
		score: number;
		title: string;
		length: number;
		video: boolean;
		"artist-credit": Array<{
			joinphrase?: string;
			name: string;
			artist: {
				id: string;
				name: string;
				"sort-name": string;
				aliases: Array<{
					"sort-name": string;
					"type-id": string;
					name: string;
					locale?: string;
					type: string;
					primary: boolean;
					"begin-date"?: string;
					"end-date": string;
				}>;
			};
		}>;
		"first-release-date": string;
		releases: Array<{
			id: string;
			"status-id": string;
			count: number;
			title: string;
			status: string;
			disambiguation: string | undefined;
			"artist-credit": Array<{
				name: string;
				artist: {
					id: string;
					name: string;
					"sort-name": string;
				};
			}>;
			"release-group": {
				id: string;
				"type-id": string;
				"primary-type-id": string;
				title: string;
				"primary-type": string;
			};
			date?: string;
			country?: string;
			"release-events"?: Array<{
				date: string;
				area: {
					id: string;
					name: string;
					"sort-name": string;
					"iso-3166-1-codes": Array<string>;
				};
			}>;
			"track-count": number;
			media: Array<{
				position: number;
				format: string;
				track: Array<{
					id: string;
					number: string;
					title: string;
					length: number;
				}>;
				"track-count": number;
				"track-offset": number;
			}>;
		}>;
		isrcs: Array<string>;
	}>;
};

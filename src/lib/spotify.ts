import type { Track } from "spotify-types";

export async function refreshSpotifyToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<string> {
  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export async function fetchTopTracks(
  period: "short_term" | "medium_term" | "long_term",
  accessToken: string,
): Promise<Track[]> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?period=${period}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const data: { items: Track[] } = await res.json();
  return data.items;
}

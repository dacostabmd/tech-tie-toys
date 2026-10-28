import { AccessToken } from "livekit-server-sdk";

/** LiveKit identity for a socket; viewers use it to find the broadcaster's tracks. */
export const liveIdentity = (socketId: string) => `s:${socketId}`;

export function liveKitConfigured() {
  return !!(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET);
}

export async function liveKitToken(opts: { room: string; identity: string; name: string; canPublish: boolean }) {
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: opts.identity,
    name: opts.name,
    ttl: "4h",
  });
  at.addGrant({
    roomJoin: true,
    room: `ttt-${opts.room}`,
    canPublish: opts.canPublish,
    canPublishData: false,
    canSubscribe: true,
  });
  return { url: process.env.LIVEKIT_URL!, token: await at.toJwt() };
}

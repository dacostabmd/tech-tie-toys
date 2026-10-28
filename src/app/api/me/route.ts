import { currentUser, json, unauthorized } from "@/server/session";

export async function GET() {
  const me = await currentUser();
  return me ? json(me) : unauthorized();
}

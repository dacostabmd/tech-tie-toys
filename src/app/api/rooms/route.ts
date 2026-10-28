import crypto from "node:crypto";
import { createRoom, findRecentRoom, listRooms } from "@/server/db";
import { currentUser, json, unauthorized } from "@/server/session";

export async function GET() {
  if (!(await currentUser())) return unauthorized();
  return json(listRooms());
}

export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  const { name, mode } = (await req.json().catch(() => ({}))) as { name?: string; mode?: string };
  const cleanName = String(name ?? "").trim().slice(0, 60);
  if (cleanName.length < 2) return json({ error: "Dê um nome à sala" }, 400);

  // Prevent duplicate accidental double-submit by returning the room just created
  const recent = findRecentRoom(me.id, cleanName);
  if (recent) return json(recent, 200);

  const room = createRoom(
    crypto.randomBytes(5).toString("base64url"),
    cleanName,
    mode === "professional" ? "professional" : "social",
    me.id,
  );
  return json(room, 201);
}

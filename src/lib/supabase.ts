/**
 * Supabase cloud sync.
 * Requires env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.
 * Falls back gracefully to localStorage-only mode when env vars are absent.
 *
 * Sync strategy: localStorage = primary source (offline-first).
 * On app start and after each mutation, push to Supabase.
 * Conflict resolution: server wins per updatedAt timestamp.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cloudEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Lazy-load Supabase client so the app builds even if @supabase/supabase-js isn't installed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: any = null;

async function getClient() {
  if (_client) return _client;
  if (!cloudEnabled) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    _client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    return _client;
  } catch {
    return null;
  }
}

export async function signInWithMagicLink(email: string): Promise<{ error?: string }> {
  const client = await getClient();
  if (!client) return { error: "Cloud sync not configured." };
  const { error } = await client.auth.signInWithOtp({ email });
  return { error: error?.message };
}

export async function signOut() {
  const client = await getClient();
  if (client) await client.auth.signOut();
}

export async function getCurrentUser() {
  const client = await getClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data.user ?? null;
}

export async function syncSession(sessionData: object): Promise<boolean> {
  const client = await getClient();
  if (!client) return false;
  const user = await getCurrentUser();
  if (!user) return false;
  const { error } = await client
    .from("sessions")
    .upsert({ ...sessionData, user_id: user.id, updated_at: new Date().toISOString() });
  return !error;
}

export async function fetchUserData(userId: string) {
  const client = await getClient();
  if (!client) return null;
  const [sessions, goals, games, skillTests] = await Promise.all([
    client.from("sessions").select("*").eq("user_id", userId),
    client.from("goals").select("*").eq("user_id", userId),
    client.from("games").select("*").eq("user_id", userId),
    client.from("skill_test_results").select("*").eq("user_id", userId),
  ]);
  return { sessions: sessions.data, goals: goals.data, games: games.data, skillTests: skillTests.data };
}

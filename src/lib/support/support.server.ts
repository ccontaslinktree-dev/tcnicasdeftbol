import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function getOrCreateSession(clientToken: string) {
  const { data: existing, error } = await supabaseAdmin
    .from("support_chat_sessions")
    .select("id")
    .eq("client_token", clientToken)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (existing) return existing.id;
  const { data, error: insErr } = await supabaseAdmin
    .from("support_chat_sessions")
    .insert({ client_token: clientToken })
    .select("id")
    .single();
  if (insErr) throw new Error(insErr.message);
  return data.id;
}

/** Returns true when the session exceeded its message budget. */
export async function isRateLimited(sessionId: string) {
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count, error } = await supabaseAdmin
    .from("support_chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("role", "user")
    .gte("created_at", since);
  if (error) throw new Error(error.message);
  if ((count ?? 0) >= 6) return true;
  const { count: total } = await supabaseAdmin
    .from("support_chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);
  return (total ?? 0) >= 200;
}

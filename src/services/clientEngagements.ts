import { requireSupabase, supabase } from '../lib/supabase/client';
import type { ClientFile, ClientSession, Deliverable, Engagement, EscrowEntry, Pod } from '../types/data';

export interface AdminClientFile extends ClientFile {
  organisation_name: string;
  contact_name: string | null;
  contact_email: string | null;
}

export interface ClientWorkspaceData {
  session: ClientSession;
  engagement: Engagement;
  client_file: ClientFile;
  deliverables: Deliverable[];
  pod: Pod | null;
  escrow: EscrowEntry[];
}

export async function listClientFiles(): Promise<AdminClientFile[]> {
  const { data, error } = await requireSupabase().rpc('admin_list_client_files');
  if (error) throw error;
  return (data ?? []) as AdminClientFile[];
}

export async function submitClientFile(input: { title: string; line: string; budgetCents: number | null; deadline: string; summary: string }): Promise<{ id: string; file_code: string }> {
  const { data, error } = await requireSupabase().rpc('submit_client_file', {
    p_title: input.title, p_line: input.line, p_budget_cents: input.budgetCents,
    p_scope: { summary: input.summary, deadline: input.deadline, deliverables: [{ title: input.title, sort_order: 1 }], definition_of_done: [input.summary] },
  });
  if (error) throw error;
  return data as { id: string; file_code: string };
}

export async function convertClientFile(clientFileId: string): Promise<{ engagement_id: string; engagement_code: string; pod_id: string | null }> {
  const { data, error } = await requireSupabase().rpc('convert_client_file', { p_client_file_id: clientFileId });
  if (error) throw error;
  return data as { engagement_id: string; engagement_code: string; pod_id: string | null };
}

export async function getClientWorkspace(): Promise<ClientWorkspaceData | null> {
  const { data, error } = await requireSupabase().rpc('get_client_workspace');
  if (error) throw error;
  return data as ClientWorkspaceData | null;
}

export function subscribeToClientWorkspace(userId: string, reload: () => void): () => void {
  if (!supabase) return () => {};
  const channel = supabase.channel(`client-space:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'engagements' }, reload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'deliverables' }, reload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, reload)
    .subscribe();
  return () => { void supabase.removeChannel(channel); };
}

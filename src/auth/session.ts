import { requireSupabase, supabase } from '../lib/supabase/client';
import type { ClientSession, StaffRole, StaffSession } from '../types/data';

const capabilities: Record<number, StaffRole[]> = {
  0: ['sys','registrar','clientdesk','escrow','delivery','compliance','people','editor','auditor'],
  1: ['sys','registrar','compliance'], 2: ['sys','registrar'], 3: ['sys','compliance'],
  4: ['sys','clientdesk'], 5: ['sys','clientdesk'], 6: ['sys','escrow'],
  7: ['sys','delivery'], 8: ['sys','people'], 9: ['sys','editor'], 10: ['sys'], 11: ['sys'],
};

export const hasCapability = (role: StaffRole, capability: number) => capabilities[capability]?.includes(role) ?? false;

export async function getStaffSession(): Promise<StaffSession | null> {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase.rpc('get_staff_session');
  if (error) throw error;
  return data as StaffSession | null;
}

export async function getClientSession(): Promise<ClientSession | null> {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase.rpc('get_client_session');
  if (error) throw error;
  return data as ClientSession | null;
}

export async function signInStaff(email: string, password: string): Promise<StaffSession> {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const session = await getStaffSession();
  if (!session) { await client.auth.signOut(); throw new Error('This account is not an active staff account.'); }
  return session;
}

export async function signInClient(email: string, password: string): Promise<ClientSession> {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const session = await getClientSession();
  if (!session) { await client.auth.signOut(); throw new Error('This account is not an active client account.'); }
  return session;
}

export async function registerClient(email: string, password: string, name: string, organisation: string): Promise<void> {
  const { error } = await requireSupabase().auth.signUp({ email, password, options: { data: { kind: 'client', display_name: name, organisation_name: organisation } } });
  if (error) throw error;
}

export async function verifyClientSignup(email: string, token: string): Promise<ClientSession> {
  const client = requireSupabase();
  const { error } = await client.auth.verifyOtp({ email, token, type: 'signup' });
  if (error) throw error;
  const session = await getClientSession();
  if (!session) throw new Error('Client profile provisioning failed.');
  return session;
}

export async function signOut(): Promise<void> { if (supabase) await supabase.auth.signOut(); }

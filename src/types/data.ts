export type StaffRole = 'sys' | 'registrar' | 'clientdesk' | 'escrow' | 'delivery' | 'compliance' | 'people' | 'editor' | 'auditor';
export type UserKind = 'client' | 'talent' | 'staff';

export interface AppUser { id: string; kind: UserKind; display_name: string; email: string | null }
export interface StaffProfile { user_id: string; staff_code: string; role: StaffRole; active: boolean }
export interface ClientProfile { id: string; user_id: string; organisation_name: string; contact_name: string | null }
export interface TalentProfile { id: string; user_id: string; talent_code: string | null; status: string }
export interface Application { id: string; application_code: string; applicant_id: string | null; status: string }
export interface ClientFile { id: string; file_code: string; client_profile_id: string; title: string; line: string; budget_cents: number | null; currency: string; status: string; scope: Record<string, unknown>; created_at: string }
export interface Engagement { id: string; engagement_code: string; client_file_id: string; client_profile_id: string; title: string; line: string; status: string; stage: number; deadline: string | null; price_cents: number; currency: string }
export interface Deliverable { id: string; engagement_id: string; title: string; description: string | null; status: string; sort_order: number; amount_cents: number }
export interface Pod { id: string; pod_code: string; engagement_id: string; name: string; current_gate: number }
export interface PodMember { id: string; pod_id: string; talent_profile_id: string; role: string }
export interface GateCheck { id: string; pod_id: string; gate: number; status: string }
export interface EscrowEntry { id: string; engagement_id: string; entry_type: string; amount_cents: number; currency: string }
export interface Message { id: string; engagement_id: string; sender_user_id: string; body: string; created_at: string }
export interface Notification { id: string; user_id: string; kind: string; title: string; read_at: string | null }
export interface AuditLog { id: string; event_type: string; actor_user_id: string; object_type: string; object_id: string; before_data: unknown; after_data: unknown; created_at: string }

export interface StaffSession { user: AppUser; staff: StaffProfile }
export interface ClientSession { user: AppUser; client: ClientProfile }


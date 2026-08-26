create extension if not exists pgcrypto;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  kind text not null check (kind in ('client','talent','staff')),
  display_name text not null,
  email text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.staff_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  staff_code text not null unique check (staff_code ~ '^ADM-'),
  role text not null check (role in ('sys','registrar','clientdesk','escrow','delivery','compliance','people','editor','auditor')),
  active boolean not null default true
);
create table public.client_profiles (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.users(id) on delete cascade,
  organisation_name text not null, contact_name text, created_at timestamptz not null default now()
);
create table public.talent_profiles (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.users(id) on delete cascade,
  talent_code text unique check (talent_code is null or talent_code ~ '^KY-T-'), status text not null default 'pending'
);
create table public.applications (
  id uuid primary key default gen_random_uuid(), application_code text not null unique check (application_code ~ '^APP-'),
  applicant_id uuid references public.users(id), kind text not null, status text not null default 'submitted', payload jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.client_files (
  id uuid primary key default gen_random_uuid(), file_code text not null unique check (file_code ~ '^KY-F-'),
  client_profile_id uuid not null references public.client_profiles(id), title text not null, line text not null,
  budget_cents bigint, currency text not null default 'USD', status text not null default 'submitted',
  scope jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.engagements (
  id uuid primary key default gen_random_uuid(), engagement_code text not null unique check (engagement_code ~ '^KY-J-'),
  client_file_id uuid not null unique references public.client_files(id), client_profile_id uuid not null references public.client_profiles(id),
  title text not null, line text not null, status text not null default 'open', stage smallint not null default 0 check (stage between 0 and 5),
  deadline date, price_cents bigint not null default 0, currency text not null default 'USD', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.deliverables (
  id uuid primary key default gen_random_uuid(), engagement_id uuid not null references public.engagements(id) on delete cascade,
  title text not null, description text, status text not null default 'pending', sort_order integer not null default 0,
  amount_cents bigint not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.pods (
  id uuid primary key default gen_random_uuid(), pod_code text not null unique check (pod_code ~ '^POD-'), engagement_id uuid not null unique references public.engagements(id),
  name text not null, current_gate smallint not null default 0 check (current_gate between 0 and 9), created_at timestamptz not null default now()
);
create table public.pod_members (
  id uuid primary key default gen_random_uuid(), pod_id uuid not null references public.pods(id) on delete cascade,
  talent_profile_id uuid not null references public.talent_profiles(id), role text not null, unique(pod_id,talent_profile_id)
);
create table public.gate_checks (
  id uuid primary key default gen_random_uuid(), pod_id uuid not null references public.pods(id) on delete cascade,
  gate smallint not null check (gate between 0 and 9), status text not null default 'pending', checked_by uuid references public.users(id), checked_at timestamptz
);
create table public.escrow_entries (
  id uuid primary key default gen_random_uuid(), engagement_id uuid not null references public.engagements(id), entry_type text not null,
  amount_cents bigint not null check (amount_cents >= 0), currency text not null default 'USD', reference text, created_by uuid not null references public.users(id), created_at timestamptz not null default now()
);
create table public.messages (
  id uuid primary key default gen_random_uuid(), engagement_id uuid not null references public.engagements(id) on delete cascade,
  sender_user_id uuid not null references public.users(id), body text not null, created_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  kind text not null, title text not null, object_type text, object_id uuid, read_at timestamptz, created_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), event_type text not null, actor_user_id uuid not null references public.users(id),
  object_type text not null, object_id uuid not null, before_data jsonb, after_data jsonb, created_at timestamptz not null default now()
);
create table public.registry_counters (kind text primary key, value bigint not null default 0);
insert into public.registry_counters(kind,value) values ('client_file',0),('engagement',0),('pod',0) on conflict do nothing;

create or replace function public.handle_new_auth_user() returns trigger language plpgsql security definer set search_path=public as $$
declare client_id uuid;
begin
  if coalesce(new.raw_user_meta_data->>'kind','') <> 'client' then return new; end if;
  insert into users(id,kind,display_name,email) values(new.id,'client',coalesce(nullif(new.raw_user_meta_data->>'display_name',''),split_part(new.email,'@',1)),new.email);
  insert into client_profiles(user_id,organisation_name,contact_name) values(new.id,coalesce(nullif(new.raw_user_meta_data->>'organisation_name',''),'—'),new.raw_user_meta_data->>'display_name') returning id into client_id;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();

create or replace function public.is_staff_role(allowed text[]) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from staff_profiles where user_id=auth.uid() and active and role=any(allowed));
$$;
create or replace function public.is_engagement_client(eid uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from engagements e join client_profiles c on c.id=e.client_profile_id where e.id=eid and c.user_id=auth.uid());
$$;
create or replace function public.is_pod_member(pid uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from pod_members pm join talent_profiles t on t.id=pm.talent_profile_id where pm.pod_id=pid and t.user_id=auth.uid());
$$;

alter table users enable row level security; alter table staff_profiles enable row level security;
alter table client_profiles enable row level security; alter table talent_profiles enable row level security;
alter table applications enable row level security; alter table client_files enable row level security;
alter table engagements enable row level security; alter table deliverables enable row level security;
alter table pods enable row level security; alter table pod_members enable row level security;
alter table gate_checks enable row level security; alter table escrow_entries enable row level security;
alter table messages enable row level security; alter table notifications enable row level security; alter table audit_logs enable row level security;

create policy users_self on users for select using (id=auth.uid() or is_staff_role(array['sys','registrar','clientdesk','escrow','delivery','compliance','people','editor','auditor']));
create policy staff_self on staff_profiles for select using (user_id=auth.uid() or is_staff_role(array['sys','auditor']));
create policy clients_own on client_profiles for select using (user_id=auth.uid() or is_staff_role(array['sys','clientdesk']));
create policy talents_own on talent_profiles for select using (user_id=auth.uid() or is_staff_role(array['sys','registrar','compliance','delivery']));
create policy applications_own on applications for select using (applicant_id=auth.uid() or is_staff_role(array['sys','registrar','compliance','clientdesk']));
create policy files_own on client_files for select using (exists(select 1 from client_profiles c where c.id=client_profile_id and c.user_id=auth.uid()) or is_staff_role(array['sys','clientdesk']));
create policy engagements_own on engagements for select using (is_engagement_client(id) or is_staff_role(array['sys','registrar','clientdesk','escrow','delivery','compliance','people','editor','auditor']));
create policy deliverables_own on deliverables for select using (is_engagement_client(engagement_id) or is_staff_role(array['sys','registrar','clientdesk','escrow','delivery','compliance','people','editor','auditor']));
create policy pods_visible on pods for select using (is_engagement_client(engagement_id) or is_pod_member(id) or is_staff_role(array['sys','registrar','clientdesk','escrow','delivery','compliance','people','editor','auditor']));
create policy pod_members_visible on pod_members for select using (is_pod_member(pod_id) or is_staff_role(array['sys','delivery']));
create policy gates_visible on gate_checks for select using (is_pod_member(pod_id) or exists(select 1 from pods p where p.id=pod_id and is_engagement_client(p.engagement_id)) or is_staff_role(array['sys','delivery']));
create policy escrow_client_read on escrow_entries for select using (is_engagement_client(engagement_id) or is_staff_role(array['sys','escrow','auditor']));
create policy messages_read on messages for select using (is_engagement_client(engagement_id) or is_staff_role(array['sys','clientdesk','delivery','people','auditor']));
create policy messages_client_insert on messages for insert with check (sender_user_id=auth.uid() and is_engagement_client(engagement_id));
create policy notifications_own on notifications for select using (user_id=auth.uid());
create policy audit_staff_read on audit_logs for select using (is_staff_role(array['sys','registrar','clientdesk','escrow','delivery','compliance','people','editor','auditor']));

create or replace function public.next_business_code(counter_kind text, prefix text) returns text language plpgsql security definer set search_path=public as $$
declare n bigint; begin update registry_counters set value=value+1 where kind=counter_kind returning value into n;
  return prefix||to_char(current_date,'YY')||'-'||lpad(n::text,5,'0'); end $$;

create or replace function public.get_staff_session() returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object('user',to_jsonb(u),'staff',to_jsonb(s)) from users u join staff_profiles s on s.user_id=u.id where u.id=auth.uid() and s.active;
$$;
create or replace function public.get_client_session() returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object('user',to_jsonb(u),'client',to_jsonb(c)) from users u join client_profiles c on c.user_id=u.id where u.id=auth.uid();
$$;
create or replace function public.admin_list_client_files() returns setof jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object('id',f.id,'file_code',f.file_code,'client_profile_id',f.client_profile_id,'title',f.title,'line',f.line,
    'budget_cents',f.budget_cents,'currency',f.currency,'status',f.status,'scope',f.scope,'created_at',f.created_at,
    'organisation_name',c.organisation_name,'contact_name',c.contact_name,'contact_email',u.email)
  from client_files f join client_profiles c on c.id=f.client_profile_id join users u on u.id=c.user_id
  where is_staff_role(array['sys','clientdesk']) order by f.created_at desc;
$$;

create or replace function public.submit_client_file(p_title text,p_line text,p_budget_cents bigint,p_scope jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare profile_id uuid; created client_files;
begin
  select id into profile_id from client_profiles where user_id=auth.uid();
  if profile_id is null then raise exception 'forbidden' using errcode='42501'; end if;
  if length(trim(p_title))<3 or length(trim(coalesce(p_scope->>'summary','')))<30 then raise exception 'invalid client file'; end if;
  insert into client_files(file_code,client_profile_id,title,line,budget_cents,scope,status)
  values(next_business_code('client_file','KY-F-'),profile_id,trim(p_title),p_line,p_budget_cents,p_scope,'submitted') returning * into created;
  return jsonb_build_object('id',created.id,'file_code',created.file_code);
end $$;

create or replace function public.convert_client_file(p_client_file_id uuid) returns jsonb language plpgsql security definer set search_path=public as $$
declare f client_files; e engagements; p pods; item jsonb; items jsonb; count_items int; actor uuid:=auth.uid(); result jsonb; deliverable_id uuid;
begin
  if actor is null or not is_staff_role(array['sys','clientdesk']) then raise exception 'forbidden' using errcode='42501'; end if;
  select * into f from client_files where id=p_client_file_id for update;
  if not found then raise exception 'client file not found'; end if;
  if f.status not in ('submitted','in_review','ready') then raise exception 'client file cannot be converted from status %',f.status; end if;
  insert into engagements(engagement_code,client_file_id,client_profile_id,title,line,status,stage,deadline,price_cents,currency)
  values(next_business_code('engagement','KY-J-'),f.id,f.client_profile_id,f.title,f.line,'open',0,
    case when f.scope->>'deadline' ~ '^\d{4}-\d{2}-\d{2}$' then (f.scope->>'deadline')::date else null end,coalesce(f.budget_cents,0),f.currency) returning * into e;
  items:=case when jsonb_typeof(f.scope->'deliverables')='array' then f.scope->'deliverables' else jsonb_build_array(jsonb_build_object('title',f.title)) end;
  count_items:=greatest(jsonb_array_length(items),1);
  for item in select value from jsonb_array_elements(items) loop
    insert into deliverables(engagement_id,title,description,sort_order,amount_cents)
    values(e.id,coalesce(item->>'title',item#>>'{}',f.title),item->>'description',coalesce((item->>'sort_order')::int,0),coalesce(f.budget_cents,0)/count_items) returning id into deliverable_id;
    insert into audit_logs(event_type,actor_user_id,object_type,object_id,after_data) values('deliverable.created',actor,'deliverable',deliverable_id,item);
  end loop;
  if nullif(f.scope->>'pod_name','') is not null then
    insert into pods(pod_code,engagement_id,name) values(next_business_code('pod','POD-'),e.id,f.scope->>'pod_name') returning * into p;
    insert into audit_logs(event_type,actor_user_id,object_type,object_id,after_data) values('pod.created',actor,'pod',p.id,to_jsonb(p));
  end if;
  update client_files set status='converted',updated_at=now() where id=f.id;
  insert into audit_logs(event_type,actor_user_id,object_type,object_id,before_data,after_data) values('client_file.converted',actor,'client_file',f.id,to_jsonb(f),jsonb_build_object('status','converted','engagement_id',e.id));
  insert into audit_logs(event_type,actor_user_id,object_type,object_id,after_data) values('engagement.created',actor,'engagement',e.id,to_jsonb(e));
  insert into notifications(user_id,kind,title,object_type,object_id) select user_id,'engagement.created',e.title,'engagement',e.id from client_profiles where id=e.client_profile_id;
  result:=jsonb_build_object('engagement_id',e.id,'engagement_code',e.engagement_code,'pod_id',p.id); return result;
end $$;

create or replace function public.get_client_workspace() returns jsonb language sql stable security invoker set search_path=public as $$
  select jsonb_build_object('session',jsonb_build_object('user',to_jsonb(u),'client',to_jsonb(c)),'engagement',to_jsonb(e),'client_file',to_jsonb(f),
    'deliverables',coalesce((select jsonb_agg(to_jsonb(d) order by d.sort_order,d.created_at) from deliverables d where d.engagement_id=e.id),'[]'::jsonb),
    'pod',(select to_jsonb(p) from pods p where p.engagement_id=e.id),
    'escrow',coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at) from escrow_entries x where x.engagement_id=e.id),'[]'::jsonb))
  from users u join client_profiles c on c.user_id=u.id join lateral
    (select * from engagements ee where ee.client_profile_id=c.id order by ee.created_at desc limit 1) e on true
    join client_files f on f.id=e.client_file_id where u.id=auth.uid();
$$;

revoke all on function public.next_business_code(text,text) from public, anon, authenticated;
revoke all on function public.get_staff_session() from public, anon;
revoke all on function public.get_client_session() from public, anon;
revoke all on function public.admin_list_client_files() from public, anon;
revoke all on function public.submit_client_file(text,text,bigint,jsonb) from public, anon;
revoke all on function public.convert_client_file(uuid) from public, anon;
revoke all on function public.get_client_workspace() from public, anon;
grant execute on function public.get_staff_session() to authenticated;
grant execute on function public.get_client_session() to authenticated;
grant execute on function public.admin_list_client_files() to authenticated;
grant execute on function public.submit_client_file(text,text,bigint,jsonb) to authenticated;
grant execute on function public.convert_client_file(uuid) to authenticated;
grant execute on function public.get_client_workspace() to authenticated;

do $$ begin alter publication supabase_realtime add table engagements,deliverables,notifications; exception when duplicate_object then null; end $$;

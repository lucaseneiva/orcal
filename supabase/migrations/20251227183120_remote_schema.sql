drop policy "Enable read access for all users" on "public"."tenants";

drop policy "Tenants visible by role" on "public"."tenants";

revoke delete on table "public"."tenants" from "anon";

revoke insert on table "public"."tenants" from "anon";

revoke references on table "public"."tenants" from "anon";

revoke select on table "public"."tenants" from "anon";

revoke trigger on table "public"."tenants" from "anon";

revoke truncate on table "public"."tenants" from "anon";

revoke update on table "public"."tenants" from "anon";

revoke delete on table "public"."tenants" from "authenticated";

revoke insert on table "public"."tenants" from "authenticated";

revoke references on table "public"."tenants" from "authenticated";

revoke select on table "public"."tenants" from "authenticated";

revoke trigger on table "public"."tenants" from "authenticated";

revoke truncate on table "public"."tenants" from "authenticated";

revoke update on table "public"."tenants" from "authenticated";

revoke delete on table "public"."tenants" from "service_role";

revoke insert on table "public"."tenants" from "service_role";

revoke references on table "public"."tenants" from "service_role";

revoke select on table "public"."tenants" from "service_role";

revoke trigger on table "public"."tenants" from "service_role";

revoke truncate on table "public"."tenants" from "service_role";

revoke update on table "public"."tenants" from "service_role";

alter table "public"."tenants" drop constraint "tenants_domain_key";

alter table "public"."tenants" drop constraint "tenants_slug_key";

alter table "public"."leads" drop constraint "leads_tenant_id_fkey";

alter table "public"."products" drop constraint "products_tenant_id_fkey";

alter table "public"."profiles" drop constraint "profiles_tenant_id_fkey";

alter table "public"."tenants" drop constraint "tenants_pkey";

drop index if exists "public"."tenants_domain_key";

drop index if exists "public"."tenants_pkey";

drop index if exists "public"."tenants_slug_key";

drop table "public"."tenants";


  create table "public"."stores" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "slug" text not null,
    "subdomain" text not null,
    "primary_color" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "logo_url" text,
    "custom_domain" text,
    "email_contact" text,
    "whatsapp_number" text
      );


alter table "public"."stores" enable row level security;

CREATE UNIQUE INDEX stores_custom_domain_key ON public.stores USING btree (custom_domain);

CREATE UNIQUE INDEX tenants_domain_key ON public.stores USING btree (subdomain);

CREATE UNIQUE INDEX tenants_pkey ON public.stores USING btree (id);

CREATE UNIQUE INDEX tenants_slug_key ON public.stores USING btree (slug);

alter table "public"."stores" add constraint "tenants_pkey" PRIMARY KEY using index "tenants_pkey";

alter table "public"."stores" add constraint "stores_custom_domain_key" UNIQUE using index "stores_custom_domain_key";

alter table "public"."stores" add constraint "tenants_domain_key" UNIQUE using index "tenants_domain_key";

alter table "public"."stores" add constraint "tenants_slug_key" UNIQUE using index "tenants_slug_key";

alter table "public"."leads" add constraint "leads_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.stores(id) not valid;

alter table "public"."leads" validate constraint "leads_tenant_id_fkey";

alter table "public"."products" add constraint "products_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.stores(id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_tenant_id_fkey";

alter table "public"."profiles" add constraint "profiles_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.stores(id) not valid;

alter table "public"."profiles" validate constraint "profiles_tenant_id_fkey";

grant delete on table "public"."stores" to "anon";

grant insert on table "public"."stores" to "anon";

grant references on table "public"."stores" to "anon";

grant select on table "public"."stores" to "anon";

grant trigger on table "public"."stores" to "anon";

grant truncate on table "public"."stores" to "anon";

grant update on table "public"."stores" to "anon";

grant delete on table "public"."stores" to "authenticated";

grant insert on table "public"."stores" to "authenticated";

grant references on table "public"."stores" to "authenticated";

grant select on table "public"."stores" to "authenticated";

grant trigger on table "public"."stores" to "authenticated";

grant truncate on table "public"."stores" to "authenticated";

grant update on table "public"."stores" to "authenticated";

grant delete on table "public"."stores" to "service_role";

grant insert on table "public"."stores" to "service_role";

grant references on table "public"."stores" to "service_role";

grant select on table "public"."stores" to "service_role";

grant trigger on table "public"."stores" to "service_role";

grant truncate on table "public"."stores" to "service_role";

grant update on table "public"."stores" to "service_role";


  create policy "Enable read access for all users"
  on "public"."stores"
  as permissive
  for select
  to public
using (true);



  create policy "Tenants visible by role"
  on "public"."stores"
  as permissive
  for select
  to public
using (((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = 'super_admin'::text) OR (id = ( SELECT profiles.tenant_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid())))));




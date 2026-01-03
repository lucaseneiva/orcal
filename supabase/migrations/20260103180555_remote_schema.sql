create extension if not exists "moddatetime" with schema "public";

drop policy "Enable read access for all users" on "public"."profiles";

drop policy "Enable read access for all users" on "public"."stores";

drop policy "Tenants visible by role" on "public"."stores";

revoke delete on table "public"."leads" from "anon";

revoke insert on table "public"."leads" from "anon";

revoke references on table "public"."leads" from "anon";

revoke select on table "public"."leads" from "anon";

revoke trigger on table "public"."leads" from "anon";

revoke truncate on table "public"."leads" from "anon";

revoke update on table "public"."leads" from "anon";

revoke delete on table "public"."leads" from "authenticated";

revoke insert on table "public"."leads" from "authenticated";

revoke references on table "public"."leads" from "authenticated";

revoke select on table "public"."leads" from "authenticated";

revoke trigger on table "public"."leads" from "authenticated";

revoke truncate on table "public"."leads" from "authenticated";

revoke update on table "public"."leads" from "authenticated";

revoke delete on table "public"."leads" from "service_role";

revoke insert on table "public"."leads" from "service_role";

revoke references on table "public"."leads" from "service_role";

revoke select on table "public"."leads" from "service_role";

revoke trigger on table "public"."leads" from "service_role";

revoke truncate on table "public"."leads" from "service_role";

revoke update on table "public"."leads" from "service_role";

alter table "public"."leads" drop constraint "leads_tenant_id_fkey";

alter table "public"."products" drop constraint "products_tenant_id_fkey";

alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."profiles" drop constraint "profiles_tenant_id_fkey";

alter table "public"."stores" drop constraint "stores_custom_domain_key";

alter table "public"."stores" drop constraint "tenants_domain_key";

alter table "public"."stores" drop constraint "tenants_slug_key";

alter table "public"."leads" drop constraint "leads_pkey";

alter table "public"."stores" drop constraint "tenants_pkey";

drop index if exists "public"."leads_pkey";

drop index if exists "public"."stores_custom_domain_key";

drop index if exists "public"."tenants_domain_key";

drop index if exists "public"."tenants_pkey";

drop index if exists "public"."tenants_slug_key";

drop table "public"."leads";


  create table "public"."attribute_values" (
    "id" uuid not null default gen_random_uuid(),
    "attribute_id" uuid not null,
    "name" text not null,
    "created_at" timestamp without time zone default now()
      );



  create table "public"."attributes" (
    "id" uuid not null default gen_random_uuid(),
    "store_id" uuid not null,
    "name" text not null,
    "slug" text not null,
    "created_at" timestamp without time zone default now()
      );



  create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "store_id" uuid not null,
    "customer_name" text not null,
    "customer_whatsapp" text not null,
    "total_items" integer default 0,
    "items" jsonb,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."product_attribute_values" (
    "product_id" uuid not null,
    "attribute_value_id" uuid not null
      );


alter table "public"."products" drop column "price";

alter table "public"."products" drop column "tenant_id";

alter table "public"."products" add column "status" text default 'inactive'::text;

alter table "public"."products" add column "store_id" uuid not null;

alter table "public"."products" add column "updated_at" timestamp without time zone default now();

alter table "public"."products" alter column "created_at" set default now();

alter table "public"."products" alter column "created_at" drop not null;

alter table "public"."products" alter column "created_at" set data type timestamp without time zone using "created_at"::timestamp without time zone;

alter table "public"."products" alter column "slug" set not null;

alter table "public"."profiles" drop column "email";

alter table "public"."profiles" drop column "role";

alter table "public"."profiles" drop column "tenant_id";

alter table "public"."profiles" add column "created_at" timestamp without time zone default now();

alter table "public"."profiles" add column "store_id" uuid not null;

alter table "public"."profiles" disable row level security;

alter table "public"."stores" drop column "custom_domain";

alter table "public"."stores" drop column "email_contact";

alter table "public"."stores" drop column "subdomain";

alter table "public"."stores" drop column "whatsapp_number";

alter table "public"."stores" add column "domain" text not null;

alter table "public"."stores" alter column "created_at" set default now();

alter table "public"."stores" alter column "created_at" drop not null;

alter table "public"."stores" alter column "created_at" set data type timestamp without time zone using "created_at"::timestamp without time zone;

alter table "public"."stores" alter column "primary_color" set default '#000000'::text;

alter table "public"."stores" alter column "primary_color" set not null;

alter table "public"."stores" disable row level security;

CREATE UNIQUE INDEX attribute_values_pkey ON public.attribute_values USING btree (id);

CREATE UNIQUE INDEX attributes_pkey ON public.attributes USING btree (id);

CREATE UNIQUE INDEX attributes_store_id_slug_key ON public.attributes USING btree (store_id, slug);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX product_attribute_values_pkey ON public.product_attribute_values USING btree (product_id, attribute_value_id);

CREATE UNIQUE INDEX products_store_id_slug_key ON public.products USING btree (store_id, slug);

CREATE UNIQUE INDEX stores_domain_key ON public.stores USING btree (domain);

CREATE UNIQUE INDEX stores_pkey ON public.stores USING btree (id);

CREATE UNIQUE INDEX stores_slug_key ON public.stores USING btree (slug);

alter table "public"."attribute_values" add constraint "attribute_values_pkey" PRIMARY KEY using index "attribute_values_pkey";

alter table "public"."attributes" add constraint "attributes_pkey" PRIMARY KEY using index "attributes_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."product_attribute_values" add constraint "product_attribute_values_pkey" PRIMARY KEY using index "product_attribute_values_pkey";

alter table "public"."stores" add constraint "stores_pkey" PRIMARY KEY using index "stores_pkey";

alter table "public"."attribute_values" add constraint "fk_attribute_values_attribute" FOREIGN KEY (attribute_id) REFERENCES public.attributes(id) ON DELETE CASCADE not valid;

alter table "public"."attribute_values" validate constraint "fk_attribute_values_attribute";

alter table "public"."attributes" add constraint "attributes_store_id_slug_key" UNIQUE using index "attributes_store_id_slug_key";

alter table "public"."attributes" add constraint "fk_attributes_store" FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE not valid;

alter table "public"."attributes" validate constraint "fk_attributes_store";

alter table "public"."orders" add constraint "orders_store_id_fkey" FOREIGN KEY (store_id) REFERENCES public.stores(id) not valid;

alter table "public"."orders" validate constraint "orders_store_id_fkey";

alter table "public"."product_attribute_values" add constraint "fk_pav_product" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_attribute_values" validate constraint "fk_pav_product";

alter table "public"."product_attribute_values" add constraint "fk_pav_value" FOREIGN KEY (attribute_value_id) REFERENCES public.attribute_values(id) ON DELETE CASCADE not valid;

alter table "public"."product_attribute_values" validate constraint "fk_pav_value";

alter table "public"."products" add constraint "fk_products_store" FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "fk_products_store";

alter table "public"."products" add constraint "products_store_id_slug_key" UNIQUE using index "products_store_id_slug_key";

alter table "public"."profiles" add constraint "profiles_store_id_fkey" FOREIGN KEY (store_id) REFERENCES public.stores(id) not valid;

alter table "public"."profiles" validate constraint "profiles_store_id_fkey";

alter table "public"."stores" add constraint "stores_domain_key" UNIQUE using index "stores_domain_key";

alter table "public"."stores" add constraint "stores_slug_key" UNIQUE using index "stores_slug_key";

grant delete on table "public"."attribute_values" to "anon";

grant insert on table "public"."attribute_values" to "anon";

grant references on table "public"."attribute_values" to "anon";

grant select on table "public"."attribute_values" to "anon";

grant trigger on table "public"."attribute_values" to "anon";

grant truncate on table "public"."attribute_values" to "anon";

grant update on table "public"."attribute_values" to "anon";

grant delete on table "public"."attribute_values" to "authenticated";

grant insert on table "public"."attribute_values" to "authenticated";

grant references on table "public"."attribute_values" to "authenticated";

grant select on table "public"."attribute_values" to "authenticated";

grant trigger on table "public"."attribute_values" to "authenticated";

grant truncate on table "public"."attribute_values" to "authenticated";

grant update on table "public"."attribute_values" to "authenticated";

grant delete on table "public"."attribute_values" to "service_role";

grant insert on table "public"."attribute_values" to "service_role";

grant references on table "public"."attribute_values" to "service_role";

grant select on table "public"."attribute_values" to "service_role";

grant trigger on table "public"."attribute_values" to "service_role";

grant truncate on table "public"."attribute_values" to "service_role";

grant update on table "public"."attribute_values" to "service_role";

grant delete on table "public"."attributes" to "anon";

grant insert on table "public"."attributes" to "anon";

grant references on table "public"."attributes" to "anon";

grant select on table "public"."attributes" to "anon";

grant trigger on table "public"."attributes" to "anon";

grant truncate on table "public"."attributes" to "anon";

grant update on table "public"."attributes" to "anon";

grant delete on table "public"."attributes" to "authenticated";

grant insert on table "public"."attributes" to "authenticated";

grant references on table "public"."attributes" to "authenticated";

grant select on table "public"."attributes" to "authenticated";

grant trigger on table "public"."attributes" to "authenticated";

grant truncate on table "public"."attributes" to "authenticated";

grant update on table "public"."attributes" to "authenticated";

grant delete on table "public"."attributes" to "service_role";

grant insert on table "public"."attributes" to "service_role";

grant references on table "public"."attributes" to "service_role";

grant select on table "public"."attributes" to "service_role";

grant trigger on table "public"."attributes" to "service_role";

grant truncate on table "public"."attributes" to "service_role";

grant update on table "public"."attributes" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."product_attribute_values" to "anon";

grant insert on table "public"."product_attribute_values" to "anon";

grant references on table "public"."product_attribute_values" to "anon";

grant select on table "public"."product_attribute_values" to "anon";

grant trigger on table "public"."product_attribute_values" to "anon";

grant truncate on table "public"."product_attribute_values" to "anon";

grant update on table "public"."product_attribute_values" to "anon";

grant delete on table "public"."product_attribute_values" to "authenticated";

grant insert on table "public"."product_attribute_values" to "authenticated";

grant references on table "public"."product_attribute_values" to "authenticated";

grant select on table "public"."product_attribute_values" to "authenticated";

grant trigger on table "public"."product_attribute_values" to "authenticated";

grant truncate on table "public"."product_attribute_values" to "authenticated";

grant update on table "public"."product_attribute_values" to "authenticated";

grant delete on table "public"."product_attribute_values" to "service_role";

grant insert on table "public"."product_attribute_values" to "service_role";

grant references on table "public"."product_attribute_values" to "service_role";

grant select on table "public"."product_attribute_values" to "service_role";

grant trigger on table "public"."product_attribute_values" to "service_role";

grant truncate on table "public"."product_attribute_values" to "service_role";

grant update on table "public"."product_attribute_values" to "service_role";


  create policy "Authenticated Upload"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'images'::text));



  create policy "Public Access"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'images'::text));




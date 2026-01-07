create type "public"."product_status" as enum ('active', 'inactive', 'draft');

create type "public"."quote_status" as enum ('pending', 'responded', 'converted', 'cancelled');

revoke delete on table "public"."orders" from "anon";

revoke insert on table "public"."orders" from "anon";

revoke references on table "public"."orders" from "anon";

revoke select on table "public"."orders" from "anon";

revoke trigger on table "public"."orders" from "anon";

revoke truncate on table "public"."orders" from "anon";

revoke update on table "public"."orders" from "anon";

revoke delete on table "public"."orders" from "authenticated";

revoke insert on table "public"."orders" from "authenticated";

revoke references on table "public"."orders" from "authenticated";

revoke select on table "public"."orders" from "authenticated";

revoke trigger on table "public"."orders" from "authenticated";

revoke truncate on table "public"."orders" from "authenticated";

revoke update on table "public"."orders" from "authenticated";

revoke delete on table "public"."orders" from "service_role";

revoke insert on table "public"."orders" from "service_role";

revoke references on table "public"."orders" from "service_role";

revoke select on table "public"."orders" from "service_role";

revoke trigger on table "public"."orders" from "service_role";

revoke truncate on table "public"."orders" from "service_role";

revoke update on table "public"."orders" from "service_role";

alter table "public"."attribute_values" drop constraint "fk_attribute_values_attribute";

alter table "public"."attributes" drop constraint "fk_attributes_store";

alter table "public"."orders" drop constraint "orders_store_id_fkey";

alter table "public"."product_attribute_values" drop constraint "fk_pav_product";

alter table "public"."product_attribute_values" drop constraint "fk_pav_value";

alter table "public"."products" drop constraint "fk_products_store";

alter table "public"."profiles" drop constraint "profiles_store_id_fkey";

alter table "public"."orders" drop constraint "orders_pkey";

drop index if exists "public"."orders_pkey";

drop table "public"."orders";


  create table "public"."quote_requests" (
    "id" uuid not null default gen_random_uuid(),
    "store_id" uuid not null,
    "customer_name" text not null,
    "customer_whatsapp" text not null,
    "items" jsonb not null,
    "total_items" integer default 0,
    "viewed" boolean default false,
    "status" public.quote_status default 'pending'::public.quote_status,
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "viewed_at" timestamp with time zone,
    "responded_at" timestamp with time zone,
    "converted_at" timestamp with time zone
      );


alter table "public"."attribute_values" add column "description" text;

alter table "public"."attribute_values" add column "display_order" integer default 0;

alter table "public"."attribute_values" add column "updated_at" timestamp with time zone default now();

alter table "public"."attribute_values" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."attributes" add column "display_order" integer default 0;

alter table "public"."attributes" add column "updated_at" timestamp with time zone default now();

alter table "public"."attributes" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."products" add column "display_order" integer default 0;

alter table "public"."products" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."products" alter column "status" set default 'draft'::public.product_status;

alter table "public"."products" alter column "status" set data type public.product_status using "status"::public.product_status;

alter table "public"."products" alter column "updated_at" set data type timestamp with time zone using "updated_at"::timestamp with time zone;

alter table "public"."profiles" add column "email" text;

alter table "public"."profiles" add column "full_name" text;

alter table "public"."profiles" add column "role" text default 'owner'::text;

alter table "public"."profiles" add column "updated_at" timestamp with time zone default now();

alter table "public"."profiles" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."stores" add column "updated_at" timestamp with time zone default now();

alter table "public"."stores" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

CREATE INDEX idx_attribute_values_attr ON public.attribute_values USING btree (attribute_id, display_order);

CREATE INDEX idx_attributes_store ON public.attributes USING btree (store_id, display_order);

CREATE INDEX idx_pav_product ON public.product_attribute_values USING btree (product_id);

CREATE INDEX idx_pav_value ON public.product_attribute_values USING btree (attribute_value_id);

CREATE INDEX idx_products_slug ON public.products USING btree (store_id, slug);

CREATE INDEX idx_products_store ON public.products USING btree (store_id, status, display_order);

CREATE INDEX idx_profiles_store ON public.profiles USING btree (store_id);

CREATE INDEX idx_quote_requests_new ON public.quote_requests USING btree (store_id, viewed) WHERE (viewed = false);

CREATE INDEX idx_quote_requests_status ON public.quote_requests USING btree (store_id, status);

CREATE INDEX idx_quote_requests_store ON public.quote_requests USING btree (store_id, created_at DESC);

CREATE INDEX idx_stores_domain ON public.stores USING btree (domain);

CREATE INDEX idx_stores_slug ON public.stores USING btree (slug);

CREATE UNIQUE INDEX quote_requests_pkey ON public.quote_requests USING btree (id);

alter table "public"."quote_requests" add constraint "quote_requests_pkey" PRIMARY KEY using index "quote_requests_pkey";

alter table "public"."attribute_values" add constraint "attribute_values_attribute_id_fkey" FOREIGN KEY (attribute_id) REFERENCES public.attributes(id) ON DELETE CASCADE not valid;

alter table "public"."attribute_values" validate constraint "attribute_values_attribute_id_fkey";

alter table "public"."attributes" add constraint "attributes_store_id_fkey" FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE not valid;

alter table "public"."attributes" validate constraint "attributes_store_id_fkey";

alter table "public"."product_attribute_values" add constraint "product_attribute_values_attribute_value_id_fkey" FOREIGN KEY (attribute_value_id) REFERENCES public.attribute_values(id) ON DELETE CASCADE not valid;

alter table "public"."product_attribute_values" validate constraint "product_attribute_values_attribute_value_id_fkey";

alter table "public"."product_attribute_values" add constraint "product_attribute_values_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_attribute_values" validate constraint "product_attribute_values_product_id_fkey";

alter table "public"."products" add constraint "products_store_id_fkey" FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_store_id_fkey";

alter table "public"."quote_requests" add constraint "quote_requests_store_id_fkey" FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE not valid;

alter table "public"."quote_requests" validate constraint "quote_requests_store_id_fkey";

alter table "public"."profiles" add constraint "profiles_store_id_fkey" FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_store_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

grant delete on table "public"."quote_requests" to "anon";

grant insert on table "public"."quote_requests" to "anon";

grant references on table "public"."quote_requests" to "anon";

grant select on table "public"."quote_requests" to "anon";

grant trigger on table "public"."quote_requests" to "anon";

grant truncate on table "public"."quote_requests" to "anon";

grant update on table "public"."quote_requests" to "anon";

grant delete on table "public"."quote_requests" to "authenticated";

grant insert on table "public"."quote_requests" to "authenticated";

grant references on table "public"."quote_requests" to "authenticated";

grant select on table "public"."quote_requests" to "authenticated";

grant trigger on table "public"."quote_requests" to "authenticated";

grant truncate on table "public"."quote_requests" to "authenticated";

grant update on table "public"."quote_requests" to "authenticated";

grant delete on table "public"."quote_requests" to "service_role";

grant insert on table "public"."quote_requests" to "service_role";

grant references on table "public"."quote_requests" to "service_role";

grant select on table "public"."quote_requests" to "service_role";

grant trigger on table "public"."quote_requests" to "service_role";

grant truncate on table "public"."quote_requests" to "service_role";

grant update on table "public"."quote_requests" to "service_role";

CREATE TRIGGER update_attribute_values_updated_at BEFORE UPDATE ON public.attribute_values FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attributes_updated_at BEFORE UPDATE ON public.attributes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();



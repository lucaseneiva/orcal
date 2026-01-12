drop trigger if exists "update_attribute_values_updated_at" on "public"."attribute_values";

revoke delete on table "public"."attribute_values" from "anon";

revoke insert on table "public"."attribute_values" from "anon";

revoke references on table "public"."attribute_values" from "anon";

revoke select on table "public"."attribute_values" from "anon";

revoke trigger on table "public"."attribute_values" from "anon";

revoke truncate on table "public"."attribute_values" from "anon";

revoke update on table "public"."attribute_values" from "anon";

revoke delete on table "public"."attribute_values" from "authenticated";

revoke insert on table "public"."attribute_values" from "authenticated";

revoke references on table "public"."attribute_values" from "authenticated";

revoke select on table "public"."attribute_values" from "authenticated";

revoke trigger on table "public"."attribute_values" from "authenticated";

revoke truncate on table "public"."attribute_values" from "authenticated";

revoke update on table "public"."attribute_values" from "authenticated";

revoke delete on table "public"."attribute_values" from "service_role";

revoke insert on table "public"."attribute_values" from "service_role";

revoke references on table "public"."attribute_values" from "service_role";

revoke select on table "public"."attribute_values" from "service_role";

revoke trigger on table "public"."attribute_values" from "service_role";

revoke truncate on table "public"."attribute_values" from "service_role";

revoke update on table "public"."attribute_values" from "service_role";

revoke delete on table "public"."product_attribute_values" from "anon";

revoke insert on table "public"."product_attribute_values" from "anon";

revoke references on table "public"."product_attribute_values" from "anon";

revoke select on table "public"."product_attribute_values" from "anon";

revoke trigger on table "public"."product_attribute_values" from "anon";

revoke truncate on table "public"."product_attribute_values" from "anon";

revoke update on table "public"."product_attribute_values" from "anon";

revoke delete on table "public"."product_attribute_values" from "authenticated";

revoke insert on table "public"."product_attribute_values" from "authenticated";

revoke references on table "public"."product_attribute_values" from "authenticated";

revoke select on table "public"."product_attribute_values" from "authenticated";

revoke trigger on table "public"."product_attribute_values" from "authenticated";

revoke truncate on table "public"."product_attribute_values" from "authenticated";

revoke update on table "public"."product_attribute_values" from "authenticated";

revoke delete on table "public"."product_attribute_values" from "service_role";

revoke insert on table "public"."product_attribute_values" from "service_role";

revoke references on table "public"."product_attribute_values" from "service_role";

revoke select on table "public"."product_attribute_values" from "service_role";

revoke trigger on table "public"."product_attribute_values" from "service_role";

revoke truncate on table "public"."product_attribute_values" from "service_role";

revoke update on table "public"."product_attribute_values" from "service_role";

alter table "public"."attribute_values" drop constraint "attribute_values_attribute_id_fkey";

alter table "public"."product_attribute_values" drop constraint "product_attribute_values_attribute_value_id_fkey";

alter table "public"."product_attribute_values" drop constraint "product_attribute_values_product_id_fkey";

alter table "public"."attribute_values" drop constraint "attribute_values_pkey";

alter table "public"."product_attribute_values" drop constraint "product_attribute_values_pkey";

drop index if exists "public"."product_attribute_values_pkey";

drop index if exists "public"."attribute_values_pkey";

drop index if exists "public"."idx_attribute_values_attr";

drop index if exists "public"."idx_pav_product";

drop index if exists "public"."idx_pav_value";

drop table "public"."attribute_values";

drop table "public"."product_attribute_values";


  create table "public"."options" (
    "id" uuid not null default gen_random_uuid(),
    "attribute_id" uuid not null,
    "name" text not null,
    "created_at" timestamp with time zone default now(),
    "description" text,
    "display_order" integer default 0,
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."products_options" (
    "product_id" uuid not null,
    "option_id" uuid not null
      );


CREATE UNIQUE INDEX products_options_pkey ON public.products_options USING btree (product_id, option_id);

CREATE UNIQUE INDEX attribute_values_pkey ON public.options USING btree (id);

CREATE INDEX idx_attribute_values_attr ON public.options USING btree (attribute_id, display_order);

CREATE INDEX idx_pav_product ON public.products_options USING btree (product_id);

CREATE INDEX idx_pav_value ON public.products_options USING btree (option_id);

alter table "public"."options" add constraint "attribute_values_pkey" PRIMARY KEY using index "attribute_values_pkey";

alter table "public"."products_options" add constraint "products_options_pkey" PRIMARY KEY using index "products_options_pkey";

alter table "public"."options" add constraint "attribute_values_attribute_id_fkey" FOREIGN KEY (attribute_id) REFERENCES public.attributes(id) ON DELETE CASCADE not valid;

alter table "public"."options" validate constraint "attribute_values_attribute_id_fkey";

alter table "public"."products_options" add constraint "product_attribute_values_attribute_value_id_fkey" FOREIGN KEY (option_id) REFERENCES public.options(id) ON DELETE CASCADE not valid;

alter table "public"."products_options" validate constraint "product_attribute_values_attribute_value_id_fkey";

alter table "public"."products_options" add constraint "product_attribute_values_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."products_options" validate constraint "product_attribute_values_product_id_fkey";

grant delete on table "public"."options" to "anon";

grant insert on table "public"."options" to "anon";

grant references on table "public"."options" to "anon";

grant select on table "public"."options" to "anon";

grant trigger on table "public"."options" to "anon";

grant truncate on table "public"."options" to "anon";

grant update on table "public"."options" to "anon";

grant delete on table "public"."options" to "authenticated";

grant insert on table "public"."options" to "authenticated";

grant references on table "public"."options" to "authenticated";

grant select on table "public"."options" to "authenticated";

grant trigger on table "public"."options" to "authenticated";

grant truncate on table "public"."options" to "authenticated";

grant update on table "public"."options" to "authenticated";

grant delete on table "public"."options" to "service_role";

grant insert on table "public"."options" to "service_role";

grant references on table "public"."options" to "service_role";

grant select on table "public"."options" to "service_role";

grant trigger on table "public"."options" to "service_role";

grant truncate on table "public"."options" to "service_role";

grant update on table "public"."options" to "service_role";

grant delete on table "public"."products_options" to "anon";

grant insert on table "public"."products_options" to "anon";

grant references on table "public"."products_options" to "anon";

grant select on table "public"."products_options" to "anon";

grant trigger on table "public"."products_options" to "anon";

grant truncate on table "public"."products_options" to "anon";

grant update on table "public"."products_options" to "anon";

grant delete on table "public"."products_options" to "authenticated";

grant insert on table "public"."products_options" to "authenticated";

grant references on table "public"."products_options" to "authenticated";

grant select on table "public"."products_options" to "authenticated";

grant trigger on table "public"."products_options" to "authenticated";

grant truncate on table "public"."products_options" to "authenticated";

grant update on table "public"."products_options" to "authenticated";

grant delete on table "public"."products_options" to "service_role";

grant insert on table "public"."products_options" to "service_role";

grant references on table "public"."products_options" to "service_role";

grant select on table "public"."products_options" to "service_role";

grant trigger on table "public"."products_options" to "service_role";

grant truncate on table "public"."products_options" to "service_role";

grant update on table "public"."products_options" to "service_role";

CREATE TRIGGER update_attribute_values_updated_at BEFORE UPDATE ON public.options FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();



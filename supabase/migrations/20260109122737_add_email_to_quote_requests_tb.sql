alter table "public"."quote_requests" add column "email" text;


  create policy "Give anon users access to JPG images in folder 1ffg0oo_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'images'::text) AND (storage.extension(name) = 'jpg'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text)));




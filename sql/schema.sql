drop table if exists stores cascade;

drop table if exists attributes cascade;

drop table if exists attribute_values cascade;

drop table if exists products cascade;

drop table if exists product_attribute_values;

drop table if exists profiles;

-- LOJAS (A base de tudo)
create table stores (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  slug text not null unique,
  domain text not null unique,
  primary_color text not null default '#000000',
  logo_url text,
  created_at timestamp default now()
);

-- ATRIBUTOS (Configuração da Loja)
-- Ex: "Material", "Tamanho", "Cor", etc.
create table attributes (
  id uuid primary key default gen_random_uuid (),
  store_id uuid not null,
  name text not null, -- Ex: "Cor"
  slug text not null, -- Ex: "cor" (usado para URLs ou filtros)
  created_at timestamp default now(),
  constraint fk_attributes_store foreign key (store_id) references stores (id) on delete cascade,
  -- Regra: Uma loja não pode ter dois atributos com o mesmo slug (ex: dois "tamanho")
  unique (store_id, slug)
);

-- VALORES DOS ATRIBUTOS (Opções disponíveis)
-- Ex: "Papel Couché 300g", "Supremo300g" (que pertencem a Material); "4x1", "4x4" (que pertencem a Cor), etc.
create table attribute_values (
  id uuid primary key default gen_random_uuid (),
  attribute_id uuid not null,
  name text not null, -- Ex: "Papel Reciclato", "9x9cm", etc.
  created_at timestamp default now(),
  constraint fk_attribute_values_attribute foreign key (attribute_id) references attributes (id) on delete cascade
);

-- PRODUTOS
create table products (
  id uuid primary key default gen_random_uuid (),
  store_id uuid not null,
  name text not null,
  description text,
  image_url text,
  slug text not null,
  status text default 'inactive',
  created_at timestamp default now(),
  updated_at timestamp default now(),
  constraint fk_products_store foreign key (store_id) references stores (id) on delete cascade,
  -- Regra: O slug do produto deve ser único DENTRO daquela loja
  unique (store_id, slug)
);

-- Tabela de ligação (Quais opções esse produto tem?)
-- Ex: O Cartão de Visita X (product_id) tem o Material Papel Couché (attribute_value_id)
create table product_attribute_values (
  product_id uuid not null,
  attribute_value_id uuid not null,
  -- Chave primária composta: evita associar o mesmo valor duas vezes ao mesmo produto
  primary key (product_id, attribute_value_id),
  constraint fk_pav_product foreign key (product_id) references products (id) on delete cascade,
  constraint fk_pav_value foreign key (attribute_value_id) references attribute_values (id) on delete cascade
);

create table profiles (
  id uuid primary key, -- mesmo id do auth
  store_id uuid references stores (id) not null,
  created_at timestamp default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores not null,
  customer_name text not null,
  customer_whatsapp text not null,
  total_items integer default 0,
  items jsonb, -- Vamos salvar o array do carrinho inteiro aqui
  status text default 'pending', -- pending, completed, cancelled
  created_at timestamptz default now()
);

---
with
  -- 1. Cria a Loja
  new_store as (
    insert into
      stores (name, slug, domain, logo_url)
    values
      (
        'ExemploGraf',
        'exemplograf',
        'localhost:3000',
        'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/exemplograf_logo.svg'
      )
    returning
      id
  ),
  -- 2. Cria Atributos
  attr_papel as (
    insert into
      attributes (store_id, name, slug)
    select
      id,
      'Papel',
      'papel'
    from
      new_store
    returning
      id
  ),
  attr_cor as (
    insert into
      attributes (store_id, name, slug)
    select
      id,
      'Cor',
      'cor'
    from
      new_store
    returning
      id
  ),
  -- 3. Cria Valores (Papel)
  val_couche as (
    insert into
      attribute_values (attribute_id, name)
    select
      id,
      'Couché 300g'
    from
      attr_papel
    returning
      id
  ),
  val_reciclato as (
    insert into
      attribute_values (attribute_id, name)
    select
      id,
      'Reciclato 240g'
    from
      attr_papel
    returning
      id
  ),
  -- 4. Cria Valores (Cor)
  val_4x0 as (
    insert into
      attribute_values (attribute_id, name)
    select
      id,
      '4x0 (Frente)'
    from
      attr_cor
    returning
      id
  ),
  val_4x4 as (
    insert into
      attribute_values (attribute_id, name)
    select
      id,
      '4x4 (Frente e Verso)'
    from
      attr_cor
    returning
      id
  ),
  new_profile as (
    insert into
      profiles (id, store_id)
    select
      '50f494b8-7e69-4223-b93b-66613d8cbb80',
      id
    from
      new_store
    returning
      *
  ),
  new_product as (
    insert into
      products (store_id, name, slug, description, image_url)
    select
      id,
      'Cartão de Visita',
      'cartao-visita',
      'Cartão de visita profissional, ideal para apresentar sua marca com clareza e credibilidade. Produzido em papel de alta qualidade, com excelente definição de impressão e acabamento preciso. Perfeito para networking, reuniões e divulgação do seu negócio, transmitindo profissionalismo logo no primeiro contato.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/cartaovisita_exemplograf.avif'
    from
      new_store
    returning
      id
  )
  -- 6. Faz as ligações finais
insert into
  product_attribute_values (product_id, attribute_value_id)
select
  new_product.id,
  val_couche.id
from
  new_product,
  val_couche
union all
select
  new_product.id,
  val_reciclato.id
from
  new_product,
  val_reciclato
union all
select
  new_product.id,
  val_4x0.id
from
  new_product,
  val_4x0
union all
select
  new_product.id,
  val_4x4.id
from
  new_product,
  val_4x4;
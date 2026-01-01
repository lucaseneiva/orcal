drop table if exists stores cascade;
drop table if exists attributes cascade;
drop table if exists attribute_values cascade;
drop table if exists products cascade;
drop table if exists product_attribute_values;

-- LOJAS (A base de tudo)
create table stores (
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null,
  name text not null, -- Ex: "Cor"
  slug text not null, -- Ex: "cor" (usado para URLs ou filtros)
  created_at timestamp default now(),

  constraint fk_attributes_store
    foreign key (store_id)
    references stores(id)
    on delete cascade,

  -- Regra: Uma loja não pode ter dois atributos com o mesmo slug (ex: dois "tamanho")
  unique(store_id, slug) 
);

-- VALORES DOS ATRIBUTOS (Opções disponíveis)
-- Ex: "Papel Couché 300g", "Supremo300g" (que pertencem a Material); "4x1", "4x4" (que pertencem a Cor), etc.
create table attribute_values (
  id uuid primary key default gen_random_uuid(),
  attribute_id uuid not null,
  name text not null, -- Ex: "Papel Reciclato", "9x9cm", etc.
  created_at timestamp default now(),
  constraint fk_attribute_values_attribute
    foreign key (attribute_id)
    references attributes(id)
    on delete cascade
);

-- PRODUTOS
create table products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null,
  name text not null,
  description text,
  image_url text,
  slug text not null,
  created_at timestamp default now(),
  updated_at timestamp default now(),

  constraint fk_products_store
    foreign key (store_id)
    references stores(id)
    on delete cascade,

  -- Regra: O slug do produto deve ser único DENTRO daquela loja
  unique(store_id, slug)
);

-- Tabela de ligação (Quais opções esse produto tem?)
-- Ex: O Cartão de Visita X (product_id) tem o Material Papel Couché (attribute_value_id)
create table product_attribute_values (
  product_id uuid not null,
  attribute_value_id uuid not null,
  
  -- Chave primária composta: evita associar o mesmo valor duas vezes ao mesmo produto
  primary key (product_id, attribute_value_id),

  constraint fk_pav_product
    foreign key (product_id)
    references products(id)
    on delete cascade,

  constraint fk_pav_value
    foreign key (attribute_value_id)
    references attribute_values(id)
    on delete cascade
);

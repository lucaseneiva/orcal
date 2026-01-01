WITH 
  -- 1. Cria a Loja
  new_store AS (
    INSERT INTO stores (name, slug, domain, logo_url) 
    VALUES ('ExemploGraf', 'exemplograf', 'localhost:3000', 'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/exemplograf_logo.svg') 
    RETURNING id
  ),
  
  -- 2. Cria Atributos
  attr_papel AS (
    INSERT INTO attributes (store_id, name, slug) 
    SELECT id, 'Papel', 'papel' FROM new_store 
    RETURNING id
  ),
  attr_cor AS (
    INSERT INTO attributes (store_id, name, slug) 
    SELECT id, 'Cor', 'cor' FROM new_store 
    RETURNING id
  ),

  -- 3. Cria Valores (Papel)
  val_couche AS (
    INSERT INTO attribute_values (attribute_id, name) 
    SELECT id, 'Couché 300g' FROM attr_papel 
    RETURNING id
  ),
  val_reciclato AS (
    INSERT INTO attribute_values (attribute_id, name) 
    SELECT id, 'Reciclato 240g' FROM attr_papel 
    RETURNING id
  ),

  -- 4. Cria Valores (Cor)
  val_4x0 AS (
    INSERT INTO attribute_values (attribute_id, name) 
    SELECT id, '4x0 (Frente)' FROM attr_cor
    RETURNING id
  ),
  val_4x4 AS (
    INSERT INTO attribute_values (attribute_id, name) 
    SELECT id, '4x4 (Frente e Verso)' FROM attr_cor
    RETURNING id
  ),

  -- 5. Cria o Produto (Importante: verifique se sua tabela products tem a coluna 'price')
  new_product AS (
    INSERT INTO products (store_id, name, slug, description, image_url) 
    SELECT id, 'Cartão de Visita', 'cartao-visita', 'Cartão de visita profissional, ideal para apresentar sua marca com clareza e credibilidade. Produzido em papel de alta qualidade, com excelente definição de impressão e acabamento preciso. Perfeito para networking, reuniões e divulgação do seu negócio, transmitindo profissionalismo logo no primeiro contato.', 'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/cartaovisita_exemplograf.avif'
    FROM new_store 
    RETURNING id
  )

-- 6. Faz as ligações finais
INSERT INTO product_attribute_values (product_id, attribute_value_id)
SELECT new_product.id, val_couche.id FROM new_product, val_couche
UNION ALL
SELECT new_product.id, val_reciclato.id FROM new_product, val_reciclato
UNION ALL
SELECT new_product.id, val_4x0.id FROM new_product, val_4x0
UNION ALL
SELECT new_product.id, val_4x4.id FROM new_product, val_4x4;
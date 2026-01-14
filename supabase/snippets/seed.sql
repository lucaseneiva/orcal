---============================================================================
-- DADOS DE EXEMPLO (ExemploGraf) - CATÁLOGO COMPLETO
-- SCRIPT DE RESEEDING (limpa e recria todos os dados)
-- ============================================================================

-- PRIMEIRO: DELETAR DADOS EXISTENTES (ordem inversa das dependências)
DELETE FROM products_options WHERE EXISTS (SELECT 1 FROM stores WHERE slug = 'exemplograf');
DELETE FROM options WHERE EXISTS (SELECT 1 FROM stores WHERE slug = 'exemplograf');
DELETE FROM attributes WHERE EXISTS (SELECT 1 FROM stores WHERE slug = 'exemplograf');
DELETE FROM products WHERE EXISTS (SELECT 1 FROM stores WHERE slug = 'exemplograf');
DELETE FROM profiles WHERE EXISTS (SELECT 1 FROM stores WHERE slug = 'exemplograf');
DELETE FROM stores WHERE slug = 'exemplograf';

-- AGORA: CRIAR NOVOS DADOS
with
  new_store as (
    insert into stores (name, slug, domain, logo_url, primary_color)
    values (
      'ExemploGraf',
      'exemplograf',
      'exemplograf.orcal.com.br',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/exemplograf_logo.svg',
      '#4bc42d'
    )
    returning id
  ),
  new_profile as (
    insert into profiles (id, store_id, email, full_name)
    select
      '50f494b8-7e69-4223-b93b-66613d8cbb80',
      id,
      'admin@exemplograf.com',
      'Administrador'
    from new_store
    returning *
  ),
  
  -- ATRIBUTOS/CARACTERÍSTICAS (SEM QUANTIDADE)
  attr_papel as (
    insert into attributes (store_id, name, slug, display_order)
    select id, 'Papel', 'papel', 1
    from new_store
    returning id
  ),
  attr_cor as (
    insert into attributes (store_id, name, slug, display_order)
    select id, 'Cor', 'cor', 2
    from new_store
    returning id
  ),
  attr_acabamento as (
    insert into attributes (store_id, name, slug, display_order)
    select id, 'Acabamento', 'acabamento', 3
    from new_store
    returning id
  ),
  attr_formato as (
    insert into attributes (store_id, name, slug, display_order)
    select id, 'Formato', 'formato', 4
    from new_store
    returning id
  ),
  
  -- OPÇÕES/ATRIBUTE_VALUES
  -- Opções de Papel
  val_couche_300g as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Couché 300g', 'Papel couchê brilhante de alta gramatura. Ideal para materiais premium que exigem ótima definição de cores.', 1
    from attr_papel
    returning id
  ),
  val_reciclato_240g as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Reciclato 240g', 'Papel ecológico com textura rústica. Perfeito para quem valoriza sustentabilidade sem abrir mão da qualidade.', 2
    from attr_papel
    returning id
  ),
  val_offset_90g as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Offset 90g', 'Papel offset padrão para impressão em grande volume. Excelente custo-benefício para materiais de distribuição.', 3
    from attr_papel
    returning id
  ),
  val_color_120g as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Color 120g', 'Papel color plus com alto brancamento. Proporciona cores mais vivas e brilhantes na impressão.', 4
    from attr_papel
    returning id
  ),
  val_adesivo as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Adesivo Vinil', 'Material adesivo de alta resistência. Perfeito para aplicação em vidros, veículos e superfícies lisas.', 5
    from attr_papel
    returning id
  ),
  
  -- Opções de Cor
  val_4x0 as (
    insert into options (attribute_id, name, description, display_order)
    select id, '4x0 (Frente apenas)', 'Impressão colorida apenas no lado frontal. Verso em branco ou com cor plana.', 1
    from attr_cor
    returning id
  ),
  val_4x4 as (
    insert into options (attribute_id, name, description, display_order)
    select id, '4x4 (Frente e Verso)', 'Impressão colorida em ambos os lados. Ideal para materiais que precisam de informações nos dois lados.', 2
    from attr_cor
    returning id
  ),
  val_1x1 as (
    insert into options (attribute_id, name, description, display_order)
    select id, '1x1 (Preto e Branco)', 'Impressão monocromática em preto. Opção econômica para materiais internos ou rascunhos.', 3
    from attr_cor
    returning id
  ),
  
  -- Opções de Acabamento
  val_verniz_total as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Verniz Total', 'Aplicação de verniz em toda superfície. Proporciona brilho e proteção extra contra manchas e umidade.', 1
    from attr_acabamento
    returning id
  ),
  val_verniz_localizado as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Verniz Localizado', 'Verniz aplicado apenas em áreas específicas. Cria efeito de relevo e destaque em partes do design.', 2
    from attr_acabamento
    returning id
  ),
  val_laminacao_brilho as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Laminação Brilho', 'Película plástica brilhante aplicada sobre o papel. Aumenta durabilidade e realça cores vibrantes.', 3
    from attr_acabamento
    returning id
  ),
  val_laminacao_fosco as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Laminação Fosco', 'Película plástica fosca que elimina reflexos. Conforto visual ideal para textos longos e leitura.', 4
    from attr_acabamento
    returning id
  ),
  val_sem_acabamento as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Sem Acabamento', 'Impressão sem acabamento especial. Mantém a textura natural do papel escolhido.', 5
    from attr_acabamento
    returning id
  ),
  
  -- Opções de Formato
  val_padrao as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Formato Padrão', 'Formato tradicional do produto sem dobras ou cortes especiais.', 1
    from attr_formato
    returning id
  ),
  val_dobrado as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Dobrado', 'Produto com uma ou mais dobras. Ideal para folders, convites e materiais com múltiplas páginas.', 2
    from attr_formato
    returning id
  ),
  val_personalizado as (
    insert into options (attribute_id, name, description, display_order)
    select id, 'Personalizado', 'Formato e cortes especiais conforme necessidade do cliente. Requer arquivo com marcas de corte.', 3
    from attr_formato
    returning id
  ),

  -- PRODUTO 1: Cartão de Visita
  product_cartao_visita as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Cartão de Visita',
      'cartao-de-visita',
      'Cartão de visita profissional, ideal para apresentar sua marca com clareza e credibilidade. Produzido em papel de alta qualidade, com excelente definição de impressão e acabamento preciso. Perfeito para networking, reuniões e divulgação do seu negócio, transmitindo profissionalismo logo no primeiro contato.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/cartao-visita.avif',
      'active',
      1
    from new_store
    returning id
  ),

  -- PRODUTO 2: Flyer/panfleto
  product_flyer as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Flyer / Panfleto',
      'flyer-panfleto',
      'Material promocional ideal para divulgação de eventos, promoções e lançamentos. Design atrativo e impacto visual garantido para chamar atenção do seu público-alvo. Opções variadas de papel e acabamentos para cada necessidade.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/flyer.avif',
      'active',
      2
    from new_store
    returning id
  ),

  -- PRODUTO 3: Folder/Brochura
  product_folder as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Folder / Brochura',
      'folder-brochura',
      'Material institucional perfeito para apresentar sua empresa, produtos ou serviços com sofisticação. Conte mais sobre seu negócio com um material elegante e profissional que transmite confiança e qualidade.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/folder.avif',
      'active',
      3
    from new_store
    returning id
  ),

  -- PRODUTO 4: Cartaz/Pôster
  product_cartaz as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Cartaz / Pôster',
      'cartaz-poster',
      'Ideal para divulgação em pontos estratégicos, eventos e espaços públicos. Alta qualidade de impressão e cores vibrantes que garantem visibilidade mesmo à distância.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/cartaz.avif',
      'active',
      4
    from new_store
    returning id
  ),

  -- PRODUTO 5: Adesivo
  product_adesivo as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Adesivo Promocional',
      'adesivo-promocional',
      'Adesivos de alta qualidade para branding, produtos, eventos ou decoração. Resistente à água e raios UV, perfeito para uso interno e externo.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/adesivo.avif',
      'active',
      5
    from new_store
    returning id
  ),

  -- PRODUTO 6: Convite
  product_convite as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Convite Social',
      'convite-social',
      'Convites elegantes para casamentos, aniversários, formaturas e eventos especiais. Personalização completa para tornar seu evento inesquecível desde o convite.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/convite.avif',
      'active',
      6
    from new_store
    returning id
  ),

  -- PRODUTO 7: Banner
  product_banner as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Banner Publicitário',
      'banner-publicitario',
      'Banners de lona para eventos, promoções e sinalização. Alta durabilidade e qualidade de impressão para impacto visual máximo.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/banner.avif',
      'active',
      7
    from new_store
    returning id
  ),

  -- PRODUTO 8: Envelope
  product_envelope as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Envelope Personalizado',
      'envelope-personalizado',
      'Envelopes com impressão personalizada para correspondência corporativa, mailings e eventos. Transmita profissionalismo em cada detalhe.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/envelope.avif',
      'active',
      8
    from new_store
    returning id
  ),

  -- PRODUTO 9: Bloco de Notas
  product_bloco as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Bloco de Notas Personalizado',
      'bloco-notas-personalizado',
      'Blocos de anotações com capa personalizada para sua empresa. Ideal para presentear clientes, funcionários ou usar internamente.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/bloco-notas.avif',
      'active',
      9
    from new_store
    returning id
  ),

  -- PRODUTO 10: Tag/Etiqueta
  product_tag as (
    insert into products (store_id, name, slug, description, image_url, status, display_order)
    select
      id,
      'Tag / Etiqueta',
      'tag-etiqueta',
      'Etiquetas e tags personalizadas para produtos, embalagens, roupas e organização. Diversos formatos e materiais disponíveis.',
      'https://gruykkqpajxvzwntnacb.supabase.co/storage/v1/object/public/images/etiqueta.avif',
      'active',
      10
    from new_store
    returning id
  )

-- ASSOCIAÇÕES PRODUTO-OPÇÕES (products_options)
-- Para cada produto, associamos opções relevantes
insert into products_options (product_id, option_id)
-- Cartão de Visita (usa todas as opções de papel, cor e acabamento)
select product_cartao_visita.id, val_couche_300g.id from product_cartao_visita, val_couche_300g
union all
select product_cartao_visita.id, val_reciclato_240g.id from product_cartao_visita, val_reciclato_240g
union all
select product_cartao_visita.id, val_4x0.id from product_cartao_visita, val_4x0
union all
select product_cartao_visita.id, val_4x4.id from product_cartao_visita, val_4x4
union all
select product_cartao_visita.id, val_verniz_total.id from product_cartao_visita, val_verniz_total
union all
select product_cartao_visita.id, val_verniz_localizado.id from product_cartao_visita, val_verniz_localizado
union all
select product_cartao_visita.id, val_laminacao_brilho.id from product_cartao_visita, val_laminacao_brilho

-- Flyer/Panfleto
union all
select product_flyer.id, val_couche_300g.id from product_flyer, val_couche_300g
union all
select product_flyer.id, val_offset_90g.id from product_flyer, val_offset_90g
union all
select product_flyer.id, val_4x0.id from product_flyer, val_4x0
union all
select product_flyer.id, val_4x4.id from product_flyer, val_4x4

-- Folder/Brochura
union all
select product_folder.id, val_couche_300g.id from product_folder, val_couche_300g
union all
select product_folder.id, val_reciclato_240g.id from product_folder, val_reciclato_240g
union all
select product_folder.id, val_4x4.id from product_folder, val_4x4
union all
select product_folder.id, val_dobrado.id from product_folder, val_dobrado
union all
select product_folder.id, val_verniz_total.id from product_folder, val_verniz_total

-- Cartaz/Pôster
union all
select product_cartaz.id, val_color_120g.id from product_cartaz, val_color_120g
union all
select product_cartaz.id, val_4x4.id from product_cartaz, val_4x4
union all
select product_cartaz.id, val_laminacao_brilho.id from product_cartaz, val_laminacao_brilho
union all
select product_cartaz.id, val_laminacao_fosco.id from product_cartaz, val_laminacao_fosco

-- Adesivo Promocional
union all
select product_adesivo.id, val_adesivo.id from product_adesivo, val_adesivo
union all
select product_adesivo.id, val_4x4.id from product_adesivo, val_4x4
union all
select product_adesivo.id, val_sem_acabamento.id from product_adesivo, val_sem_acabamento

-- Convite Social
union all
select product_convite.id, val_reciclato_240g.id from product_convite, val_reciclato_240g
union all
select product_convite.id, val_color_120g.id from product_convite, val_color_120g
union all
select product_convite.id, val_4x4.id from product_convite, val_4x4
union all
select product_convite.id, val_verniz_localizado.id from product_convite, val_verniz_localizado
union all
select product_convite.id, val_dobrado.id from product_convite, val_dobrado

-- Banner Publicitário
union all
select product_banner.id, val_4x4.id from product_banner, val_4x4
union all
select product_banner.id, val_sem_acabamento.id from product_banner, val_sem_acabamento
union all
select product_banner.id, val_personalizado.id from product_banner, val_personalizado

-- Envelope Personalizado
union all
select product_envelope.id, val_offset_90g.id from product_envelope, val_offset_90g
union all
select product_envelope.id, val_4x0.id from product_envelope, val_4x0
union all
select product_envelope.id, val_4x4.id from product_envelope, val_4x4

-- Bloco de Notas
union all
select product_bloco.id, val_offset_90g.id from product_bloco, val_offset_90g
union all
select product_bloco.id, val_4x0.id from product_bloco, val_4x0
union all
select product_bloco.id, val_4x4.id from product_bloco, val_4x4

-- Tag/Etiqueta
union all
select product_tag.id, val_offset_90g.id from product_tag, val_offset_90g
union all
select product_tag.id, val_adesivo.id from product_tag, val_adesivo
union all
select product_tag.id, val_4x4.id from product_tag, val_4x4
union all
select product_tag.id, val_1x1.id from product_tag, val_1x1;

-- ============================================================================
-- FIM DO SCRIPT DE SEEDING
-- ============================================================================
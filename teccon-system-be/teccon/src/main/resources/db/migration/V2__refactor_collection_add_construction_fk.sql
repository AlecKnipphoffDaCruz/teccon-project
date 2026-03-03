-- =====================================
-- V2 - Refactor collections table
-- Remove construction_name
-- Add construction_id (FK)
-- =====================================

-- 1️⃣ Adicionar nova coluna (sem NOT NULL primeiro para evitar erro)
ALTER TABLE collections
    ADD COLUMN construction_id BIGINT;

-- 2️⃣ Criar foreign key
ALTER TABLE collections
    ADD CONSTRAINT fk_collection_construction
        FOREIGN KEY (construction_id)
            REFERENCES constructions(id)
            ON DELETE CASCADE;

-- 3️⃣ Se já existirem dados, aqui seria o ponto para atualizar manualmente:
-- UPDATE collections SET construction_id = X WHERE id = Y;

-- 4️⃣ Tornar NOT NULL (após garantir dados válidos)
ALTER TABLE collections
    ALTER COLUMN construction_id SET NOT NULL;

-- 5️⃣ Remover coluna antiga
ALTER TABLE collections
DROP COLUMN construction_name;
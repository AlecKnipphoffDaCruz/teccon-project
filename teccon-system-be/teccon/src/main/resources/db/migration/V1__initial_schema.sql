-- =========================
-- EXTENSIONS
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- CLIENT
-- =========================
CREATE TABLE clients (
                         id BIGSERIAL PRIMARY KEY,
                         name VARCHAR(150) NOT NULL,
                         contact VARCHAR(150),
                         is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- =========================
-- LOCATION
-- =========================
CREATE TABLE locations (
                           id BIGSERIAL PRIMARY KEY,
                           state VARCHAR(50) NOT NULL,
                           city VARCHAR(100) NOT NULL,
                           neighborhood VARCHAR(100),
                           street VARCHAR(150),
                           number INTEGER
);

-- =========================
-- CONSTRUCTION
-- =========================
CREATE TABLE constructions (
                               id BIGSERIAL PRIMARY KEY,
                               client_id BIGINT NOT NULL,
                               location_id BIGINT NOT NULL,
                               name VARCHAR(150) NOT NULL,
                               curing_ages_expected INTEGER[],
                               quantity_expected INTEGER,
                               obs TEXT,

                               CONSTRAINT fk_construction_client
                                   FOREIGN KEY (client_id)
                                       REFERENCES clients(id)
                                       ON DELETE CASCADE,

                               CONSTRAINT fk_construction_location
                                   FOREIGN KEY (location_id)
                                       REFERENCES locations(id)
                                       ON DELETE CASCADE
);

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       name VARCHAR(150) NOT NULL,
                       contact VARCHAR(150),
                       login VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL,
                       client_id BIGINT,
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,

                       CONSTRAINT fk_user_client
                           FOREIGN KEY (client_id)
                               REFERENCES clients(id)
                               ON DELETE SET NULL
);

-- =========================
-- COLLECTION
-- =========================
CREATE TABLE collections (
                             id BIGSERIAL PRIMARY KEY,
                             status VARCHAR(50) NOT NULL,
                             construction_name VARCHAR(150),
                             client_id BIGINT NOT NULL,
                             molding_date TIMESTAMP,
                             fck_strength DOUBLE PRECISION,
                             concrete_type VARCHAR(50),
                             concrete_supplier VARCHAR(150),
                             has_additive BOOLEAN,
                             additive_type VARCHAR(100),
                             casting_method VARCHAR(50),
                             total_volume DOUBLE PRECISION,
                             notes TEXT,

                             CONSTRAINT fk_collection_client
                                 FOREIGN KEY (client_id)
                                     REFERENCES clients(id)
                                     ON DELETE CASCADE
);

-- =========================
-- SAMPLE
-- =========================
CREATE TABLE samples (
                         id BIGSERIAL PRIMARY KEY,
                         collection_id BIGINT NOT NULL,
                         serial_number VARCHAR(100),
                         capsule_count INTEGER,
                         invoice_number INTEGER,
                         seal_number INTEGER,
                         load_time TIMESTAMP,
                         molding_time TIMESTAMP,
                         slump_test DOUBLE PRECISION,
                         extra_water_added DOUBLE PRECISION,
                         volume DOUBLE PRECISION,
                         concrete_area VARCHAR(150),

                         CONSTRAINT fk_sample_collection
                             FOREIGN KEY (collection_id)
                                 REFERENCES collections(id)
                                 ON DELETE CASCADE
);

-- =========================
-- CAPSULE RESULT
-- =========================
CREATE TABLE capsule_results (
                                 id BIGSERIAL PRIMARY KEY,
                                 sample_id BIGINT NOT NULL,
                                 curing_age_days INTEGER,
                                 failure_load_kgf DOUBLE PRECISION,
                                 compressive_strength_mpa DOUBLE PRECISION,
                                 press_type VARCHAR(50),
                                 tested_at TIMESTAMP,

                                 CONSTRAINT fk_capsule_sample
                                     FOREIGN KEY (sample_id)
                                         REFERENCES samples(id)
                                         ON DELETE CASCADE
);

-- =========================
-- INDEXES
-- =========================
CREATE INDEX idx_user_login ON users(login);
CREATE INDEX idx_collection_status ON collections(status);
CREATE INDEX idx_sample_serial ON samples(serial_number);
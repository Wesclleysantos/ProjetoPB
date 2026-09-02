CREATE TABLE bebida (
    id SERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL UNIQUE,

    fator_hidratacao NUMERIC(4,2) NOT NULL
);
CREATE TABLE conquista (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    pontos INTEGER NOT NULL,

    CONSTRAINT chk_conquista_pontos
        CHECK (pontos >= 0)
);
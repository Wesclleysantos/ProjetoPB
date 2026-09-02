CREATE TABLE consumo (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL,

    bebida_id INTEGER NOT NULL,

    quantidade_ml INTEGER NOT NULL,

    hidratacao_calculada NUMERIC(8,2) NOT NULL,

    data_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_consumo_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_consumo_bebida
        FOREIGN KEY (bebida_id)
        REFERENCES bebida(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_consumo_quantidade
        CHECK (quantidade_ml > 0),

    CONSTRAINT chk_consumo_hidratacao
        CHECK (hidratacao_calculada >= 0)
);
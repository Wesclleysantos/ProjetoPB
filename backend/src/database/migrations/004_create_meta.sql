CREATE TABLE meta (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL,

    quantidade_ml INTEGER NOT NULL,

    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,

    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_meta_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_meta_quantidade
        CHECK (quantidade_ml > 0)
);
CREATE TABLE usuario_conquista (
    usuario_id INTEGER NOT NULL,
    conquista_id INTEGER NOT NULL,
    data_conquista TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_usuario_conquista
        PRIMARY KEY (usuario_id, conquista_id),

    CONSTRAINT fk_usuario_conquista_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario_conquista_conquista
        FOREIGN KEY (conquista_id)
        REFERENCES conquista(id)
        ON DELETE CASCADE
);
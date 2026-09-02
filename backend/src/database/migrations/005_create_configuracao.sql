CREATE TABLE configuracao (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL UNIQUE,

    lembrete_ativo BOOLEAN NOT NULL DEFAULT TRUE,

    intervalo_lembrete INTEGER NOT NULL DEFAULT 60,

    CONSTRAINT fk_configuracao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_intervalo_lembrete
        CHECK (intervalo_lembrete > 0)
);
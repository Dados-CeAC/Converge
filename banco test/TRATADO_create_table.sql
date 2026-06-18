-- CREATE TABLE gerada a partir da planilha
-- Tabela: funcionarios

CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpf TEXT,
    nome_empresa TEXT,
    nome_filial TEXT,
    matricula TEXT,
    nome TEXT,
    cargo TEXT,
    cod_cargo INTEGER,
    nome_cargo TEXT,
    data_admissao DATE,
    desc_situacao TEXT,
    data_situacao DATE,
    desc_vinculo TEXT,
    desc_tipo_vinculo TEXT,
    local_trab TEXT,
    nome_local_trab TEXT,
    data_nascimento DATE,
    centro_custo TEXT,
    funcao TEXT,
    cbo TEXT,
    instrucao TEXT,
    sexo VARCHAR(1),
    email_funcional TEXT
);

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_funcionarios_matricula ON funcionarios(matricula);

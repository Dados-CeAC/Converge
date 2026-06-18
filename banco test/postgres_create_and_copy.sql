-- Script PostgreSQL: CREATE TABLE e instruções para importar CSV gerado

CREATE TABLE IF NOT EXISTS funcionarios (
    id SERIAL PRIMARY KEY,
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
    cbo INTEGER,
    instrucao TEXT,
    sexo VARCHAR(1),
    email_funcional TEXT
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_funcionarios_matricula ON funcionarios(matricula);

-- Instruções para importar CSV usando psql (executar no cliente psql):
-- Assumindo que o CSV foi gerado em 'sheet1_export.csv' e tem o cabeçalho correspondente
-- Execute no terminal:
-- \copy funcionarios(cpf, nome_empresa, nome_filial, matricula, nome, cargo, cod_cargo, nome_cargo, data_admissao, desc_situacao, data_situacao, desc_vinculo, desc_tipo_vinculo, local_trab, nome_local_trab, data_nascimento, centro_custo, funcao, cbo, instrucao, sexo, email_funcional) FROM 'sheet1_export.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '');


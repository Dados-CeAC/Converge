-- View de teste para o banco SQLite
-- Esta view expõe informações principais de funcionários para consulta rápida.

CREATE VIEW IF NOT EXISTS vw_funcionarios AS
SELECT
    [Número de CPF] AS cpf,
    [Nome Empresa] AS nome_empresa,
    [Nome Filial] AS nome_filial,
    [Matrícula] AS matricula,
    [Nome] AS nome,
    [Cargo] AS cargo,
    [Cód. Cargo] AS cod_cargo,
    [Nome Cargo] AS nome_cargo,
    [Data de Admissão] AS data_admissao,
    [Desc. Situação] AS situacao,
    [Data de Situação] AS data_situacao,
    [Desc. Vínculo] AS desc_vinculo,
    [Desc. Tipo de Vínculo] AS desc_tipo_vinculo,
    [Local Trab.] AS local_trab,
    [Nome Local Trab.] AS nome_local_trab,
    [Data de Nascimento] AS data_nascimento,
    [Cód. CBO] AS cbo,
    [Instrução] AS instrucao,
    [Sexo] AS sexo,
    [E-mail Funcional] AS email_funcional
FROM sheet1;

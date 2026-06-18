#!/usr/bin/env python3
"""Cria um banco SQLite pu_2026.db com a tabela de funcionários."""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / 'pu_2026.db'

schema = '''
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
    cbo INTEGER,
    instrucao TEXT,
    sexo VARCHAR(1),
    email_funcional TEXT
);
'''

con = sqlite3.connect(DB_PATH)
con.executescript(schema)
con.close()
print(f'Banco criado: {DB_PATH}')

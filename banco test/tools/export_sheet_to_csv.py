"""
Exporta a tabela `sheet1` do SQLite para CSV mapeando colunas para o esquema desejado.

Uso:
  python tools\export_sheet_to_csv.py caminho_para_db caminho_saida.csv

"""
import sys
import sqlite3
import csv

if len(sys.argv) < 3:
    print("Uso: export_sheet_to_csv.py caminho_para_db caminho_saida.csv")
    sys.exit(1)

db = sys.argv[1]
out_csv = sys.argv[2]
table = 'sheet1'

# mapeamento: coluna origem -> coluna destino
mapping = [
    ("Número de CPF", "cpf"),
    ("Nome Empresa", "nome_empresa"),
    ("Nome Filial", "nome_filial"),
    ("Matrícula", "matricula"),
    ("Nome", "nome"),
    ("Cargo", "cargo"),
    ("Cód. Cargo", "cod_cargo"),
    ("Nome Cargo", "nome_cargo"),
    ("Data de Admissão", "data_admissao"),
    ("Desc. Situação", "desc_situacao"),
    ("Data de Situação", "data_situacao"),
    ("Desc. Vínculo", "desc_vinculo"),
    ("Desc. Tipo de Vínculo", "desc_tipo_vinculo"),
    ("Local Trab.", "local_trab"),
    ("Nome Local Trab.", "nome_local_trab"),
    ("Data de Nascimento", "data_nascimento"),
    ("C.Custo Contab.", "centro_custo"),
    ("Função", "funcao"),
    ("Cód. CBO", "cbo"),
    ("Instrução", "instrucao"),
    ("Sexo", "sexo"),
    ("E-mail Funcional", "email_funcional")
]

con = sqlite3.connect(db)
cur = con.cursor()

# get columns from table
cur.execute(f"PRAGMA table_info('{table}')")
cols = [r[1] for r in cur.fetchall()]

# build select list: use NULL if column not present
select_cols = []
for src, dst in mapping:
    if src in cols:
        select_cols.append(f"[{src}]")
    else:
        select_cols.append("NULL")

query = f"SELECT {', '.join(select_cols)} FROM {table}"
cur.execute(query)

with open(out_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    # header with destination names
    writer.writerow([dst for _, dst in mapping])
    for row in cur:
        writer.writerow(row)

con.close()
print(f"CSV exportado para: {out_csv}")

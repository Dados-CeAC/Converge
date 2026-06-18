import csv
import sqlite3
import sys

if len(sys.argv) != 3:
    print('Uso: python export_results_csv.py caminho_para_db arquivo_saida.csv')
    sys.exit(1)

db_path = sys.argv[1]
csv_path = sys.argv[2]

fields = [
    'Número de CPF',
    'Nome Empresa',
    'Nome Filial',
    'Matrícula',
    'Nome',
    'Cargo',
    'Desc. Situação',
    'Data de Admissão',
    'Data de Situação',
    'Desc. Vínculo',
    'Desc. Tipo de Vínculo',
    'Local Trab.',
    'Nome Local Trab.',
    'Data de Nascimento',
    'Cód. CBO',
    'Instrução',
    'Sexo',
    'E-mail Funcional'
]

con = sqlite3.connect(db_path)
cur = con.cursor()
cur.execute(f"SELECT {', '.join([f'[{f}]' for f in fields])} FROM sheet1")
rows = cur.fetchall()
con.close()

with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(fields)
    for row in rows:
        writer.writerow(row)

print(f'Exportado {len(rows)} linhas para {csv_path}')

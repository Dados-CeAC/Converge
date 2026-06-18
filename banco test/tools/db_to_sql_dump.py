"""
Gera um dump SQL (schema + INSERTs) a partir de um arquivo SQLite.

Uso:
  python tools\db_to_sql_dump.py caminho_para_db caminho_de_saida.sql

"""
import sys
import sqlite3

if len(sys.argv) < 3:
    print("Uso: python db_to_sql_dump.py caminho_para_db arquivo_saida.sql")
    sys.exit(1)

db_path = sys.argv[1]
out_path = sys.argv[2]

con = sqlite3.connect(db_path)
with open(out_path, "w", encoding="utf-8") as f:
    for line in con.iterdump():
        f.write('%s\n' % line)
con.close()
print(f"Dump salvo em: {out_path}")

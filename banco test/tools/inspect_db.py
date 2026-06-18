import sys
import sqlite3

if len(sys.argv) < 2:
    print("Uso: inspect_db.py caminho_para_db [tabela]")
    sys.exit(1)

db = sys.argv[1]
table = sys.argv[2] if len(sys.argv) > 2 else 'sheet1'

con = sqlite3.connect(db)
cur = con.execute(f"PRAGMA table_info('{table}')")
cols = cur.fetchall()
print('COLUMNS:')
for c in cols:
    print(c)

cur = con.execute(f"SELECT * FROM {table} LIMIT 1")
row = cur.fetchone()
if row:
    print('\nSAMPLE ROW:')
    print(row)
else:
    print('\nNo rows in table')

con.close()

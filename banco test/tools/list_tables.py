import sys
import sqlite3

if len(sys.argv) < 2:
    print("Uso: python list_tables.py caminho_para_db")
    sys.exit(1)

db = sys.argv[1]
con = sqlite3.connect(db)
cur = con.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cur.fetchall()]
print(tables)
con.close()

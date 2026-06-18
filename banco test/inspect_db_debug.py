import sqlite3
DB='TRATADO_Colab.db'
con=sqlite3.connect(DB)
con.row_factory=sqlite3.Row
cur=con.cursor()
print('DB file:',DB)
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables=[r[0] for r in cur.fetchall()]
print('Tables:',tables)
for t in tables:
    print('\nTable:',t)
    cur.execute(f"PRAGMA table_info('{t}')")
    cols=[r[1] for r in cur.fetchall()]
    print('Columns:',cols)
    # try to fetch some sample rows
    try:
        cur.execute(f"SELECT * FROM '{t}' LIMIT 5")
        rows=cur.fetchall()
        print('Sample rows count:', len(rows))
        if rows:
            for i,row in enumerate(rows[:3]):
                print(' Row',i, dict(row))
    except Exception as e:
        print(' Error reading rows:',e)

# Check distinct values for suspected columns
candidates={'setor': ['nome_local_trab','local_trab','centro_custo'], 'filial':['nome_filial','filial']}
for key,cols in candidates.items():
    print('\nDistinct candidates for', key)
    for t in tables:
        cur.execute(f"PRAGMA table_info('{t}')")
        table_cols=[r[1] for r in cur.fetchall()]
        for col in cols:
            if col in table_cols:
                try:
                    cur.execute(f"SELECT DISTINCT \"{col}\" FROM \"{t}\" WHERE \"{col}\" IS NOT NULL AND \"{col}\" <> '' LIMIT 10")
                    vals=[r[0] for r in cur.fetchall()]
                    print(f" {t}.{col}: {vals[:5]}")
                except Exception as e:
                    print('  error:',e)
con.close()

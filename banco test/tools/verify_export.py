import csv
import pathlib
import sqlite3
import itertools

csv_path = pathlib.Path(r'c:\Users\ellen.fgomes\Documents\banco test\sheet1_export.csv')
db_path = pathlib.Path(r'c:\Users\ellen.fgomes\Documents\banco test\TRATADO_Colab.db')

def verify_csv(path):
    with path.open('r', encoding='utf-8', newline='') as f:
        reader = csv.reader(f)
        header = next(reader)
        print('CSV header:', header)
        for i, row in enumerate(itertools.islice(reader, 5), start=1):
            print(f'Row {i}:', row)


def verify_db(path):
    con = sqlite3.connect(path)
    cur = con.execute('SELECT COUNT(*) FROM sheet1')
    count = cur.fetchone()[0]
    print('SQLite sheet1 row count:', count)
    con.close()

if __name__ == '__main__':
    print('CSV path:', csv_path)
    verify_csv(csv_path)
    verify_db(db_path)

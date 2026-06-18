#!/usr/bin/env python3
"""Importa um CSV local para o banco SQLite pu_2026.db na tabela funcionarios."""
import argparse
import sqlite3
from pathlib import Path
import pandas as pd


def import_csv_to_pu_2026(csv_path: Path, db_path: Path, table_name: str, overwrite: bool):
    df = pd.read_csv(csv_path)
    df.columns = [str(c) for c in df.columns]
    df = df.where(pd.notnull(df), None)

    con = sqlite3.connect(db_path)
    if overwrite:
        con.execute(f"DELETE FROM {table_name}")
        con.commit()
    df.to_sql(table_name, con, if_exists="append", index=False)
    con.close()
    print(f"Importado {len(df)} linhas em {db_path} -> {table_name}")


def main():
    parser = argparse.ArgumentParser(description="Importa CSV para pu_2026.db")
    parser.add_argument("--csv", default="sheet1_export.csv", help="Arquivo CSV local para importar")
    parser.add_argument("--db", default="../pu_2026.db", help="Arquivo SQLite de destino")
    parser.add_argument("--table", default="funcionarios", help="Tabela de destino")
    parser.add_argument("--overwrite", action="store_true", help="Apaga os dados existentes antes de inserir")
    args = parser.parse_args()

    csv_path = Path(args.csv).expanduser()
    db_path = Path(args.db).expanduser()

    if not csv_path.exists():
        raise FileNotFoundError(f"CSV não encontrado: {csv_path}")
    if not db_path.exists():
        raise FileNotFoundError(f"Banco não encontrado: {db_path}")

    import_csv_to_pu_2026(csv_path, db_path, args.table, args.overwrite)


if __name__ == "__main__":
    main()

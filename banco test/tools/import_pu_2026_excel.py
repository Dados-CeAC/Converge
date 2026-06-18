#!/usr/bin/env python3
"""Importa a planilha pu_2026.xlsx para o banco SQLite pu_2026.db."""
import argparse
import os
import pandas as pd
from sqlalchemy import create_engine


def sanitize_table_name(name: str) -> str:
    name = str(name)
    name = name.strip().replace(' ', '_')
    if not name:
        return 'table1'
    return ''.join(c if c.isalnum() or c == '_' else '_' for c in name).lower()


def import_excel_to_db(excel_path: str, db_path: str, table_name: str, sheet_name: str | None = None):
    if not os.path.exists(excel_path):
        raise FileNotFoundError(f'Arquivo Excel não encontrado: {excel_path}')
    if not os.path.exists(db_path):
        raise FileNotFoundError(f'Banco SQLite não encontrado: {db_path}')

    engine = create_engine(f'sqlite:///{db_path}')
    if sheet_name:
        sheets = {sheet_name: pd.read_excel(excel_path, sheet_name=sheet_name, engine='openpyxl')}
    else:
        sheets = pd.read_excel(excel_path, sheet_name=None, engine='openpyxl')

    for sheet, df in sheets.items():
        target_name = sanitize_table_name(table_name or sheet)
        df.columns = [str(c) for c in df.columns]
        df = df.where(pd.notnull(df), None)
        df.to_sql(target_name, engine, if_exists='replace', index=False)
        print(f"Importada sheet '{sheet}' -> tabela '{target_name}' ({len(df)} linhas)")


def main():
    parser = argparse.ArgumentParser(description='Importa pu_2026.xlsx para o banco pu_2026.db')
    parser.add_argument('--excel', default='../pu_2026.xlsx', help='Arquivo Excel de origem')
    parser.add_argument('--db', default='../pu_2026.db', help='Banco SQLite de destino')
    parser.add_argument('--table', default='pu_2026', help='Nome da tabela destino no SQLite')
    parser.add_argument('--sheet', default='pu_2026', help='Nome da sheet a importar')
    args = parser.parse_args()

    import_excel_to_db(args.excel, args.db, args.table, args.sheet)


if __name__ == '__main__':
    main()

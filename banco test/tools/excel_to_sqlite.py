#!/usr/bin/env python3
"""
Converte um arquivo Excel (.xls/.xlsx) ou CSV para um banco SQLite.

Uso:
  python tools/excel_to_sqlite.py entrada.xlsx --output banco.db

O script cria uma tabela por planilha (para Excel) ou uma tabela única para CSV.
"""
import argparse
import os
import re
import sys

import pandas as pd
from sqlalchemy import create_engine


def sanitize_table_name(name: str) -> str:
    name = str(name)
    # substitui espaços e caracteres inválidos por underscore
    name = re.sub(r"[^0-9a-zA-Z]+", "_", name)
    # não começar com número
    if re.match(r"^[0-9]", name):
        name = "t_" + name
    return name.lower()


def convert_file(input_path: str, output_db: str, excel_engine: str = None) -> None:
    ext = os.path.splitext(input_path)[1].lower()
    engine = create_engine(f"sqlite:///{output_db}")

    if ext in (".xls", ".xlsx"):
        # lê todas as sheets
        sheets = pd.read_excel(input_path, sheet_name=None, engine=excel_engine)
        for sheet_name, df in sheets.items():
            table_name = sanitize_table_name(sheet_name or "sheet")
            df.columns = [str(c) for c in df.columns]
            df = df.where(pd.notnull(df), None)
            df.to_sql(table_name, engine, if_exists="replace", index=False)
            print(f"Importada sheet '{sheet_name}' -> tabela '{table_name}' ({len(df)} linhas)")
    elif ext == ".csv":
        table_name = sanitize_table_name(os.path.splitext(os.path.basename(input_path))[0])
        df = pd.read_csv(input_path)
        df.columns = [str(c) for c in df.columns]
        df = df.where(pd.notnull(df), None)
        df.to_sql(table_name, engine, if_exists="replace", index=False)
        print(f"Importado CSV -> tabela '{table_name}' ({len(df)} linhas)")
    else:
        raise SystemExit(f"Formato não suportado: {ext}. Use .xlsx, .xls ou .csv")


def main():
    p = argparse.ArgumentParser(description="Converter planilha Excel/CSV para SQLite")
    p.add_argument("input", help="Caminho do arquivo .xlsx/.xls/.csv")
    p.add_argument("--output", "-o", help="Arquivo SQLite de saída (.db). Padrão: mesmo nome do input com .db")
    p.add_argument("--excel-engine", help="Engine para leitura Excel (ex: openpyxl)")
    args = p.parse_args()

    input_path = args.input
    if not os.path.exists(input_path):
        raise SystemExit(f"Arquivo não encontrado: {input_path}")

    output_db = args.output
    if not output_db:
        base = os.path.splitext(os.path.basename(input_path))[0]
        output_db = base + ".db"

    convert_file(input_path, output_db, excel_engine=args.excel_engine)
    print(f"Banco criado: {output_db}")


if __name__ == "__main__":
    main()

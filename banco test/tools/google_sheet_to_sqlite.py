#!/usr/bin/env python3
"""Importa um Google Sheet público ou um arquivo CSV local para SQLite.

Uso:
  python tools/google_sheet_to_sqlite.py "URL" --output google_sheet.db
  python tools/google_sheet_to_sqlite.py --csv local.csv --output google_sheet.db
"""
import argparse
import os
import re
import sqlite3
import sys
import urllib.request
import urllib.parse
import pandas as pd


def parse_google_sheet_url(url: str):
    # aceita URL de visualização ou edição
    m = re.search(r"/d/([a-zA-Z0-9-_]+)", url)
    if not m:
        raise ValueError("URL do Google Sheets não reconhecida")
    sheet_id = m.group(1)
    gid_match = re.search(r"[&?]gid=(\d+)", url)
    gid = gid_match.group(1) if gid_match else "0"
    return sheet_id, gid


def download_csv(sheet_id: str, gid: str):
    url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        content_type = response.headers.get("Content-Type", "")
        if "text/csv" not in content_type and "application/octet-stream" not in content_type:
            text = response.read(1024).decode("utf-8", errors="ignore")
            raise ValueError(f"Resposta inesperada ao baixar CSV: {content_type} / {text[:200]!r}")
        data = response.read()
    return data


def load_csv_local(path: str):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Arquivo CSV não encontrado: {path}")
    return pd.read_csv(path)


def sanitize_table_name(name: str) -> str:
    name = re.sub(r"[^0-9a-zA-Z_]+", "_", name.strip())
    if not name or name[0].isdigit():
        name = "sheet_" + name
    return name.lower()


def save_sqlite(df: pd.DataFrame, output_db: str, table_name: str = "sheet"):
    if os.path.exists(output_db):
        os.remove(output_db)
    con = sqlite3.connect(output_db)
    df.columns = [str(c) for c in df.columns]
    df = df.where(pd.notnull(df), None)
    df.to_sql(table_name, con, if_exists="replace", index=False)
    con.close()


def main():
    parser = argparse.ArgumentParser(description="Importa Google Sheet público ou CSV local para SQLite")
    parser.add_argument("url", nargs="?", help="URL da planilha Google Sheets")
    parser.add_argument("--csv", help="Arquivo CSV local para importar")
    parser.add_argument("--output", "-o", default="google_sheet.db", help="Arquivo SQLite de saída")
    parser.add_argument("--gid", help="gid da sheet (se quiser sobrepor)")
    args = parser.parse_args()

    if args.csv:
        print(f"Lendo CSV local: {args.csv}")
        df = load_csv_local(args.csv)
    elif args.url:
        sheet_id, gid = parse_google_sheet_url(args.url)
        if args.gid:
            gid = args.gid
        print(f"Baixando Google Sheet id={sheet_id} gid={gid}...")
        data = download_csv(sheet_id, gid)
        df = pd.read_csv(pd.io.common.BytesIO(data))
    else:
        raise ValueError("Forneça a URL do Google Sheets ou o caminho do CSV com --csv")

    table_name = sanitize_table_name("sheet")
    save_sqlite(df, args.output, table_name=table_name)
    print(f"Banco criado: {args.output}")
    print(f"Tabela: {table_name} ({len(df)} linhas)")


if __name__ == "__main__":
    main()

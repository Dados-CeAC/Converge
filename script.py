import pandas as pd

excel_file = "BASES (2).xlsx"
print(f"⚡ Lendo planilha: {excel_file}...")

xls = pd.ExcelFile(excel_file)

# 1. TABELA MÃE
print("📦 Processando tab_mae...")
df_mae = pd.read_excel(xls, sheet_name="tab_mae")

df_mae_out = pd.DataFrame()
df_mae_out["id"] = df_mae["ID"].fillna("").astype(str)
df_mae_out["nome_empresa"] = df_mae["nome_empresa"].fillna("").astype(str)
df_mae_out["nome_filial"] = df_mae["nome_filial"].fillna("").astype(str)
df_mae_out["local_trabalho"] = df_mae["local_trabalho"].fillna("").astype(str)
df_mae_out["cargo"] = df_mae["cargo"].fillna("").astype(str)
df_mae_out["funcao"] = df_mae["funcao"].fillna("").astype(str)
df_mae_out["descricao_situacao"] = df_mae["descricao_situacao"].fillna("").astype(str)

# Limpeza de valores nulos/vazios
df_mae_out = df_mae_out[df_mae_out["id"].str.strip() != ""]
df_mae_out = df_mae_out[df_mae_out["id"].str.lower() != "nan"]

df_mae_out.to_json("tabela_mae.jsonl", orient="records", lines=True)

# 2. TABELA FILHA
print("🔗 Processando tab_filha...")
df_filha = pd.read_excel(xls, sheet_name="tab_filha")

df_filha_out = pd.DataFrame()
df_filha_out["id"] = df_filha["ID"].fillna("").astype(str)
df_filha_out["nome_filial"] = df_filha["nome_filial"].fillna("").astype(str)
df_filha_out["local_trabalho"] = df_filha["local_trabalho"].fillna("").astype(str)

# Limpeza de valores nulos e duplicados
df_filha_out = df_filha_out[df_filha_out["id"].str.strip() != ""]
df_filha_out = df_filha_out[df_filha_out["id"].str.lower() != "nan"]
df_filha_out = df_filha_out.drop_duplicates(subset=["id"])

df_filha_out.to_json("tabela_filha.jsonl", orient="records", lines=True)


import os
import pandas as pd

# 1. Localizar a planilha no diretório
arquivos_excel = [f for f in os.listdir('.') if f.endswith('.xlsx') and not f.startswith('~$')]

if not arquivos_excel:
    raise FileNotFoundError("❌ Nenhum arquivo .xlsx encontrado no projeto!")

nome_arquivo = arquivos_excel[0]
print(f"📄 Lendo base de dados: '{nome_arquivo}'...")

xls = pd.ExcelFile(nome_arquivo)

# Seleciona a aba correta
if "tb_mae" in xls.sheet_names:
    sheet_nome = "tb_mae"
elif "Tabela_Filha_N_Grupos" in xls.sheet_names:
    sheet_nome = "Tabela_Filha_N_Grupos"
else:
    sheet_nome = xls.sheet_names[0]

df_raw = pd.read_excel(xls, sheet_name=sheet_nome)

# Mapeamento e Higienização das Colunas
col_cpf = "id" if "id" in df_raw.columns else ("cpf" if "cpf" in df_raw.columns else df_raw.columns[0])
col_matricula = "Matrícula" if "Matrícula" in df_raw.columns else ("matricula" if "matricula" in df_raw.columns else col_cpf)

df_raw["cpf"] = df_raw[col_cpf].astype(str).str.strip()
df_raw["matricula"] = df_raw[col_matricula].astype(str).str.strip()

# Tratar campos textuais
empresa = df_raw["Nome Empresa"].fillna("Não Informado").astype(str).str.strip() if "Nome Empresa" in df_raw.columns else df_raw.get("empresa", pd.Series(["Não Informado"]*len(df_raw))).astype(str).str.strip()
filial = df_raw["Nome Filial"].fillna("Não Informado").astype(str).str.strip() if "Nome Filial" in df_raw.columns else df_raw.get("filial", pd.Series(["Não Informado"]*len(df_raw))).astype(str).str.strip()
local_trab = df_raw["Local Trab."].fillna("Não Informado").astype(str).str.strip() if "Local Trab." in df_raw.columns else df_raw.get("local_trab", pd.Series(["Não Informado"]*len(df_raw))).astype(str).str.strip()
cargo = df_raw["Cargo"].fillna("Não Informado").astype(str).str.strip() if "Cargo" in df_raw.columns else df_raw.get("cargo", pd.Series(["Não Informado"]*len(df_raw))).astype(str).str.strip()
funcao = df_raw["Função"].fillna("Não Informado").astype(str).str.strip() if "Função" in df_raw.columns else df_raw.get("funcao", pd.Series(["Não Informado"]*len(df_raw))).astype(str).str.strip()

if "Desc. Situação" in df_raw.columns:
    df_raw["situacao"] = df_raw["Desc. Situação"].fillna("Ativo").astype(str).str.strip()
elif "situacao" in df_raw.columns:
    df_raw["situacao"] = df_raw["situacao"].fillna("Ativo").astype(str).str.strip()
else:
    df_raw["situacao"] = "Ativo"

# Vínculo Empregatício
df_raw["vinculo"] = empresa + " - " + cargo

# Grupo Genérico Composto
df_raw["grupo_generico"] = empresa + " | " + filial + " | " + local_trab + " | " + cargo + " | " + funcao

# --- 2. GERAR TABELA MÃE (employees_mae.jsonl) ---
cols_mae = ["cpf", "matricula", "vinculo", "situacao"]
df_mae_clean = df_raw.drop_duplicates(subset=["cpf"])[cols_mae].reset_index(drop=True)
df_mae_clean.to_json("employees_mae.jsonl", orient="records", lines=True, force_ascii=False)

# --- 3. GERAR TABELA FILHA (pgr_groups.jsonl) ---
df_filha_clean = df_raw.copy()
df_filha_clean["seq_id"] = range(1, len(df_filha_clean) + 1)
df_filha_clean["empresa"] = empresa
df_filha_clean["filial"] = filial
df_filha_clean["local_trab"] = local_trab
df_filha_clean["cargo"] = cargo
df_filha_clean["funcao"] = funcao

cols_filha = ["seq_id", "cpf", "matricula", "vinculo", "situacao", "grupo_generico", "empresa", "filial", "local_trab", "cargo", "funcao"]
df_filha_clean = df_filha_clean[cols_filha]
df_filha_clean.to_json("pgr_groups.jsonl", orient="records", lines=True, force_ascii=False)

print("\n" + "="*50)
print(f"✅ Tabela Mãe tratada: {len(df_mae_clean)} registros de CPFs únicos")
print(f"✅ Tabela Filha tratada: {len(df_filha_clean)} registros de Vínculos")
print("="*50)

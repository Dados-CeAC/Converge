import pandas as pd
import glob
import json

excel_files = glob.glob("*.xlsx") + glob.glob("**/*.xlsx", recursive=True)
if not excel_files:
    print("❌ Nenhum arquivo .xlsx foi encontrado!")
    exit(1)

excel_file = next((f for f in excel_files if "BASES" in f), excel_files[0])
print(f"⚡ Processando planilha: {excel_file}...")

xls = pd.ExcelFile(excel_file)
sheet_names = xls.sheet_names

# 1. PROCESSA EMPLOYEES (Tabela Mãe / Sheet1)
s1_name = sheet_names[0]
df_s1 = pd.read_excel(xls, sheet_name=s1_name)

# Padroniza colunas
cols_s1 = {str(c).strip().lower(): c for c in df_s1.columns}

df_emp = pd.DataFrame()
df_emp["cpf"] = df_s1[cols_s1.get("número de cpf", cols_s1.get("cpf"))].fillna("").astype(str).str.strip()
df_emp["matricula"] = df_s1[cols_s1.get("matrícula", cols_s1.get("matricula"))].fillna("").astype(str).str.strip()
df_emp["nome"] = df_s1[cols_s1.get("nome")].fillna("").astype(str).str.strip()

col_desc = cols_s1.get("desc. situação", cols_s1.get("descricao_situacao"))
if col_desc:
    df_emp["desc_situacao"] = df_s1[col_desc].apply(
        lambda x: "ativo" if str(x).strip().lower() == "ativo" else "desligado"
    )
else:
    df_emp["desc_situacao"] = "ativo"

df_emp = df_emp[df_emp["cpf"] != ""].drop_duplicates(subset=["cpf"])

# Salva JSONL garantindo formatação perfeita linha por linha
with open("employees.jsonl", "w", encoding="utf-8") as f:
    for record in df_emp.to_dict(orient="records"):
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

print(f"✅ 'employees.jsonl' gerado com {len(df_emp)} registros válidos!")

# 2. PROCESSA PGR_GROUPS (Tabela Filha / Página3)
if len(sheet_names) > 2:
    s3_name = sheet_names[2]
else:
    s3_name = sheet_names[-1]

df_p3 = pd.read_excel(xls, sheet_name=s3_name)
cols_p3 = {str(c).strip().lower(): c for c in df_p3.columns}

df_p3["seq_id"] = range(1, len(df_p3) + 1)
df_p3["instituto"] = df_p3[cols_p3.get("nome filial", cols_p3.get("instituto"))].fillna("").astype(str).str.strip()
df_p3["cargo"] = df_p3[cols_p3.get("cargo")].fillna("").astype(str).str.strip()
df_p3["setor"] = df_p3[cols_p3.get("nome empresa", cols_p3.get("setor"))].fillna("").astype(str).str.strip()
df_p3["funcao"] = df_p3[cols_p3.get("função", cols_p3.get("funcao"))].fillna("").astype(str).str.strip()
df_p3["local"] = df_p3[cols_p3.get("local trab.", cols_p3.get("local"))].fillna("").astype(str).str.strip()

df_p3["codigo_composto"] = (
    df_p3["instituto"] + "-" + df_p3["cargo"] + "-" + df_p3["setor"] + "-" + df_p3["funcao"] + "-" + df_p3["local"]
)

col_desc_p3 = cols_p3.get("desc. situação", cols_p3.get("desc_situacao"))
if col_desc_p3:
    df_p3["desc_situacao"] = df_p3[col_desc_p3].apply(
        lambda x: "ativo" if str(x).strip().lower() == "ativo" else "desligado"
    )
else:
    df_p3["desc_situacao"] = "ativo"

df_p3["employee_cpf"] = ""

cols_pgr = ["seq_id", "codigo_composto", "employee_cpf", "instituto", "cargo", "setor", "funcao", "local", "desc_situacao"]
df_pgr_out = df_p3[cols_pgr]

with open("pgr_groups.jsonl", "w", encoding="utf-8") as f:
    for record in df_pgr_out.to_dict(orient="records"):
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

print(f"✅ 'pgr_groups.jsonl' gerado com {len(df_pgr_out)} registros válidos!")

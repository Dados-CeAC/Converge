import pandas as pd
import glob

# Localiza arquivo Excel
excel_files = glob.glob("*.xlsx")
if not excel_files:
    raise FileNotFoundError("Nenhum arquivo .xlsx foi encontrado na pasta atual!")

excel_file = excel_files[0]
print(f"⚡ Lendo a planilha Excel: {excel_file}...")
xls = pd.ExcelFile(excel_file)

# 1. Tabela Mãe (employees)
sheet_mae = "Sheet1" if "Sheet1" in xls.sheet_names else xls.sheet_names[0]
df_s1 = pd.read_excel(xls, sheet_name=sheet_mae)

df_s1["cpf"] = df_s1["Número de CPF"].astype(str).str.strip().fillna("") if "Número de CPF" in df_s1.columns else ""
df_s1["matricula"] = df_s1["Matrícula"].astype(str).str.strip().fillna("") if "Matrícula" in df_s1.columns else ""
df_s1["nome"] = df_s1["Nome"].fillna("").astype(str).str.strip() if "Nome" in df_s1.columns else ""

if "Desc. Situação" in df_s1.columns:
    df_s1["desc_situacao"] = df_s1["Desc. Situação"].apply(
        lambda x: "ativo" if str(x).strip().lower() == "ativo" else "desligado"
    )
else:
    df_s1["desc_situacao"] = "ativo"

cols_mae = ["cpf", "matricula", "nome", "desc_situacao"]
df_mae_clean = df_s1[df_s1["cpf"] != ""].drop_duplicates(subset=["cpf"])
df_mae_clean[cols_mae].to_json("employees.jsonl", orient="records", lines=True, force_ascii=False)

# 2. Tabela Filha (pgr_groups)
sheet_filha = "Página3" if "Página3" in xls.sheet_names else (xls.sheet_names[1] if len(xls.sheet_names) > 1 else xls.sheet_names[0])
df_p3 = pd.read_excel(xls, sheet_name=sheet_filha)

df_p3["seq_id"] = range(1, len(df_p3) + 1)
df_p3["instituto"] = df_p3["Nome Filial"].fillna("").astype(str).str.strip() if "Nome Filial" in df_p3.columns else ""
df_p3["cargo"] = df_p3["Cargo"].fillna("").astype(str).str.strip() if "Cargo" in df_p3.columns else ""
df_p3["setor"] = df_p3["Nome Empresa"].fillna("").astype(str).str.strip() if "Nome Empresa" in df_p3.columns else ""
df_p3["funcao"] = df_p3["Função"].fillna("").astype(str).str.strip() if "Função" in df_p3.columns else ""
df_p3["local"] = df_p3["Local Trab."].fillna("").astype(str).str.strip() if "Local Trab." in df_p3.columns else ""
df_p3["employee_cpf"] = df_p3["Número de CPF"].astype(str).str.strip().fillna("") if "Número de CPF" in df_p3.columns else ""

df_p3["codigo_composto"] = (
    df_p3["instituto"] + "-" +
    df_p3["cargo"] + "-" +
    df_p3["setor"] + "-" +
    df_p3["funcao"] + "-" +
    df_p3["local"]
)

if "Desc. Situação" in df_p3.columns:
    df_p3["desc_situacao"] = df_p3["Desc. Situação"].apply(
        lambda x: "ativo" if str(x).strip().lower() == "ativo" else "desligado"
    )
else:
    df_p3["desc_situacao"] = "ativo"

cols_filha = ["seq_id", "codigo_composto", "employee_cpf", "instituto", "cargo", "setor", "funcao", "local", "desc_situacao"]
df_p3[cols_filha].to_json("pgr_groups.jsonl", orient="records", lines=True, force_ascii=False)

print("\n✅ Arquivos 'employees.jsonl' e 'pgr_groups.jsonl' gerados com sucesso!")
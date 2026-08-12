# Usa o primeiro arquivo .xlsx localizado na pasta
excel_file = excel_files[0]
print(f"Lendo a planilha Excel: {excel_file}...")

# 1. Tabela Mãe: Colaboradores (Sheet1)
df_s1 = pd.read_excel(excel_file, sheet_name="Sheet1")
df_s1["cpf"] = df_s1["Número de CPF"].astype(str).fillna("")
df_s1["matricula"] = df_s1["Matrícula"].astype(str).fillna("")
df_s1["nome"] = df_s1["Nome"].fillna("")
df_s1["desc_situacao"] = df_s1["Desc. Situação"].apply(
    lambda x: "ativo" if str(x).strip().lower() == "ativo" else "desligado"
)

cols_mae = ["cpf", "matricula", "nome", "desc_situacao"]
df_s1[cols_mae].drop_duplicates(subset=["cpf"]).to_json("employees.jsonl", orient="records", lines=True)

# 2. Tabela Filha: Locais e Grupos Sequenciais (Página3)
df_p3 = pd.read_excel(excel_file, sheet_name="Página3")
df_p3["seq_id"] = range(1, len(df_p3) + 1)
df_p3["instituto"] = df_p3["Nome Filial"].fillna("")
df_p3["cargo"] = df_p3["Cargo"].fillna("")
df_p3["setor"] = df_p3["Nome Empresa"].fillna("")
df_p3["funcao"] = df_p3["Função"].fillna("")
df_p3["local"] = df_p3["Local Trab."].fillna("")

df_p3["codigo_composto"] = (
    df_p3["instituto"].astype(str) + "-" +
    df_p3["cargo"].astype(str) + "-" +
    df_p3["setor"].astype(str) + "-" +
    df_p3["funcao"].astype(str) + "-" +
    df_p3["local"].astype(str)
)

df_p3["desc_situacao"] = df_p3["Desc. Situação"].apply(
    lambda x: "ativo" if str(x).strip().lower() == "ativo" else "desligado"
)
df_p3["employee_cpf"] = ""

cols_filha = ["seq_id", "codigo_composto", "employee_cpf", "instituto", "cargo", "setor", "funcao", "local", "desc_situacao"]
df_p3[cols_filha].to_json("pgr_groups.jsonl", orient="records", lines=True)

print("Sucesso! Os arquivos employees.jsonl e pgr_groups.jsonl foram criados!")

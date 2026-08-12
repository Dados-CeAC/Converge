import pandas as pd

EXCEL_PATH = "bases completa.xlsx"
xls = pd.ExcelFile(EXCEL_PATH)
df_m = pd.read_excel(xls, 'tb_mae')

print("\n--- COLUNAS ENCONTRADAS NA TB_MAE ---")
for i, col in enumerate(df_m.columns):
    exemplo = df_m.iloc[0, i] if len(df_m) > 0 else 'Vazio'
    print(f"Coluna {i} (Letra {chr(65+i)}): Nome = '{col}' | Exemplo de Dado = '{exemplo}'")
    
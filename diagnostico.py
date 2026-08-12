import pandas as pd
import glob

files = glob.glob("*.xlsx") + glob.glob("**/*.xlsx", recursive=True)
if not files:
    print("❌ Nenhuma planilha .xlsx foi encontrada!")
    exit(1)

excel_file = next((f for f in files if "BASES" in f), files[0])
print(f"📁 Arquivo encontrado: {excel_file}\n")

xls = pd.ExcelFile(excel_file)

for sheet in xls.sheet_names:
    print(f"================ ABA: {sheet} ================")
    df = pd.read_excel(xls, sheet)
    print(f"Dimensões: {df.shape} (linhas x colunas)")
    print("Cabeçalhos atuais lidos na Linha 1:")
    print(list(df.columns))
    print("\nPrimeiras 3 linhas da tabela:")
    print(df.head(3))
    print("\n")


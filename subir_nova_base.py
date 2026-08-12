import pandas as pd
import subprocess
import os

EXCEL_PATH = "bases completa.xlsx"

def processar_e_subir():
    if not os.path.exists(EXCEL_PATH):
        print(f" Arquivo '{EXCEL_PATH}' não encontrado!")
        return False

    print(f"⚡ Lendo abas da planilha: {EXCEL_PATH}...")
    xls = pd.ExcelFile(EXCEL_PATH)

    # 1. PROCESSA TB_MAE
    if 'tb_mae' in xls.sheet_names:
        df_m = pd.read_excel(xls, 'tb_mae')
        df_m_out = pd.DataFrame()

        # Mapeamento com base nas colunas identificadas
        df_m_out['id'] = df_m['id'].fillna('').astype(str).str.strip()
        df_m_out['nome_empresa'] = df_m['Nome Empresa'].fillna('').astype(str).str.strip()
        df_m_out['nome_filial'] = df_m['Nome Filial'].fillna('').astype(str).str.strip()
        df_m_out['local_trabalho'] = df_m['Local Trab.'].fillna('').astype(str).str.strip()
        df_m_out['cargo'] = df_m['Cargo'].fillna('').astype(str).str.strip()
        df_m_out['funcao'] = df_m['Função'].fillna('').astype(str).str.strip()
        df_m_out['descricao_situacao'] = df_m['Desc. Situação'].fillna('').astype(str).str.strip()

        # Tratamento da Data de Situação
        raw_data = pd.to_datetime(df_m['Data de Situação'], errors='coerce')
        df_m_out['data_situacao'] = raw_data.dt.strftime('%d/%m/%Y').fillna('')

        # Remove linhas sem ID
        df_m_out = df_m_out[(df_m_out['id'] != '') & (df_m_out['id'].str.lower() != 'nan')]

        # Salva em JSONL
        df_m_out.to_json('tabela_mae.jsonl', orient='records', lines=True, force_ascii=False)
        print(f" 'tabela_mae.jsonl' gerada com {len(df_m_out)} registros e a coluna 'data_situacao'!")

    # 2. PROCESSA TB_FILHA
    if 'tb_filha' in xls.sheet_names:
        df_f = pd.read_excel(xls, 'tb_filha')
        df_f_out = pd.DataFrame()

        df_f_out['id'] = df_f.iloc[:, 0].fillna('').astype(str).str.strip() if df_f.shape[1] > 0 else ''
        df_f_out['nome_filial'] = df_f.iloc[:, 1].fillna('').astype(str).str.strip() if df_f.shape[1] > 1 else ''
        df_f_out['local_trabalho'] = df_f.iloc[:, 2].fillna('').astype(str).str.strip() if df_f.shape[1] > 2 else ''

        df_f_out = df_f_out[(df_f_out['id'] != '') & (df_f_out['id'].str.lower() != 'nan')].drop_duplicates(subset=['id'])

        df_f_out.to_json('tabela_filha.jsonl', orient='records', lines=True, force_ascii=False)

    return True

if __name__ == "__main__":
    if processar_e_subir():
        print("\n🚀 Recriando tabela e subindo novos dados...")
        subprocess.run(["npx", "convex", "import", "--table", "tabela_mae", "tabela_mae.jsonl", "--replace", "-y"])
        if os.path.exists("tabela_filha.jsonl"):
            subprocess.run(["npx", "convex", "import", "--table", "tabela_filha", "tabela_filha.jsonl", "--replace", "-y"])
        print("\n Importação concluída!")
        
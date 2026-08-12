import pandas as pd
import glob

files = glob.glob("*.xlsx") + glob.glob("**/*.xlsx", recursive=True)
if not files:
    print("❌ Nenhuma planilha .xlsx foi encontrada!")
    exit(1)

excel_file = next((f for f in files if "BASES" in f), files[0])
print(f"⚡ Lendo planilha: {excel_file}...")

xls = pd.ExcelFile(excel_file)

# 1. PROCESSA TAB_MAE
if 'tab_mae' in xls.sheet_names:
    df_m = pd.read_excel(xls, 'tab_mae')
    
    # Mapeia colunas ignorando maiúsculas e o caractere _ no inicio de ID
    col_map = {}
    for col in df_m.columns:
        c_clean = str(col).strip().lower().lstrip('_')
        col_map[c_clean] = col

    df_m_out = pd.DataFrame()
    
    # Pega o ID (mesmo que na planilha esteja _ID ou ID)
    id_col = col_map.get('id')
    df_m_out['id'] = df_m[id_col].astype(str).str.strip() if id_col else ''
    
    df_m_out['nome_empresa'] = df_m[col_map.get('nome_empresa')].fillna('').astype(str).str.strip()
    df_m_out['nome_filial'] = df_m[col_map.get('nome_filial')].fillna('').astype(str).str.strip()
    df_m_out['local_trabalho'] = df_m[col_map.get('local_trabalho')].fillna('').astype(str).str.strip()
    df_m_out['cargo'] = df_m[col_map.get('cargo')].fillna('').astype(str).str.strip()
    df_m_out['funcao'] = df_m[col_map.get('funcao')].fillna('').astype(str).str.strip()
    df_m_out['descricao_situacao'] = df_m[col_map.get('descricao_situacao')].fillna('').astype(str).str.strip()

    # Filtra linhas válidas
    df_m_out = df_m_out[df_m_out['id'] != '']
    
    print("\n🔍 Sucesso! Exemplo do 1º registro gerado:")
    print(df_m_out.iloc[0].to_dict())
    
    df_m_out.to_json('tabela_mae.jsonl', orient='records', lines=True, force_ascii=False)
    print(f"\n✅ 'tabela_mae.jsonl' gerada com {len(df_m_out)} registros completos!")

# 2. PROCESSA TAB_FILHA
if 'tab_filha' in xls.sheet_names:
    df_f = pd.read_excel(xls, 'tab_filha')
    col_map_f = {str(col).strip().lower().lstrip('_'): col for col in df_f.columns}
    
    df_f_out = pd.DataFrame()
    id_col_f = col_map_f.get('id')
    
    df_f_out['id'] = df_f[id_col_f].astype(str).str.strip() if id_col_f else ''
    df_f_out['nome_filial'] = df_f[col_map_f.get('nome_filial')].fillna('').astype(str).str.strip()
    df_f_out['local_trabalho'] = df_f[col_map_f.get('local_trabalho')].fillna('').astype(str).str.strip()

    df_f_out = df_f_out[df_f_out['id'] != ''].drop_duplicates(subset=['id'])
    df_f_out.to_json('tabela_filha.jsonl', orient='records', lines=True, force_ascii=False)
    print(f"✅ 'tabela_filha.jsonl' gerada com {len(df_f_out)} registros!")


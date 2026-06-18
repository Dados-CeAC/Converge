# Converter planilha para SQLite

Este utilitário converte um arquivo Excel (.xlsx/.xls) ou CSV para um banco SQLite local.

Requisitos
- Python 3.8+
- Instalar dependências:

```powershell
python -m pip install -r requirements.txt
```

Uso

```powershell
# Converter um arquivo Excel (todas as sheets virarão tabelas)
python tools\excel_to_sqlite.py caminho\para\entrada.xlsx --output meu_banco.db

# Converter um CSV
python tools\excel_to_sqlite.py caminho\para\dados.csv
```

Resultados
- Cria um arquivo `.db` SQLite no mesmo diretório (ou em `--output`).
- Para Excel, cada sheet vira uma tabela com o nome da sheet (normalizado).

Próximos passos
- Envie a planilha aqui ou rode o script localmente; se quiser, eu importo o arquivo para você e crio um banco pronto.

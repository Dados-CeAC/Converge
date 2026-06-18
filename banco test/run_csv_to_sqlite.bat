@echo off
cd /d "%~dp0"
if "%~1"=="" (
  echo Uso: run_csv_to_sqlite.bat caminho\para\arquivo.csv
  echo Exemplo:
  echo   run_csv_to_sqlite.bat "C:\Users\ellen.fgomes\Downloads\planilha.csv"
  pause
  exit /b 1
)
C:\Users\ellen.fgomes\AppData\Local\Microsoft\WindowsApps\python3.13.exe tools\google_sheet_to_sqlite.py --csv "%~1" --output "google_sheet.db"
pause

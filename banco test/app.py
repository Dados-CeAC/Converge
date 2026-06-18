from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
import sqlite3
from pathlib import Path

app = Flask(__name__, template_folder='templates')
app.config['TEMPLATES_AUTO_RELOAD'] = True
BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent
DB_PATH = BASE_DIR / 'TRATADO_Colab.db'

@app.route('/templates/<path:path>')
def redirect_to_root(path):
    return redirect(url_for('index'))


@app.route('/converge')
def converge_app():
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.route('/<path:filename>')
def converge_assets(filename):
    allowed_files = {
        'script.js',
        'style.css',
        'LOGO HCFMUSP.png',
        'Logo CeAC Azul e Turqueza Sem Fundo.png',
    }
    if filename in allowed_files:
        return send_from_directory(FRONTEND_DIR, filename)
    return redirect(url_for('index'))

SEARCH_FIELDS = [
    ('nome_paciente', 'Nome do paciente'),
    ('nr_cpf', 'CPF'),
]

DISPLAY_FIELDS = [
    ('NOME_PACIENTE', 'Nome do paciente'),
    ('NR_CPF', 'CPF'),
    ('DATA_AGENDA', 'Data de agenda'),
    ('TIPO_ATENDIMENTO', 'Tipo de atendimento'),
    ('TIPO_PRESTADOR', 'Tipo de prestador'),
    ('PRESTADOR', 'Prestador'),
    ('SERVICO', 'Serviço'),
    ('ESPECIALIDADE', 'Especialidade'),
    ('DATA_ATENDIMENTO', 'Data de atendimento'),
    ('HORA_ATENDIMENTO', 'Hora de atendimento'),
    ('LOCAL_PROCEDENCIA', 'Local de procedência'),
    ('TIPO_AGENDA', 'Tipo de agenda'),
    ('DESC_CID_ATEND', 'CID atendimento'),
    ('MOTIVO_DO_CANCELAMENTO', 'Motivo do cancelamento'),
    ('EMAIL', 'E-mail'),
]

FUNCIONARIO_COLUMNS = {
    'cpf': ['cpf', 'Número de CPF'],
    'nome_empresa': ['nome_empresa', 'Nome Empresa'],
    'nome_filial': ['nome_filial', 'Nome Filial'],
    'matricula': ['matricula', 'Matrícula'],
    'nome': ['nome', 'Nome'],
    'cargo': ['cargo', 'Cargo'],
    'nome_cargo': ['nome_cargo', 'Nome Cargo'],
    'data_admissao': ['data_admissao', 'Data de Admissão'],
    'desc_situacao': ['desc_situacao', 'Desc. Situação'],
    'data_situacao': ['data_situacao', 'Data de Situação'],
    'desc_vinculo': ['desc_vinculo', 'Desc. Vínculo'],
    'local_trab': ['local_trab', 'Local Trab.'],
    'nome_local_trab': ['nome_local_trab', 'Nome Local Trab.'],
    'centro_custo': ['centro_custo', 'C.Custo Contab.'],
    'funcao': ['funcao', 'Função'],
    'instrucao': ['instrucao', 'Instrução'],
    'sexo': ['sexo', 'Sexo'],
    'email_funcional': ['email_funcional', 'E-mail Funcional'],
}


def get_table_columns(con, table_name):
    rows = con.execute(f'PRAGMA table_info("{table_name}")').fetchall()
    return {row[1] for row in rows}


def pick_column(columns, aliases):
    return next((column for column in aliases if column in columns), None)


def resolve_funcionarios_table(con):
    tables = {
        row[0]
        for row in con.execute("SELECT name FROM sqlite_master WHERE type='table'")
    }
    for table_name in ('funcionarios', 'sheet1'):
        if table_name in tables:
            return table_name
    return None


def normalize_funcionario(row):
    return {
        'id': row['id'] if 'id' in row.keys() else None,
        'cpf': row['cpf'] or '',
        'nomeEmpresa': row['nome_empresa'] or '',
        'filial': row['nome_filial'] or '',
        'matricula': row['matricula'] or '',
        'nome': row['nome'] or '',
        'cargo': row['nome_cargo'] or row['cargo'] or '',
        'cargoCompleto': row['cargo'] or '',
        'status': row['desc_situacao'] or '',
        'dataAdmissao': row['data_admissao'] or '',
        'dataSituacao': row['data_situacao'] or '',
        'vinculo': row['desc_vinculo'] or '',
        'localTrabalho': row['local_trab'] or '',
        'nomeLocalTrabalho': row['nome_local_trab'] or '',
        'centroCusto': row['centro_custo'] or '',
        'funcao': row['funcao'] or '',
        'instrucao': row['instrucao'] or '',
        'sexo': row['sexo'] or '',
        'email': row['email_funcional'] or '',
    }


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    return response

@app.route('/', methods=['GET', 'POST'])
def index():
    searched = False
    nome_paciente = ''
    nr_cpf = ''
    row = None

    if request.method == 'POST':
        searched = True
        nome_paciente = request.form.get('nome_paciente', '').strip()
        nr_cpf = request.form.get('nr_cpf', '').strip()

        if nome_paciente or nr_cpf:
            if nome_paciente:
                sql = 'SELECT * FROM pu_2026 WHERE NOME_PACIENTE LIKE ? LIMIT 1'
                params = [f'%{nome_paciente}%']
            else:
                sql = 'SELECT * FROM pu_2026 WHERE NR_CPF LIKE ? LIMIT 1'
                params = [f'%{nr_cpf}%']

            con = sqlite3.connect(DB_PATH)
            con.row_factory = sqlite3.Row
            cur = con.execute(sql, params)
            row = cur.fetchone()
            con.close()

    return render_template('index.html', nome_paciente=nome_paciente, nr_cpf=nr_cpf, row=row, searched=searched, display_fields=DISPLAY_FIELDS)

@app.route('/view_pu_2026')
def view_pu_2026():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    cur = con.execute('SELECT * FROM pu_2026 LIMIT 100')
    rows = cur.fetchall()
    columns = rows[0].keys() if rows else []
    con.close()
    return render_template('view_pu_2026.html', rows=rows, columns=columns, table_name='pu_2026')


@app.route('/api/funcionarios')
def api_funcionarios():
    if request.method == 'OPTIONS':
        return ('', 204)

    nome = request.args.get('nome', '').strip()
    matricula = request.args.get('matricula', '').strip()
    cpf = request.args.get('cpf', '').strip()
    empresa = request.args.get('empresa', '').strip()
    cargo = request.args.get('cargo', '').strip()
    setor = request.args.get('setor', '').strip()
    filial = request.args.get('filial', '').strip()
    status = request.args.get('status', '').strip()

    if not any([matricula, cpf]):
        return jsonify({'results': [], 'total': 0})

    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row

    try:
        table_name = resolve_funcionarios_table(con)
        if not table_name:
            return jsonify({'error': 'Tabela de funcionários não encontrada.'}), 404

        table_columns = get_table_columns(con, table_name)
        selected_columns = {}
        for field, aliases in FUNCIONARIO_COLUMNS.items():
            column = pick_column(table_columns, aliases)
            selected_columns[field] = column

        if not all(selected_columns[field] for field in ('nome', 'matricula', 'cpf')):
            return jsonify({'error': 'Colunas principais de funcionários não encontradas.'}), 500

        select_sql = ', '.join(
            f'"{column}" AS "{field}"'
            for field, column in selected_columns.items()
            if column
        )

        filters = []
        params = []

        def add_like_filter(field, value):
            column = selected_columns.get(field)
            if column and value:
                filters.append(f'"{column}" LIKE ?')
                params.append(f'%{value}%')

        add_like_filter('nome', nome)
        add_like_filter('matricula', matricula)
        add_like_filter('cpf', cpf)
        add_like_filter('nome_empresa', empresa)
        add_like_filter('nome_cargo', cargo)
        add_like_filter('nome_local_trab', setor)
        add_like_filter('nome_filial', filial)
        add_like_filter('desc_situacao', status)

        where_sql = f"WHERE {' AND '.join(filters)}" if filters else ''
        order_column = selected_columns['nome']
        sql = f'''
            SELECT {select_sql}
            FROM "{table_name}"
            {where_sql}
            ORDER BY "{order_column}"
            LIMIT 100
        '''

        rows = con.execute(sql, params).fetchall()
        results = [normalize_funcionario(row) for row in rows]
        return jsonify({'results': results, 'total': len(results)})
    finally:
        con.close()

if __name__ == '__main__':
    app.run(debug=True)

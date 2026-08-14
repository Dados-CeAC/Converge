# 📚 Manual Explicativo - CONVERGE

## 🎯 Visão Geral do Projeto

**CONVERGE** é um portal web centralizado desenvolvido para o **Hospital das Clínicas da Faculdade de Medicina da USP (HC-FMUSP)**, que funciona como um agregador de sistemas, informações e serviços. É um hub integrado que unifica o acesso a diversos sistemas hospitalares, dados de colaboradores e gestão de recursos.

### 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                        CONVERGE                             │
│                    Portal Web (Frontend)                    │
├──────────────────────────────────────┬──────────────────────┤
│       HTML/CSS/JavaScript            │   Clerk Auth         │
│  • Responsivo                        │   (Login/SSO)        │
│  • Menu Lateral                      │   @hc.fm.usp.br      │
│  • Sistema de Cards                 │                      │
└──────────────────────────────────────┴──────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│              Backend - CONVEX (TypeScript)                  │
│  • Banco de Dados Reativo                                   │
│  • Queries, Mutations e Actions                            │
│  • Gerenciamento de Sessões                                │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│        Banco de Dados - Tabelas Normalizadas                │
│  • Tabela Mãe (Dados de CPF)                                │
│  • Tabela Filha (Dados Completos)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Autenticação e Segurança

### Sistema de Login

**Ferramenta**: Clerk (https://clerk.com)

**Fluxo de Autenticação**:

1. Usuário acessa `login.html`
2. Sistema carrega a biblioteca do Clerk dinamicamente
3. Usuário autentica via OAuth ou Passkey
4. Após login bem-sucedido, usuário é redirecionado para `index.html`

**Validação de Domínio**:

```javascript
// Arquivo: auth.js
// Valida se o email é do domínio institucional @hc.fm.usp.br

if (!email.endsWith("@hc.fm.usp.br")) {
    // Usuário não autorizado - encerra sessão
    await Clerk.signOut();
    alert("Apenas usuários com e-mail institucional @hc.fm.usp.br podem acessar");
}
```

**Chave Pública Clerk**:
- `pk_test_bWF4aW11bS1zbmlwZS0yMS5jbGVyay5hY2NvdW50cy5kZXYk`

### Segurança

✅ Validação de domínio de email obrigatória  
✅ Autenticação centralizada via Clerk  
✅ Sessões seguras  
✅ Redirecionamento automático para login se não autenticado  

---

## 🗄️ Estrutura de Banco de Dados

### Tabela Mãe (`tabela_mae`)

Armazena informações resumidas de cada colaborador (1 registro por CPF):

```typescript
{
  cpf: string,           // Identificador único
  matricula: string,     // Matrícula do colaborador
  vinculo: string,       // Tipo de vínculo (CLT, Estatutário, etc)
  situacao: string       // Status (Ativo, Inativo, Afastado, etc)
}
```

**Índices**:
- `by_cpf`: Busca rápida por CPF

### Tabela Filha (`tabela_filha`)

Armazena informações detalhadas com múltiplos registros por colaborador:

```typescript
{
  seq_id: number,           // ID sequencial
  cpf: string,              // Referência para tabela mãe
  matricula: string,        // Matrícula
  vinculo: string,          // Tipo de vínculo
  situacao: string,         // Status
  grupo_generico: string,   // Grupo ocupacional genérico
  empresa: string,          // Empresa
  filial: string,           // Filial
  local_trab: string,       // Local de trabalho
  cargo: string,            // Cargo do colaborador
  funcao: string            // Função desempenhada
}
```

**Índices**:
- `by_cpf`: Busca por CPF
- `by_situacao`: Busca por status (Ativo, Inativo, etc)

### Relacionamento das Tabelas

```
Tabela Mãe                  Tabela Filha
┌──────────────┐           ┌──────────────┐
│ CPF: 123...  │ ◄─────┬───│ CPF: 123...  │ (Registro 1)
│ Matrícula: X │       │   │ Local: Prédio A
│ Vínculo: CLT │       │   │ Cargo: Médico
│              │       └───│ CPF: 123...  │ (Registro 2)
│              │           │ Local: Prédio B
│              │           │ Cargo: Supervisor
└──────────────┘           └──────────────┘
  1 Registro por CPF         N Registros por CPF
```

**Por que essa estrutura?**
- Reduz redundância (dados comuns na mãe)
- Permite histórico/múltiplas posições por colaborador
- Melhora performance de buscas

---

## 🔧 Backend - Funções Convex

### Arquivo: `convex/testar.ts`

Define as funções disponíveis no backend que o frontend pode chamar.

#### Query: `buscarPrimeirosRegistros`

```typescript
export const buscarPrimeirosRegistros = query({
  args: {},  // Nenhum parâmetro necessário
  handler: async (ctx) => {
    // 1. Busca os primeiros 5 registros da tabela mãe
    const mae = await ctx.db.query("tabela_mae").take(5);

    // 2. Busca os primeiros 5 registros da tabela filha
    const filha = await ctx.db.query("tabela_filha").take(5);

    // 3. Retorna estruturado
    return {
      status: "BANCO DE DADOS OPERACIONAL E CONECTADO!",
      amostra_tabela_mae: mae,
      amostra_tabela_filha: filha,
    };
  },
});
```

**Quando usar**: 
- Verificar se o banco está funcionando
- Testes de conexão
- Debugging de dados

**O que retorna**:
```json
{
  "status": "BANCO DE DADOS OPERACIONAL E CONECTADO!",
  "amostra_tabela_mae": [
    { "cpf": "...", "matricula": "...", ... },
    ...
  ],
  "amostra_tabela_filha": [
    { "seq_id": 1, "cpf": "...", ... },
    ...
  ]
}
```

### Schema Completo: `convex/schema.ts`

Define a estrutura do banco de dados TypeScript-safe:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tabela_mae: defineTable({
    cpf: v.string(),
    matricula: v.string(),
    vinculo: v.string(),
    situacao: v.string(),
  }).index("by_cpf", ["cpf"]),

  tabela_filha: defineTable({
    seq_id: v.number(),
    cpf: v.string(),
    matricula: v.string(),
    vinculo: v.string(),
    situacao: v.string(),
    grupo_generico: v.string(),
    empresa: v.string(),
    filial: v.string(),
    local_trab: v.string(),
    cargo: v.string(),
    funcao: v.string(),
  })
    .index("by_cpf", ["cpf"])
    .index("by_situacao", ["situacao"]),
});
```

---

## 🎨 Frontend - Interface Web

### Estrutura HTML

**Arquivo Principal**: `index.html`

Segue um padrão responsivo com:

```html
┌────────────────────────────────────────┐
│           TOPBAR (58px)                │
│  Botão Menu | Logo | Informações User  │
├──────────────┬───────────────────────┐
│              │                       │
│   SIDEBAR    │     CONTEÚDO MAIN    │
│   (260px)    │      RESPONSIVO       │
│              │                       │
│  Menu Items  │   • Grid de Cards    │
│              │   • Busca de Sistemas │
│  Navegação   │   • Info do Usuário   │
│              │                       │
└──────────────┴───────────────────────┘
```

### Componentes Principais

#### 1. **Topbar**
- Logo da marca (HC-FMUSP + CeAC)
- Botão toggle do menu (responsivo)
- Informações do usuário autenticado
- Zona segura da marca

#### 2. **Sidebar**
- Menu lateral com categorias de sistemas
- Ícones Tabler Icons
- Navegação entre seções
- Expansível/colapsável em mobile

#### 3. **Cards de Sistemas**
Exibe links para sistemas do HC com ícones e descrições:

```javascript
// Mapa de sistemas e seus ícones
const cardUrlMap = {
  SoulMV: "http://...",
  MVPEP: "http://...",
  MVGE: "http://...",
  PIH: "http://...",
  // ... mais 30+ sistemas
};

const cardIconMap = {
  "Meu Perfil": "ti-user",
  "Meu ASO": "ti-file-check",
  "Ouvidoria": "ti-headset",
  // ... etc
};
```

#### 4. **Seções de Navegação**

- **Home**: Dashboard inicial
- **Meus Sistemas**: Sistemas do usuário
- **Administrativo**: Funções administrativas
- **Assistencial**: Sistemas de saúde
- **Pronto Atendimento**: PA
- **Ocupacional**: Saúde e segurança
- **Indicadores**: Painéis e KPIs
- **Colaborador**: Dados de funcionários
- **Gestores**: Gestão de pessoas

### Styling & CSS

#### Arquivo: `style.css`

Estilos globais com variáveis CSS reutilizáveis:

```css
:root {
  --brand-blue: #0077c8;        /* Azul principal */
  --brand-teal: #009ca6;        /* Teal da marca */
  --hc: var(--brand-blue);      /* Referência do HC */
  --hc-dark: #005f9a;           /* Azul mais escuro */
  --hc-light: #e8f4f6;          /* Azul claro */
  --sidebar-w: 260px;           /* Largura sidebar */
  --topbar-h: 58px;             /* Altura topbar */
  --bg: #f5f7f8;                /* Fundo geral */
  --surface: #ffffff;           /* Cards */
  --text: #1a2224;              /* Texto principal */
  --text-muted: #6b7b80;        /* Texto secundário */
}
```

#### Arquivos CSS Organizados

Dentro de `CSS/`:

| Arquivo | Propósito |
|---------|-----------|
| `variables.css` | Variáveis globais e temas |
| `reset-base.css` | Reset de estilos padrão |
| `layout.css` | Grid e flexbox geral |
| `sidebar.css` | Estilos da sidebar |
| `topbar.css` | Estilos da barra superior |
| `menu-items.css` | Itens do menu |
| `custom-select.css` | Dropdowns customizados |
| `logos-brand.css` | Logos da marca |
| `main-editabar-cards.css` | Cards e componentes |

### JavaScript Dinâmico

**Arquivo**: `script.js`

Responsável por:

1. **Mapeamento de Ícones**
   - Cada sistema tem um ícone Tabler associado
   - Ícone é renderizado dinamicamente nos cards

2. **Mapeamento de URLs**
   - Cada card possui uma URL de destino
   - Abre o sistema quando clicado

3. **Carregamento de Menu**
   - Menu é construído dinamicamente
   - Responde aos cliques do usuário

4. **Autenticação**
   - Integração com Clerk
   - Verifica se usuário está logado
   - Exibe informações do usuário

---

## 🔄 Login Flow

### Arquivo: `login.html` e `login.js`

Página dedicada à autenticação com:

- ✅ Card de login com Clerk
- ✅ Promessas de carregamento (`window._clerkLoaded`)
- ✅ Validação de domínio
- ✅ Redirecionamento pós-login
- ✅ Styling consistente com o site

**Fluxo**:

```
1. User acessa /login.html
           ⬇️
2. Script Clerk carrega (promessa)
           ⬇️
3. User autentica (OAuth/Passkey)
           ⬇️
4. Validar: email termina em @hc.fm.usp.br?
           ⬇️
      ✅ SIM              ❌ NÃO
           ⬇️               ⬇️
   Redireciona     Logout + Alerta
   para /          
   index.html
           ⬇️
5. Dashboard CONVERGE
```

---

## 📊 Ferramentas de Dados

### Scripts Python

Ferramentas auxiliares para manipulação de dados:

| Arquivo | Propósito |
|---------|-----------|
| `gerador.py` | Gera dados de teste |
| `gerar_base.py` | Cria base de dados inicial |
| `processar.py` | Processa dados |
| `checar_colunas.py` | Valida estrutura de dados |
| `limpar_e_gerar.py` | Limpa e regenera dados |
| `subir_nova_base.py` | Sincroniza com Convex |
| `diagnostico.py` | Diagnóstico de dados |

### Arquivos de Dados

| Arquivo | Conteúdo |
|---------|----------|
| `employees.jsonl` | Dados de colaboradores (formato JSONL) |
| `employees_mae.jsonl` | Dados resumidos (tabela mãe) |
| `tabela_mae.jsonl` | Tabela mãe (Convex) |
| `tabela_filha.jsonl` | Tabela filha (Convex) |
| `pgr_groups.jsonl` | Grupos do Programa de Rastreio |

---

## 🚀 Como Usar o Site

### 1. **Acessar o Site**

```
URL: https://seu-dominio.com
```

### 2. **Fazer Login**

- Email corporativo @hc.fm.usp.br
- Clique em "Continue with [Provider]" (Google, Microsoft, etc)
- Sistema valida automaticamente o domínio

### 3. **Navegar pelos Sistemas**

- **Sidebar esquerda**: Escolha a categoria
- **Cards**: Clique no sistema desejado
- **Busca**: (Se implementado) procure por nome do sistema

### 4. **Acessar Informações**

Dependendo da permissão:
- Meu Perfil
- Meu ASO
- Meus Chamados
- Compromissos Ocupacionais
- Dados de Funcionários

---

## 🔧 Configurações e Variáveis

### Ambiente (`.env.local`)

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Convex Backend
VITE_CONVEX_URL=https://your-app.convex.cloud

# API Endpoints
VITE_API_URL=https://api.seu-dominio.com
```

### Convex Configuration (`convex/tsconfig.json`)

Define como o TypeScript compila as funções Convex.

---

## 📦 Stack Tecnológico

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Styling responsivo com variáveis CSS
- **JavaScript Vanilla**: Sem frameworks (performance)
- **Clerk.js**: Autenticação integrada
- **Tabler Icons**: Ícones SVG

### Backend
- **Convex**: Platform all-in-one (DB + API + Realtime)
- **TypeScript**: Type safety completo
- **Node.js Runtime**: Execução de funções

### Banco de Dados
- **Convex Database**: NoSQL reativo
- **Índices**: Otimizados para queries

### DevOps
- **Git**: Controle de versão
- **GitHub**: Repositório central
- **Convex CLI**: Deploy automático

---

## 🎓 Estrutura de Pastas

```
/workspaces/Converge/
├── convex/                    # Backend Convex
│   ├── schema.ts             # Definição de tabelas
│   ├── testar.ts             # Funções de teste
│   ├── tsconfig.json         # Config TypeScript
│   └── _generated/           # Código gerado
│       ├── api.js            # API client
│       └── server.js         # Server utilities
│
├── CSS/                       # Estilos organizados
│   ├── variables.css
│   ├── layout.css
│   ├── sidebar.css
│   └── ...
│
├── index.html                # Página principal
├── login.html                # Página de login
├── auth.js                   # Lógica de autenticação
├── script.js                 # Lógica do portal
├── style.css                 # Estilos globais
│
├── package.json              # Dependências Node
├── .env.local               # Variáveis de ambiente
└── [Data Scripts]           # Python para dados
    ├── gerador.py
    ├── gerar_base.py
    └── ...
```

---

## ✅ Features Implementadas

### ✅ Autenticação
- [x] Login via Clerk
- [x] Validação de domínio @hc.fm.usp.br
- [x] Logout seguro
- [x] Redirecionamento automático

### ✅ Interface Web
- [x] Dashboard responsivo
- [x] Sidebar com navegação
- [x] Topbar com info do usuário
- [x] Grid de cards de sistemas
- [x] Ícones customizados
- [x] Temas com variáveis CSS

### ✅ Backend
- [x] Schema de dados (tabela mãe e filha)
- [x] Query para buscar dados
- [x] Índices para performance
- [x] Integração Convex

### ✅ Dados
- [x] Estrutura de colaboradores
- [x] Dados normalizados
- [x] Scripts de importação
- [x] Validação de dados

### ⏳ Próximas Features (Sugestões)
- [ ] Busca de sistemas (search bar)
- [ ] Filtros avançados
- [ ] Perfil do usuário customizável
- [ ] Histórico de acessos
- [ ] Notificações
- [ ] Dark mode
- [ ] Multi-idioma

---

## 🐛 Troubleshooting

### Login não funciona
1. Verificar se Clerk está carregando: `console.log(window._clerkLoaded)`
2. Testar email com domínio @hc.fm.usp.br
3. Limpar cache do navegador

### Banco de dados sem dados
1. Executar script Python: `python subir_nova_base.py`
2. Verificar conexão Convex
3. Checar índices: `query("tabela_mae").index("by_cpf")`

### Estilos não aplicando
1. Limpar cache CSS
2. Verificar imports em `index.html`
3. Testar em incógnito

### Performance lenta
1. Verificar índices de DB
2. Limitar tamanho de resultados (`.take(n)`)
3. Usar paginação

---

## 📞 Contato e Suporte

Para dúvidas sobre:

- **Convex**: https://docs.convex.dev
- **Clerk**: https://clerk.com/docs
- **Tabler Icons**: https://tabler-icons.io
- **GitHub Repo**: https://github.com/Dados-CeAC/Converge

---

## 📝 Notas Importantes

1. **Segurança**: Todas as validações de email são obrigatórias
2. **Performance**: Índices DB devem estar sempre otimizados
3. **Escalabilidade**: Convex cresce conforme demanda
4. **Backup**: Dados estão seguros em infraestrutura Convex
5. **Compliance**: Segue padrões HIPAA (saúde)

---

**Última Atualização**: Agosto de 2026  
**Versão**: 1.0.0  
**Mantido por**: Dados-CeAC (HC-FMUSP)

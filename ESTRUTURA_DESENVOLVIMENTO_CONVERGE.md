# Estrutura de desenvolvimento do Converge

## 1. Visao geral

O Converge e um portal web interno do CeAC, desenvolvido como uma aplicacao front-end composta por paginas HTML, CSS modular e JavaScript no navegador. O sistema organiza links, formularios e paineis operacionais em secoes de negocio.

A arquitetura atual e hibrida:

- **Portal principal:** `index.html` + `script.js`.
- **Autenticacao:** Clerk carregado por CDN em `login.html`, com regras em `login.js` e validacao complementar em `auth.js`.
- **Estilos globais:** `style.css` e arquivos da pasta `CSS/`.
- **Aplicacoes incorporadas:** algumas telas sao renderizadas pelo JavaScript; a Ouvidoria e carregada em um `iframe`.
- **Backend Convex:** configurado em `convex/`, com tabelas de colaboradores e uma query de teste. A maior parte dos dados visuais ainda e local ou simulada.
- **Materiais de apoio:** `MANUAL_EXPLICATIVO.md`, `MANUAL_INTERATIVO.html` e `tutorial.html`.

O fluxo geral de acesso e:

```text
login.html
   -> Clerk autentica o usuario
   -> login.js valida o dominio institucional
   -> index.html
   -> script.js monta menu, cards e tela ativa
   -> modulo selecionado renderiza sua interface
```

---

## 2. Organizacao dos arquivos

### 2.1 Paginas HTML

| Arquivo | Funcao |
|---|---|
| `login.html` | Tela de entrada e carregamento do Clerk. |
| `index.html` | Shell principal do portal: sidebar, topbar, area de cards, modais e tour. |
| `appOuvidoria_Simulador (1) (1).html` | Aplicacao independente da Ouvidoria, incorporada por iframe. |
| `tutorial.html` | Pagina de tutorial do sistema. |
| `MANUAL_INTERATIVO.html` | Manual interativo com abas e explicacoes visuais. |
| `appOuvidoria_Simulador (1) (1).html` | Simulador operacional de cadastro e tratamento de manifestacoes. |

### 2.2 JavaScript

| Arquivo | Responsabilidade |
|---|---|
| `login.js` | Espera o carregamento do Clerk, inicia sessao e redireciona o usuario. |
| `auth.js` | Faz uma segunda validacao de sessao e do dominio institucional na pagina protegida. |
| `script.js` | Controla a aplicacao principal, navegacao, renderizacao das telas, chamados, consultas, tour e integracoes. |
| JavaScript interno dos HTMLs | Implementa o manual interativo e o simulador da Ouvidoria. |

### 2.3 CSS

| Arquivo | Responsabilidade |
|---|---|
| `style.css` | Estilos do portal, sidebar, topbar, cards, paineis, tabelas, formularios, estados e responsividade. |
| `CSS/variables.css` | Variaveis de cores, espacamentos e identidade visual. |
| `CSS/reset-base.css` | Reset e base tipografica. |
| `CSS/layout.css` | Estrutura geral de layout. |
| `CSS/sidebar.css` | Menu lateral, secoes e usuario. |
| `CSS/topbar.css` | Barra superior e controles globais. |
| `CSS/menu-items.css` | Itens de menu e cards de navegacao. |
| `CSS/logos-brand.css` | Logos e identidade da marca. |
| `CSS/main-editabar-cards.css` | Area principal e cards. |
| `CSS/custom-select.css` | Aparencia dos selects personalizados. |

### 2.4 Convex

| Arquivo | Funcao |
|---|---|
| `convex/schema.ts` | Define `tabela_mae` e `tabela_filha`, relacionadas a registros de colaboradores. |
| `convex/testar.ts` | Query `buscarPrimeirosRegistros`, usada para retornar amostras das tabelas. |
| `convex/_generated/` | Arquivos gerados pelo Convex. Nao devem ser editados manualmente. |

---

## 3. Camada de entrada e autenticacao

## Tela 1 - Login

**Arquivo principal:** `login.html`  
**Comportamento:** `login.js`  
**Estilos:** `login.css`, `CSS/variables.css` e `CSS/reset-base.css`

### Estrutura visual

1. Wrapper central da tela.
2. Card de login.
3. Barra superior com logo do Converge.
4. Cabecalho com titulo e mensagem de boas-vindas.
5. Area de mensagem de erro.
6. Botao `Fazer login`.
7. Rodape com a marca CeAC e a descricao institucional.

### Fluxo tecnico

1. O HTML carrega o Clerk por CDN.
2. Um `Promise` global chamado `_clerkLoaded` sinaliza quando o script terminou de carregar.
3. `login.js` espera o Clerk por ate alguns segundos.
4. O botao permanece desabilitado enquanto o carregamento nao termina.
5. Depois de `Clerk.load()`, o sistema verifica se ja existe uma sessao.
6. Se houver sessao valida, o usuario vai para `index.html`.
7. Se nao houver sessao, o clique chama `redirectToSignIn` ou `openSignIn`.
8. A URL de retorno e `index.html`.
9. Erros sao exibidos no bloco `.error-message`.

### Regra de acesso

Somente enderecos terminados em `@hc.fm.usp.br` sao aceitos. Usuarios externos sao desconectados e retornam para o login.

### Observacoes

- O titulo contem o texto `Sing in Converge`, que pode ser corrigido para `Sign in Converge` ou, preferencialmente, `Entrar no Converge`.
- O logo referenciado precisa existir no projeto para aparecer corretamente.
- A chave usada no HTML e uma chave publicavel do Clerk; segredos nao devem ser colocados no front-end.

## Tela 2 - Validacao da pagina protegida

**Arquivo:** `auth.js`

`auth.js` funciona como uma barreira adicional quando a pagina protegida e aberta diretamente:

1. Aguarda `DOMContentLoaded`.
2. Executa `Clerk.load()`.
3. Redireciona para `login.html` se o Clerk falhar.
4. Redireciona se nao houver `Clerk.user`.
5. Le o e-mail principal.
6. Bloqueia qualquer dominio diferente de `@hc.fm.usp.br`.
7. Faz `signOut` quando encontra um usuario nao autorizado.

Essa dupla validacao melhora o fluxo do front-end, mas a autorizacao definitiva de dados deve continuar no backend.

---

## 4. Shell do portal principal

## Tela 3 - Portal inicial

**Arquivo:** `index.html`  
**Controlador:** `script.js`  
**Estilos:** `style.css` e arquivos de `CSS/`

O portal principal e uma tela-shell. Ela nao troca de pagina a cada clique; o JavaScript limpa e reconstrui partes da interface de acordo com o estado atual.

### Regioes fixas

#### Sidebar

A barra lateral concentra:

- Logo e nome Converge.
- Menu de secoes.
- Perfil e informacoes do usuario autenticado.
- Botao ou link de perfil.
- Acao de logout.
- Comportamento de abertura e fechamento em dispositivos moveis.

A funcao `render()` monta os elementos de menu a partir do array `sections`. A secao ativa e controlada por `activeSection`.

#### Topbar

A barra superior apresenta:

- Botao de menu mobile.
- Titulo da pagina ativa.
- Controles de contexto.
- Acoes globais, quando aplicaveis.
- Acesso ao tour guiado.

#### Area de conteudo

A area central contem:

- Titulo dinamico.
- Botao de voltar para niveis internos.
- Grade `cardsGrid`.
- Estado vazio quando nao ha conteudo.
- Paineis especiais inseridos pelo JavaScript.

### Estado principal

O JavaScript usa principalmente:

- `activeSection`: secao selecionada na sidebar.
- `activeCard`: modulo ou card aberto.
- `activeDetailParent`: pai de um card aninhado.
- `selectedProcessId`: processo juridico selecionado.
- Estado do modulo de chamados.
- Estado do tour guiado.

A funcao `renderCards()` identifica o modulo ativo e decide qual renderizador deve ser chamado.

---

## 5. Menu e navegacao por secoes

## Tela 4 - Catalogo de secoes

As secoes declaradas em `script.js` sao:

1. **Home**
   - Meus Sistemas
   - Meu Perfil
   - Indicadores
   - Consultar Funcionário
2. **Meus Sistemas**
   - SoulMV
   - MVPEP
   - PIH
   - HCMED
   - Interrad
   - Portal RH FFM
   - NatcorpHC
   - NatcorpFZ
3. **Administrativo**
   - Controles Internos
   - Comunicacao
   - Apoio Predial
4. **Indicadores**
   - PIH
5. **Assistencial**
   - Ambulatorio
   - Pronto Atendimento
6. **Ocupacional**
   - Seguranca do Trabalho
   - Saude Ocupacional
7. **Qualidade**
   - Meus Chamados
   - operador
8. **Dados**
   - Meu Chamados
   - Operador
9. **Ouvidoria**
   - Ouvidoria
   - Trello
10. **Assessoria Juridica**
    - Processos
    - Profissionais
    - Perícias

O menu e renderizado pela funcao `render()`. Algumas secoes sao filtradas da sidebar para evitar duplicidade com a Home, mas seus cards continuam sendo usados no sistema.

## Tela 5 - Grade de cards

A funcao `renderSectionCards()` cria os cards comuns. Cada card normalmente possui:

- Icone Tabler.
- Nome do modulo.
- Descricao ou contexto.
- Estado ativo.
- Evento de clique.
- Possivel navegacao para subcards.

Os mapas `iconMap`, `cardIconMap` e `cardUrlMap` associam nomes a icones e links externos.

Quando um card e selecionado:

1. `activeCard` recebe o nome.
2. O pai e salvo em `activeDetailParent` quando necessario.
3. `renderCards()` e chamado novamente.
4. A tela especial substitui a grade comum.
5. O botao voltar aparece quando o modulo permite retorno.

---

## 6. Tela Home e perfil

## Tela 6 - Home

A Home funciona como ponto de entrada do portal. Ela apresenta atalhos para:

- Meus Sistemas.
- Meu Perfil.
- Indicadores.
- Consultar Funcionário.

A funcao `renderMeuPerfil()` cria o painel de perfil quando o usuario seleciona essa opcao. O usuario autenticado tambem e exibido na sidebar pela funcao `displayClerkUser()`.

## Tela 7 - Meu Perfil

O perfil e acessado pelo menu ou pelo link do usuario na sidebar. O estado de navegacao e ajustado para:

- Limpar a secao anterior.
- Definir `activeCard = "Meu Perfil"`.
- Renderizar os cards e o painel correspondente.

As informacoes exibidas dependem dos dados retornados pelo Clerk e dos elementos existentes no HTML.

---

## 7. Meus Sistemas e links externos

## Tela 8 - Meus Sistemas

A tela funciona como um catalogo de acessos para sistemas corporativos. Os cards usam `cardUrlMap` quando existe uma URL conhecida.

Sistemas mapeados incluem:

- SoulMV.
- MVPEP.
- PIH.
- HCMED.
- Interrad.
- Portal RH FFM.
- NatcorpHC.
- NatcorpFZ.

O portal e responsavel pela apresentacao e navegacao. A autenticacao ou operacao interna de cada sistema ocorre no destino externo.

## Tela 9 - Administracao e controles internos

A secao Administrativa organiza:

- Controles Internos.
- Comunicacao.
- Apoio Predial.

`Controles Internos` abre um segundo nivel com:

- Contratos.
- Suprimentos e Estoque.
- Faturamento.
- Custos.

Esses niveis sao definidos pelos arrays `controlesInternosCards` e pela funcao `renderControlesInternosCards()`.

---

## 8. Modulos assistenciais e ocupacionais

## Tela 10 - Ambulatorio

`Ambulatorio` e um agrupador para processos assistenciais. Seus subcards sao:

- Linha de Cuidados.
- Programa de Rastreio.

A funcao `renderAmbulatorioNestingCards()` monta essa navegacao aninhada.

## Tela 11 - Linha de Cuidados

O modulo apresenta cards de acompanhamento e cuidado:

- HAS.
- DM.
- Gestante/Lactante.
- Borboletas.
- Saude mental.

Os nomes sao mantidos no array `linhaCuidadosCards`.

## Tela 12 - Programa de Rastreio

O modulo organiza linhas de rastreamento:

- CA Colo Utero.
- CA Próstata.
- CA Colorretal.
- CA Mama.

Esses cards sao identificados pelo array `programaRastreioCards` e recebem titulo contextual no `renderCards()`.

## Tela 13 - Borboletas

O modulo possui dois niveis:

1. Card `Borboletas` dentro de Linha de Cuidados.
2. Card `Formulário` associado ao contexto de Borboletas.

`renderBorboletasForm()` monta o formulario FRIDA. O formulario contem:

- Nome.
- Data do atendimento.
- Perguntas de avaliacao de risco.
- Respostas para cada pergunta.
- Estrutura de tabela para leitura sequencial.

As vinte perguntas ficam no array `borboletasQuestions`. O modo formulario recebe as classes `borboletas-active` e `borboletas-form-open` para alterar o layout.

## Tela 14 - Pronto Atendimento

O agrupador de Pronto Atendimento direciona para:

- Farmacia.
- Transferencia.
- Hiperutilizadores.

A navegacao e controlada por `prontoAtendimentoCards` e `renderProntoAtendimentoCards()`.

## Tela 15 - Ocupacional

A area Ocupacional concentra:

- Seguranca do Trabalho.
- Saude Ocupacional.
- Minhas Doses.
- Meu ASO.
- Votacao - CIPA.
- Compromissos Ocupacionais.
- Ficha de EPI.

`Compromissos Ocupacionais` abre:

- Agenda.
- Exame.

A ficha de EPI e identificada por `isFichaEpi` e recebe renderizacao especifica quando essa logica e acionada.

---

## 9. Consulta de colaboradores

## Tela 16 - Consultar Funcionario

**Renderizador:** `renderConsultarFuncionario()`

Essa tela foi criada para consultar registros de colaboradores. O fluxo visual inclui:

1. Area de busca.
2. Filtros ou campos de consulta.
3. Estado inicial vazio.
4. Estado sem resultados.
5. Lista ou tabela de resultados.
6. Detalhes do funcionario selecionado, quando aplicavel.

Funcoes auxiliares importantes:

- `renderFuncionarioEmptyState()` para mensagens vazias.
- `renderFuncionarioResults()` para resultados.
- `normalizeField()` para substituir valores ausentes por `—`.

A tela possui tratamento para dados incompletos e estados sem retorno.

## Tela 17 - Dados

A secao Dados apresenta acessos operacionais ligados a dados e colaboradores. Atualmente ela direciona para:

- Meu Chamados.
- Operador.

O backend Convex possui tabelas de colaboradores que podem alimentar futuras consultas, mas o uso efetivo deve ser confirmado no fluxo de cada tela.

---

## 10. Chamados

## Tela 18 - Meus Chamados

**Renderizador:** `renderMeusChamados()`

O modulo de chamados tem duas visoes:

### Novo Chamado

Permite iniciar uma nova demanda. O container e montado com a aba `Novo Chamado` e uma area de conteudo dinamica.

### Lista de Chamados

Apresenta os chamados cadastrados em tabela ou cards, conforme o contexto responsivo.

### Resumo

A tela calcula quatro indicadores:

- Total.
- Abertos.
- Em andamento.
- Urgentes.

### Dados apresentados

Cada chamado pode exibir:

- Protocolo.
- Data.
- Anonima.
- Manifestante.
- CPF.
- Instituto.
- Tipo.
- Setor.
- Status.
- Prioridade.

### Status

Os status suportados no front-end incluem:

- Aberto.
- Em andamento.
- Concluido.
- Nao solucionado.

As funcoes `statusClass()` e `priorityClass()` transformam os valores em classes visuais.

### Persistencia atual

O modulo declara constantes de IndexedDB e uma chave local para chamados. O armazenamento e local ao navegador, diferente de um banco compartilhado de producao. A integracao deve ser tratada com cuidado para evitar divergencia entre browsers e usuarios.

---

## 11. Ouvidoria

## Tela 19 - Entrada da Ouvidoria

A Ouvidoria aparece na secao `Ouvidoria` e no card de mesmo nome. Quando o usuario abre o card, `renderOuvidoriaApp()` cria:

- Cabecalho com identificacao `appOuvidoria`.
- Indicador de disponibilidade.
- Iframe com `appOuvidoria_Simulador (1) (1).html`.

O portal principal apenas hospeda o modulo. A regra de negocio fica dentro do arquivo do simulador.

## Tela 20 - Operador

E a tela inicial do simulador da Ouvidoria. Apresenta uma tabela com:

- ID/protocolo.
- Data.
- Tipo.
- Setor.
- Manifestante.
- Status.

O botao `Adicionar Ouvidoria` abre o drawer de cadastro.

A funcao `renderOperadorTable()` reconstrui a tabela a partir do array local `database`.

## Tela 21 - Cadastro de manifestacao

O cadastro e um drawer lateral com formulario. Campos principais:

- Data da manifestacao.
- Manifestacao anonima.
- Nome, CPF e cargo quando nao anonima.
- Tipo de manifestacao.
- Setor de destino.
- Envolve medico terceiro.
- Nome do medico quando aplicavel.
- Procedencia.
- Existencia de plano de acao.
- Descricao da manifestacao.

Os controles condicionais sao gerenciados por:

- `setAnon()`.
- `setMed()`.
- `setProc()`.
- `setPlano()`.

A validacao foi centralizada em `isFormValid()`. Ao salvar, `saveOuvidoria()`:

1. Atualiza os campos condicionais.
2. Valida o formulario.
3. Gera um protocolo numerico.
4. Monta o objeto da ocorrencia.
5. Inclui a ocorrencia no inicio de `database`.
6. Atualiza todas as visoes.
7. Limpa e fecha o drawer.

## Tela 22 - Minhas Ouvidorias

A lista e montada por `renderOuvidoriasTable()`. Ela apresenta:

- Protocolo.
- Data.
- Tipo.
- Setor de destino.
- Procedencia.
- Acao de analise.

O perfil `SETOR` filtra a lista para `Pronto Atendimento`. O clique em uma linha chama `openDetail()`.

## Tela 23 - Detalhe da Ouvidoria

O detalhe usa tres paineis:

### Painel de informacoes

Mostra uma ficha visual com:

- Protocolo em destaque.
- Status da ultima acao ou `Em Analise`.
- Data.
- Tipo.
- Setor de destino.
- Procedencia.
- Manifestante.
- CPF ou indicacao de anonimato.
- Relato completo.

### Painel de acoes

`renderPanelActions()` lista os planos de acao da ocorrencia, com:

- Status.
- Prazo.
- Descricao.
- Responsavel.
- Evidencia, quando registrada.

### Painel de interacoes

`renderPanelChat()` mostra as mensagens internas com:

- Usuario.
- Data e hora.
- Texto da interacao.

## Tela 24 - Plano de acao

O drawer de acao permite cadastrar:

- Descricao.
- Alteracao de processo.
- Detalhamento da alteracao.
- Prazo.
- Responsavel.
- Status.
- Evidencia e anexo quando finalizado.

`toggleEvidencia()` torna os campos de evidencia obrigatorios quando o status e `Finalizado`. `saveAcao()` adiciona a acao na ocorrencia selecionada e atualiza o kanban.

## Tela 25 - Interacao interna

O drawer de chat recebe:

- Texto obrigatorio.
- Arquivo opcional.

`saveChat()` valida o texto, registra o usuario simulado, usa a data/hora corrente e redesenha o painel.

## Tela 26 - Minhas Acoes

A tela apresenta um kanban com tres colunas:

- Em Aberto.
- Em Execucao.
- Finalizadas.

`renderAcoesKanban()` percorre todas as ocorrencias e distribui cada plano de acao pela coluna do status. Os contadores sao atualizados em `countAberto`, `countExec` e `countFim`.

## Dados da Ouvidoria

O `database` da Ouvidoria e atualmente uma variavel JavaScript em memoria. Cada registro possui, em geral:

```text
id
 date
 tipo
 setor
 anonima
 nome
 cpf
 cargo
 medicoTerceiro
 medicoNome
 procedente
 planoAcao
 desc
 actions[]
 chats[]
```

Consequencias da implementacao atual:

- Recarregar a pagina perde novos registros.
- Outro usuario nao ve os dados criados localmente.
- O iframe possui um estado independente do portal.
- Ainda nao existe CRUD persistente de Ouvidoria no Convex.

---

## 12. Assessoria Juridica

## Tela 27 - Processos

**Renderizador:** `renderProcessosPanel()`

O painel juridico usa lista lateral e area de detalhes. Cada processo possui titulo, empresa, instituto, status e data. A classe visual do status e calculada por `getProcessStatusClass()`.

A tela tambem contem formulario de inclusao e campos especificos por area, montados por:

- `renderProcessContent()`.
- `renderAddProcessForm()`.
- `renderAreaSpecificFields()`.
- `renderObjectDetails()`.

## Tela 28 - Profissionais

**Renderizador:** `renderProfissionaisPanel()`

Organiza consultas ou registros relacionados a profissionais. O painel usa a mesma linguagem visual da area juridica e reaproveita estados de selecao e detalhes.

## Tela 29 - Pericias

**Renderizador:** `renderPericiasPanel()`

Apresenta registros de pericia com classificacao de status via `getPericiaStatusClass()` e area de resultados.

## Integracao DataJud

A funcao `fetchDataJudAcesso()` chama a API publica configurada em `dataJudApiUrl` usando a chave presente no JavaScript. O retorno e convertido para JSON quando possivel e normalizado para:

- `ok`.
- `status`.
- `statusText`.
- `data`.

Uma chave de acesso exposta no front-end deve ser revisada antes de uso produtivo. O ideal e mover chamadas autenticadas para uma funcao de backend.

---

## 13. Manual e treinamento

## Tela 30 - Tutorial

`tutorial.html` serve como material de orientacao do usuario. E uma pagina separada do portal e pode ser aberta diretamente.

## Tela 31 - Manual interativo

`MANUAL_INTERATIVO.html` possui JavaScript proprio e organiza explicacoes em abas. O manual e uma experiencia de consulta, nao uma tela operacional ligada ao estado do portal.

## Documento explicativo

`MANUAL_EXPLICATIVO.md` complementa os materiais visuais com instrucoes textuais.

---

## 14. Tour guiado

O tour esta integrado ao `index.html` e usa elementos como:

- `.tour-overlay`.
- `.tour-spotlight`.
- `.tour-popover`.
- `.tour-modal`.
- `.tour-highlight`.

O objetivo e destacar partes da interface e orientar o usuario passo a passo. O tour manipula posicionamento, foco visual, botoes de avancar/voltar e encerramento.

---

## 15. Convex e modelo de dados

## Tabela mae

`convex/schema.ts` define `tabela_mae` com:

- `cpf`.
- `matricula`.
- `vinculo`.
- `situacao`.

Existe o indice `by_cpf`.

## Tabela filha

`tabela_filha` possui:

- `seq_id`.
- `cpf`.
- `matricula`.
- `vinculo`.
- `situacao`.
- `grupo_generico`.
- `empresa`.
- `filial`.
- `local_trab`.
- `cargo`.
- `funcao`.

Existem indices `by_cpf` e `by_situacao`.

## Query de teste

`convex/testar.ts` expoe `buscarPrimeirosRegistros`, que retorna ate cinco documentos de cada tabela e um status textual de conectividade.

## Estado atual da integracao

O Convex esta preparado para dados de colaboradores, mas a documentacao do estado atual indica que a Ouvidoria, os chamados e varios paineis ainda usam dados locais, arrays em memoria ou IndexedDB. Para uma arquitetura de producao, cada modulo deve ter:

1. Schema dedicado.
2. Queries e mutations com validacao.
3. Controle de identidade via Clerk.
4. Verificacao de propriedade e escopo.
5. Estados de carregamento e erro na interface.

---

## 16. Fluxos principais de usuario

### Fluxo A - Entrar no portal

```text
Abrir login.html
 -> Clerk carrega
 -> usuario clica em Fazer login
 -> Clerk autentica
 -> dominio @hc.fm.usp.br e validado
 -> index.html e aberto
 -> dados do usuario aparecem na sidebar
```

### Fluxo B - Abrir um modulo

```text
Clicar em uma secao
 -> activeSection recebe o id
 -> render() reconstrui a sidebar
 -> renderCards() identifica a secao
 -> clicar no card
 -> activeCard recebe o modulo
 -> renderizador especializado monta o conteudo
```

### Fluxo C - Registrar Ouvidoria

```text
Ouvidoria
 -> Operador
 -> Adicionar Ouvidoria
 -> preencher formulario
 -> campos condicionais aparecem conforme as respostas
 -> validar
 -> salvar no database local
 -> atualizar tabela
```

### Fluxo D - Tratar Ouvidoria

```text
Minhas Ouvidorias
 -> selecionar registro
 -> abrir detalhe em tres paineis
 -> adicionar plano de acao ou interacao
 -> atualizar historico
 -> acompanhar a acao no kanban
```

### Fluxo E - Consultar colaborador

```text
Home ou Dados
 -> Consultar Funcionario
 -> informar filtros
 -> buscar registros
 -> renderizar resultados
 -> exibir estado vazio ou detalhes
```

---

## 17. Padrao de renderizacao usado

O Converge usa renderizacao imperativa no DOM:

1. Uma funcao localiza um container por `id` ou seletor.
2. O container e limpo com `innerHTML = ""`.
3. Strings de template geram HTML.
4. Eventos sao conectados por `onclick` ou `addEventListener`.
5. Alteracoes de estado chamam novamente uma funcao de renderizacao.

Esse padrao facilita prototipos rapidos e modulos independentes, mas exige cuidado com:

- Escape de dados antes de inserir HTML.
- Duplicacao de regras de estado.
- Persistencia apos recarregar.
- Acessibilidade de controles criados como `div`.
- Tratamento de loading e erro.

---

## 18. Pontos fortes atuais

- Separacao razoavel entre portal, autenticacao e modulos.
- Navegacao por estado sem dependencias de framework.
- Identidade visual centralizada em variaveis CSS.
- Modulos especiais com renderizadores dedicados.
- Tratamento de estados vazios em consultas e chamados.
- Ouvidoria com fluxo demonstravel de cadastro, analise, acao, interacao e kanban.
- Convex ja configurado com schema e indices iniciais.

## 19. Pontos que ainda precisam evoluir

1. Persistir Ouvidoria em Convex.
2. Persistir chamados de forma compartilhada e autenticada.
3. Remover chaves e chamadas sensiveis do front-end.
4. Criar autorizacao server-side por perfil, setor e usuario.
5. Padronizar nomes entre `Meu Chamados`, `Meus Chamados` e `Ouvidoria`.
6. Corrigir textos misturados em portugues e ingles.
7. Substituir dados simulados por dados reais nos modulos operacionais.
8. Extrair o simulador da Ouvidoria de um arquivo com nome temporario para um modulo com nome estavel.
9. Adicionar testes de navegacao e validacao dos formularios.
10. Revisar acessibilidade, especialmente controles clicaveis que ainda usam `div`.
11. Centralizar configuracoes de ambiente e URLs externas.
12. Adicionar estados visuais de carregamento, sucesso e erro.

---

## 20. Ordem recomendada para uma evolucao de producao

### Fase 1 - Organizacao

- Renomear arquivos temporarios.
- Padronizar textos e nomes de modulos.
- Separar CSS e JavaScript da Ouvidoria em arquivos proprios.
- Criar configuracao de ambiente para URLs e integracoes.

### Fase 2 - Dados e seguranca

- Criar schema Convex da Ouvidoria.
- Criar queries, mutations e validadores.
- Integrar identidade Clerk ao contexto Convex.
- Aplicar autorizacao por perfil e setor.
- Retirar chaves de API do navegador.

### Fase 3 - Experiencia de uso

- Migrar tabelas e cards para componentes reutilizaveis.
- Adicionar busca, filtros e ordenacao.
- Implementar feedback de sucesso e erro.
- Melhorar acessibilidade de teclado e leitores de tela.
- Revisar comportamento em telas moveis.

### Fase 4 - Qualidade operacional

- Testar login e bloqueio de dominio.
- Testar cada rota de navegacao.
- Testar cadastro e validacoes condicionais da Ouvidoria.
- Testar permissoes com usuarios diferentes.
- Testar persistencia, concorrencia e recuperacao de erros.
- Monitorar logs e desempenho do backend.

---

## 21. Resumo da arquitetura em uma frase

O Converge foi construido como um portal HTML/CSS/JavaScript orientado a secoes e cards, protegido pelo Clerk, com modulos especiais renderizados dinamicamente e backend Convex em processo de integracao para substituir os dados locais e simulados.

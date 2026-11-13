# Controle Financeiro React

Aplicativo de estudo e portfólio para controle financeiro pessoal, desenvolvido com **React, JavaScript e Firebase**. Reúne autenticação, movimentações financeiras e consultas ao Firestore em uma interface web.

## Demonstração

[Abrir a interface publicada](https://controle-financeiro-react-two.vercel.app)

O link permite acessar a interface de demonstração. Sua disponibilidade não comprova o funcionamento de todos os fluxos autenticados nem a configuração das regras de segurança do Firestore.

## Minha contribuição

Desenvolvi o projeto manualmente como prática de React e integração com Firebase, utilizando o Gemini como tutor e apoio ao aprendizado. O trabalho envolve componentes de interface, gerenciamento de estado, autenticação e operações de persistência. As limitações abaixo fazem parte dos próximos passos de evolução do projeto.

## O que está implementado

- Cadastro, login e logout com e-mail e senha pelo Firebase Authentication.
- Cadastro, edição e exclusão de entradas e saídas.
- Consulta de movimentações do usuário autenticado com atualização via `onSnapshot`.
- Cálculo de saldo e filtros de movimentações.
- Relatório de despesas agrupadas por categoria.
- Cadastro de reserva financeira e movimentação entre reserva e saldo.
- Painel de planejamento com navegação entre meses.

Esses recursos estão presentes no código. Isso não equivale a uma certificação de segurança nem a testes completos em produção. Veja as limitações abaixo.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Interface | React 19, JavaScript e CSS |
| Desenvolvimento e build | Vite 8 |
| Autenticação | Firebase Authentication |
| Persistência | Cloud Firestore |
| Análise estática | ESLint 9 |

As versões exatas instaladas são registradas em [package-lock.json](treino-react/package-lock.json). O projeto utiliza os SDKs do Firebase no cliente; não possui servidor Node.js próprio nesta árvore.

## Organização

O aplicativo está na pasta `treino-react/`.

- [App.jsx](treino-react/src/App.jsx): estado da aplicação, sessão e integração dos painéis.
- [components](treino-react/src/components): login e painéis principal, de relatórios, reserva e planejamento.
- [authServices.jsx](treino-react/src/services/authServices.jsx): operações de autenticação.
- [transacaoService.jsx](treino-react/src/services/transacaoService.jsx): operações de transações e reserva no Firestore.
- [utils](treino-react/src/utils): cálculo de saldo, filtros, datas, categorias e formatação monetária.

## Executar localmente

Pré-requisitos: Git, npm, uma versão de Node.js compatível com o Vite utilizado e um projeto Firebase configurado para desenvolvimento.

```bash
git clone https://github.com/LuanValle/controle-financeiro-react.git
cd controle-financeiro-react/treino-react
npm ci
```

Configure localmente as variáveis indicadas no arquivo `.env.example`, utilizando seu próprio projeto Firebase. Habilite a autenticação por e-mail e senha e configure o Firestore. Se uma consulta solicitar índice composto, crie o índice correspondente no projeto de desenvolvimento.

Não inclua senhas, contas de serviço, chaves privadas ou credenciais administrativas no front-end nem no repositório. Variáveis com prefixo `VITE_` são incorporadas ao aplicativo entregue ao navegador e não devem ser tratadas como segredos.

```bash
npm run dev
```

### Scripts disponíveis

```bash
npm run lint
npm test
npm run build
npm run preview
```

`preview` serve o build localmente. Não substitui a configuração de hospedagem.

### Testes de utilitários

Execute `npm test` na pasta `treino-react/`. Os testes usam `node:test`, incluído no Node.js, e não precisam de dependências instaladas, variáveis de ambiente, conexão com Firebase ou dados reais.

A suíte inicial verifica cálculo de saldo e filtros por tipo com dados fictícios: listas vazias, entradas, saídas, saldo negativo, valores zero, um cenário com centavos, ordem dos resultados e preservação da lista original. Ela não cobre interface, autenticação, Firestore, validação de entradas inválidas nem garante precisão monetária para todos os números decimais de JavaScript.

A evolução de 12/11/2026 acrescenta sete testes de datas, totalizando 21 testes: meses de 1 a 12, ano bissexto, preservação do objeto recebido, erro para data inválida e a virada do ano nos fusos UTC e America/Manaus. Os dois casos de fuso rodam em processos isolados, sem alterar o fuso dos outros testes. O comportamento atual guarda o instante ISO em UTC e os campos dia/mês/ano no calendário local: às 02:30 UTC de 1º de janeiro ainda é 31 de dezembro em Manaus. Isso não valida como a interface ou o Firestore usam esses campos.

A evolução de 13/11/2026 acrescenta 11 testes de formatação BRL e categoria padrão, totalizando 32. Verifica zero, centavos, milhares, negativos, duas casas decimais e texto numérico com ponto. A comparação inclui o espaço inquebrável (`\u00a0`) entre `R$` e o valor. Arredondar a apresentação não corrige a precisão do cálculo financeiro. Os testes também documentam limites existentes: texto com vírgula (`"12,34"`) produz `R$ NaN`, e tipos desconhecidos recebem `Alimentação`; esses helpers não validam entradas. Não são comportamentos recomendados para um formulário, nem validação de dados do usuário.

Exercício de formatação: preveja a saída para `1234.5` e compare com `"1234,5"`. Explique a diferença entre formatar (mudar a apresentação) e validar (aceitar ou rejeitar uma entrada).

Exercício de datas: antes de rodar os testes, preveja o dia, mês e ano de `2026-01-01T02:30:00.000Z` em Manaus. Explique por que o texto ISO permanece igual nos dois fusos.

Esta suíte foi implementada com IA como melhoria do portfólio. Os testes são evidência do comportamento verificado, não comprovação de domínio pessoal. Exercício sugerido: adicione um caso em que entradas e saídas se anulem e explique por que o saldo esperado é zero.

## Segurança e dados

A consulta de transações utiliza o identificador do usuário autenticado. **Filtrar dados no cliente não garante autorização de acesso.** Leituras e escritas precisam ser protegidas pelas regras do Firestore, inclusive atualizações e exclusões por identificador.

As regras do Firestore e seus testes não estão versionados nesta árvore. Portanto, este repositório, sozinho, não permite verificar o isolamento entre contas no ambiente publicado. Use um projeto de desenvolvimento e dados fictícios até validar as regras e os fluxos.

## Limitações conhecidas e próximos passos

- Preservar a data original ao editar uma transação: o preenchimento do formulário de edição ainda precisa contemplar esse campo.
- Ajustar o planejamento à quantidade real de dias de cada mês; o cálculo atual usa 30 dias.
- Tornar a movimentação de reserva consistente: a atualização da reserva e o registro da transação são operações separadas.
- Propagar falhas ao salvar a reserva, para evitar indicar sucesso após um erro.
- Limpar dados de interface na troca de sessão e testar o isolamento entre contas.
- Ampliar os testes para os demais utilitários, operações financeiras e regras do Firestore.
- Adicionar filtro mensal aos relatórios por categoria.
- Validar os fluxos autenticados e as regras de acesso no ambiente de demonstração.

## Autor

[Luan Valle](https://github.com/LuanValle)

Projeto em evolução. As funcionalidades descritas devem ser avaliadas junto com as limitações e com o código da versão consultada.


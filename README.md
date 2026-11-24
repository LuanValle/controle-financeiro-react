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

### Estudar os testes sem configurar Firebase

Para estudar somente as funções de cálculo, filtro, data e formatação, você não precisa criar conta, preencher `.env` ou instalar as dependências da interface. Use Git, npm e Node.js 24.

**Enquanto o [PR #4](https://github.com/LuanValle/controle-financeiro-react/pull/4) estiver aguardando integração, os testes estão na branch `test/2026-11-11-balance-filters`, não na `main`.** Um clone comum seleciona a branch padrão e, nesse estado, não oferece `npm test`.

Para começar em uma pasta nova, sem alterar uma cópia de trabalho existente:

```bash
git clone --branch test/2026-11-11-balance-filters --single-branch https://github.com/LuanValle/controle-financeiro-react.git controle-financeiro-estudo
cd controle-financeiro-estudo/treino-react
npm test
```

Se a pasta `controle-financeiro-estudo` já existir, use outro nome de destino e ajuste o `cd`; não apague seu trabalho. Se já estiver na raiz da cópia desta branch, basta executar `cd treino-react` e `npm test`.

Se aparecer `Missing script: "test"`, confira `git branch --show-current` e `npm run`. O primeiro mostra a branch; o segundo lista os scripts do `package.json` na pasta atual. Estar na `main` ou na pasta errada não significa que os testes falharam: eles ainda não foram executados. Prefira o clone separado acima a trocar uma branch com alterações pendentes.

Resultado esperado nesta versão: **44 testes aprovados**. Para investigar apenas a composição de filtros e saldo:

```bash
node --test src/utils/composicaoSaldo.test.js
```

Esse comando executa oito testes. Composição é passar o resultado de uma função para outra; aqui, filtrar a lista antes de calcular seu saldo. Os comandos acima foram verificados sem `node_modules` e sem arquivo `.env`. O download inicial do repositório requer acesso ao GitHub.

Um teste aprovado significa apenas que aquele cenário produziu o resultado esperado. Não comprova funcionamento da interface, login, permissões do Firestore ou precisão monetária para todos os decimais. Para executar a aplicação completa, siga a configuração abaixo.

Exercício opcional: no arquivo `composicaoSaldo.test.js`, identifique as entradas de 120 e 30 e as saídas de 45 e 15. Antes de executar, explique por que o saldo geral esperado é 90. Material de estudo preparado com IA; não comprova domínio pessoal.

### Reexecutar testes enquanto estuda

Na pasta `treino-react/`, use:

```bash
npm run test:watch
```

O modo **watch** observa os arquivos e reexecuta os testes afetados ao salvar uma mudança. Uma reexecução pode mostrar menos testes que a execução inicial, pois não precisa repetir arquivos que não mudaram. Antes era preciso repetir `npm test` manualmente; agora o retorno é contínuo. Ele permanece aberto até você pressionar **Ctrl+C** e não precisa de Firebase nem de dependências extras.

Para trabalhar em um único arquivo:

```bash
npm run test:watch -- src/utils/calcularSaldo.test.js
```

O `--` encaminha o caminho ao Node.js. Para uma verificação que termina sozinha, continue usando `npm test`; não use o modo watch como etapa de CI, pois ele fica aguardando novas edições.

Exercício em uma cópia de estudo: altere temporariamente o resultado esperado de um teste de saldo, salve e observe a falha. Restaure o valor correto, salve e observe a aprovação. Encerre com Ctrl+C e confira seu diff antes de publicar. Esse ciclo demonstra feedback de testes; não significa que a funcionalidade original foi desenvolvida com TDD.

### Executar a aplicação completa

O roteiro abaixo parte de outra pasta nova e usa a branch padrão. Não é necessário para o estudo dos testes acima.

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

Os scripts abaixo correspondem à branch deste documento; `test` foi adicionado no PR #4 e ainda depende de sua integração para aparecer na `main`.

```bash
npm run lint
npm test
npm run test:watch
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


## Evolução dos testes: lançamentos de mesmo valor (17/11/2026)

A suíte agora tem 38 testes. O novo cenário em `composicaoSaldo.test.js` preserva dois recebimentos de R$ 100 e dois pagamentos de R$ 30, cada um com um ID diferente. Antes esse caso não era verificado; agora filtros e saldo devem manter os quatro lançamentos e resultar em R$ 140. Não houve mudança no cálculo ou na interface.

Ter o mesmo valor não significa ser a mesma transação. O teste protege contra uma futura deduplicação indevida por tipo e valor; não verifica duplicidade de IDs, importação ou Firestore. Usa somente dados fictícios e inteiros.

Prática: por que eliminar um dos pagamentos de R$ 30 faria o saldo parecer maior que o correto? Implementação e validação por IA, não comprovação de domínio pessoal.

## Limite exato do calendário local (20/11/2026)

Dois testes novos verificam os instantes imediatamente antes e depois da meia-noite em Manaus na virada de fevereiro para março: 03:59:59.999Z ainda pertence a fevereiro; 04:00:00.000Z já é março. O ano comum termina em 28/02 e o bissexto em 29/02. A suíte totaliza 40 testes.

Antes havia casos de fuso e bissexto separados; agora o limite exato é verificado junto, em processos isolados com `TZ=America/Manaus`. Isso protege o helper de uma troca acidental dos campos locais pelos campos UTC. Não verifica agrupamento de relatórios, gravação no Firestore ou a data escolhida na interface.

Exercício: explique por que dois instantes separados por um milissegundo podem pertencer a meses diferentes. UTC identifica o instante; o calendário local determina o dia naquele lugar. Implementação por IA, não comprovação de domínio pessoal.

## Exibição do saldo em centavos (21/11/2026)

Um teste de composição verifica que entradas de R$ 0,10 e R$ 0,20 aparecem como R$ 0,30 e, com uma saída de R$ 0,35, o saldo aparece como -R$ 0,05. O teste verifica o texto em reais; não garante aritmética decimal exata em `Number` nem valida valores digitados no formulário.

## Saldo após lançamentos que se compensam (22/11/2026)

Um par de entrada e saída de R$ 75 não apaga um saldo que já existia. O teste usa saldos iniciais fictícios de R$ 125 e −R$ 25 e verifica as duas ordens do par. O saldo do par é zero, mas o saldo final deve continuar igual ao anterior. São valores inteiros; o teste não demonstra precisão monetária para todos os decimais nem valida operações no Firebase.

## Efeito de uma nova saída nos filtros (23/11/2026)

Um teste compara a mesma carteira fictícia antes e depois de uma nova saída de R$ 40. O saldo geral cai de R$ 75 para R$ 35, e o saldo de saídas de −R$ 25 para −R$ 65. O subtotal das entradas continua em R$ 100. A comparação verifica o efeito da mudança nos utilitários, não na interface, em dados reais ou no Firebase.

## Contrato do filtro: listas independentes (24/11/2026)

O contrato descreve o que a função promete devolver a quem a chama. Duas chamadas de `filtrarTransacoes` recebem listas separadas: reordenar ou remover itens de uma delas não afeta a próxima chamada nem a lista de origem. Isso não significa copiar os objetos de cada transação: alterá-los diretamente não faz parte da garantia.

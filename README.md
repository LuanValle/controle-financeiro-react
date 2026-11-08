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
npm run build
npm run preview
```

`preview` serve o build localmente. Não substitui a configuração de hospedagem. Não há script de testes automatizados configurado no `package.json` atual.

## Segurança e dados

A consulta de transações utiliza o identificador do usuário autenticado. **Filtrar dados no cliente não garante autorização de acesso.** Leituras e escritas precisam ser protegidas pelas regras do Firestore, inclusive atualizações e exclusões por identificador.

As regras do Firestore e seus testes não estão versionados nesta árvore. Portanto, este repositório, sozinho, não permite verificar o isolamento entre contas no ambiente publicado. Use um projeto de desenvolvimento e dados fictícios até validar as regras e os fluxos.

## Limitações conhecidas e próximos passos

- Preservar a data original ao editar uma transação: o preenchimento do formulário de edição ainda precisa contemplar esse campo.
- Ajustar o planejamento à quantidade real de dias de cada mês; o cálculo atual usa 30 dias.
- Tornar a movimentação de reserva consistente: a atualização da reserva e o registro da transação são operações separadas.
- Propagar falhas ao salvar a reserva, para evitar indicar sucesso após um erro.
- Limpar dados de interface na troca de sessão e testar o isolamento entre contas.
- Adicionar testes de utilitários, operações financeiras e regras do Firestore.
- Adicionar filtro mensal aos relatórios por categoria.
- Validar os fluxos autenticados e as regras de acesso no ambiente de demonstração.

## Autor

[Luan Valle](https://github.com/LuanValle)

Projeto em evolução. As funcionalidades descritas devem ser avaliadas junto com as limitações e com o código da versão consultada.


import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularSaldo } from './calcularSaldo.js';
import { filtrarTransacoes } from './filtrarTransacoes.js';
import { formatarDinheiro } from './formatarDinheiro.js';

// Dados fictícios, valores inteiros: composição, não precisão monetária.
test('saldo geral coincide com entradas e saídas filtradas', () => {
  const dados = Object.freeze([
    Object.freeze({ tipo: 'entrada', valor: 120 }),
    Object.freeze({ tipo: 'saida', valor: 45 }),
    Object.freeze({ tipo: 'entrada', valor: 30 }),
    Object.freeze({ tipo: 'saida', valor: 15 }),
  ]);
  assert.equal(calcularSaldo(filtrarTransacoes(dados, 'todos')), 90);
  assert.equal(calcularSaldo(filtrarTransacoes(dados, 'entrada')), 150);
  assert.equal(calcularSaldo(filtrarTransacoes(dados, 'saida')), -60);
  assert.equal(calcularSaldo(dados),
    calcularSaldo(filtrarTransacoes(dados, 'entrada')) +
    calcularSaldo(filtrarTransacoes(dados, 'saida')));
});
test('filtro sem correspondências compõe com saldo zero', () => {
  assert.equal(calcularSaldo(filtrarTransacoes([
    { tipo: 'entrada', valor: 20 },
  ], 'saida')), 0);
});
test('entradas e saídas equivalentes se anulam após filtrar todos', () => {
  const dados = [{ tipo: 'entrada', valor: 75 }, { tipo: 'saida', valor: 75 }];
  assert.equal(calcularSaldo(filtrarTransacoes(dados, 'todos')), 0);
});

test('reordenar transações inteiras não altera os subtotais filtrados', () => {
  const dados = [
    { tipo: 'entrada', valor: 120 },
    { tipo: 'saida', valor: 45 },
    { tipo: 'entrada', valor: 30 },
    { tipo: 'saida', valor: 15 },
  ];
  const original = structuredClone(dados);
  for (const filtro of ['todos', 'entrada', 'saida']) {
    const esperado = calcularSaldo(filtrarTransacoes(dados, filtro));
    for (let i = 0; i < dados.length; i++) {
      const rotacao = [...dados.slice(i), ...dados.slice(0, i)];
      assert.equal(calcularSaldo(filtrarTransacoes(rotacao, filtro)), esperado);
      assert.equal(calcularSaldo(filtrarTransacoes([...rotacao].reverse(), filtro)), esperado);
    }
  }
  assert.deepEqual(dados, original);
});

test('repetir o mesmo filtro preserva itens, ordem e saldo', () => {
  const dados = [
    { tipo: 'saida', valor: 45 },
    { tipo: 'entrada', valor: 120 },
    { tipo: 'saida', valor: 15 },
  ];
  for (const filtro of ['todos', 'entrada', 'saida']) {
    const umaVez = filtrarTransacoes(dados, filtro);
    const duasVezes = filtrarTransacoes(umaVez, filtro);
    assert.deepEqual(duasVezes, umaVez);
    assert.equal(calcularSaldo(duasVezes), calcularSaldo(umaVez));
  }
});

test('lançamentos distintos de mesmo valor não desaparecem no filtro ou saldo', () => {
  const dados = Object.freeze([
    Object.freeze({ id: 'recebimento-1', tipo: 'entrada', valor: 100 }),
    Object.freeze({ id: 'recebimento-2', tipo: 'entrada', valor: 100 }),
    Object.freeze({ id: 'pagamento-1', tipo: 'saida', valor: 30 }),
    Object.freeze({ id: 'pagamento-2', tipo: 'saida', valor: 30 }),
  ]);
  const casos = [
    ['todos', ['recebimento-1', 'recebimento-2', 'pagamento-1', 'pagamento-2'], 140],
    ['entrada', ['recebimento-1', 'recebimento-2'], 200],
    ['saida', ['pagamento-1', 'pagamento-2'], -60],
  ];
  for (const [filtro, ids, saldo] of casos) {
    const resultado = filtrarTransacoes(dados, filtro);
    assert.deepEqual(resultado.map(item => item.id), ids);
    assert.equal(calcularSaldo(resultado), saldo);
  }
});

test('saldo com decimais mantém centavos e sinal no formato BRL', () => {
  const dados = [
    { tipo: 'entrada', valor: 0.10 },
    { tipo: 'entrada', valor: 0.20 },
    { tipo: 'saida', valor: 0.35 },
  ];
  const saldoEntradas = calcularSaldo(filtrarTransacoes(dados, 'entrada'));
  const saldoGeral = calcularSaldo(filtrarTransacoes(dados, 'todos'));
  // Number aproxima esses decimais; aqui verificamos o texto apresentado.
  assert.equal(formatarDinheiro(saldoEntradas), 'R$\u00a00,30');
  assert.equal(formatarDinheiro(saldoGeral), '-R$\u00a00,05');
});

test('uma saída adicional muda apenas os saldos geral e de saídas', () => {
  const antes = [
    { tipo: 'entrada', valor: 100 },
    { tipo: 'saida', valor: 25 },
  ];
  const depois = [...antes, { tipo: 'saida', valor: 40 }];
  const saldoPorFiltro = (lista, filtro) => calcularSaldo(filtrarTransacoes(lista, filtro));

  for (const [filtro, inicial, final] of [
    ['todos', 75, 35],
    ['entrada', 100, 100],
    ['saida', -25, -65],
  ]) {
    assert.equal(saldoPorFiltro(antes, filtro), inicial, filtro);
    assert.equal(saldoPorFiltro(depois, filtro), final, filtro);
  }
});

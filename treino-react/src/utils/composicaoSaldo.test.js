import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularSaldo } from './calcularSaldo.js';
import { filtrarTransacoes } from './filtrarTransacoes.js';

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

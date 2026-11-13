import test from 'node:test';
import assert from 'node:assert/strict';
import { obterCategoriaPadrao } from './obterCategoriaPadrao.js';

test('entrada recebe a categoria padrão Salário', () => {
  assert.equal(obterCategoriaPadrao('entrada'), 'Salário');
});

test('saída recebe a categoria padrão Alimentação', () => {
  assert.equal(obterCategoriaPadrao('saida'), 'Alimentação');
});

test('tipo desconhecido também recebe Alimentação: o helper não valida tipos', () => {
  assert.equal(obterCategoriaPadrao('desconhecido'), 'Alimentação');
  assert.equal(obterCategoriaPadrao(undefined), 'Alimentação');
});

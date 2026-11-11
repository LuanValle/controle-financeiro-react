import assert from 'node:assert/strict';
import test from 'node:test';
import { filtrarTransacoes } from './filtrarTransacoes.js';

const transacoes = Object.freeze([
    Object.freeze({ id: 'saida-1', tipo: 'saida', valor: 25 }),
    Object.freeze({ id: 'entrada-1', tipo: 'entrada', valor: 100 }),
    Object.freeze({ id: 'saida-2', tipo: 'saida', valor: 10 }),
    Object.freeze({ id: 'entrada-2', tipo: 'entrada', valor: 50 }),
]);

test('filtro todos retorna todos os itens na ordem original', () => {
    assert.deepEqual(filtrarTransacoes(transacoes, 'todos'), transacoes);
});

test('filtro entrada retorna somente entradas na ordem original', () => {
    assert.deepEqual(filtrarTransacoes(transacoes, 'entrada'), [
        transacoes[1], transacoes[3],
    ]);
});

test('filtro saida retorna somente saídas na ordem original', () => {
    assert.deepEqual(filtrarTransacoes(transacoes, 'saida'), [
        transacoes[0], transacoes[2],
    ]);
});

test('lista vazia permanece vazia em todos os filtros suportados', () => {
    for (const filtro of ['todos', 'entrada', 'saida']) {
        assert.deepEqual(filtrarTransacoes([], filtro), []);
    }
});

test('filtro sem correspondências retorna uma lista vazia', () => {
    assert.deepEqual(filtrarTransacoes([transacoes[0]], 'entrada'), []);
    assert.deepEqual(filtrarTransacoes([transacoes[1]], 'saida'), []);
});

test('remover um item do resultado não altera a lista original', () => {
    const resultado = filtrarTransacoes(transacoes, 'todos');

    assert.notEqual(resultado, transacoes);
    resultado.pop();
    assert.equal(resultado.length, 3);
    assert.equal(transacoes.length, 4);
});

test('alternar filtros não altera a lista nem os objetos recebidos', () => {
    for (const filtro of ['entrada', 'saida', 'todos', 'entrada']) {
        filtrarTransacoes(transacoes, filtro);
    }

    assert.deepEqual(transacoes, [
        { id: 'saida-1', tipo: 'saida', valor: 25 },
        { id: 'entrada-1', tipo: 'entrada', valor: 100 },
        { id: 'saida-2', tipo: 'saida', valor: 10 },
        { id: 'entrada-2', tipo: 'entrada', valor: 50 },
    ]);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { calcularSaldo } from './calcularSaldo.js';

test('saldo de uma lista vazia é zero', () => {
    assert.equal(calcularSaldo([]), 0);
});

test('saldo soma todas as entradas', () => {
    assert.equal(calcularSaldo([
        { tipo: 'entrada', valor: 100 },
        { tipo: 'entrada', valor: 50 },
    ]), 150);
});

test('saldo subtrai todas as saídas e pode ficar negativo', () => {
    assert.equal(calcularSaldo([
        { tipo: 'saida', valor: 25 },
        { tipo: 'saida', valor: 40 },
    ]), -65);
});

test('saldo combina entradas e saídas sem depender da ordem', () => {
    const transacoes = [
        { tipo: 'entrada', valor: 200 },
        { tipo: 'saida', valor: 60 },
        { tipo: 'entrada', valor: 20 },
        { tipo: 'saida', valor: 10 },
    ];

    assert.equal(calcularSaldo(transacoes), 150);
    assert.equal(calcularSaldo([...transacoes].reverse()), 150);
});

test('saldo preserva centavos nos valores do cenário', () => {
    assert.equal(calcularSaldo([
        { tipo: 'entrada', valor: 100.50 },
        { tipo: 'saida', valor: 40.25 },
    ]), 60.25);
});

test('valores zero não alteram o saldo', () => {
    assert.equal(calcularSaldo([
        { tipo: 'entrada', valor: 50 },
        { tipo: 'entrada', valor: 0 },
        { tipo: 'saida', valor: 0 },
    ]), 50);
});

test('cálculo não altera a lista nem os objetos recebidos', () => {
    const transacoes = Object.freeze([
        Object.freeze({ id: 'entrada-ficticia', tipo: 'entrada', valor: 80 }),
        Object.freeze({ id: 'saida-ficticia', tipo: 'saida', valor: 30 }),
    ]);

    assert.equal(calcularSaldo(transacoes), 50);
    assert.deepEqual(transacoes, [
        { id: 'entrada-ficticia', tipo: 'entrada', valor: 80 },
        { id: 'saida-ficticia', tipo: 'saida', valor: 30 },
    ]);
});

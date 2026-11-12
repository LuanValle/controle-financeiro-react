import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { env, execPath } from 'node:process';
import { criarDadosData } from './criarDadosData.js';

test('data mantém o instante ISO e os campos do calendário local', () => {
    const data = new Date(2026, 10, 12, 12, 30);
    assert.deepEqual(criarDadosData(data), {
        data: data.toISOString(), dia: 12, mes: 11, ano: 2026,
    });
});

test('janeiro e dezembro usam meses de 1 a 12', () => {
    for (const mes of [0, 11]) {
        assert.equal(criarDadosData(new Date(2026, mes, 1, 12)).mes, mes + 1);
    }
});

test('data preserva 29 de fevereiro em ano bissexto', () => {
    const resultado = criarDadosData(new Date(2024, 1, 29, 12));
    assert.equal(resultado.dia, 29);
    assert.equal(resultado.mes, 2);
    assert.equal(resultado.ano, 2024);
});

test('extração não modifica o objeto Date recebido', () => {
    const data = new Date('2026-11-12T02:30:00.000Z');
    const antes = data.getTime();
    criarDadosData(data);
    assert.equal(data.getTime(), antes);
});

test('data inválida mantém o erro atual, sem produzir registro parcial', () => {
    assert.throws(() => criarDadosData(new Date(NaN)), RangeError);
});

for (const [tz, dia, mes, ano] of [
    ['UTC', 1, 1, 2026],
    ['America/Manaus', 31, 12, 2025],
]) {
    test(`virada de ano distingue instante UTC e calendário em ${tz}`, () => {
        const modulo = new URL('./criarDadosData.js', import.meta.url).href;
        const codigo = `import { criarDadosData } from ${JSON.stringify(modulo)};
            console.log(JSON.stringify(criarDadosData(new Date('2026-01-01T02:30:00.000Z'))));`;
        const saida = execFileSync(execPath, ['--input-type=module', '-e', codigo], {
            env: { ...env, TZ: tz }, encoding: 'utf8',
        });
        assert.deepEqual(JSON.parse(saida), {
            data: '2026-01-01T02:30:00.000Z', dia, mes, ano,
        });
    });
}

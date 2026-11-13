import test from 'node:test';
import assert from 'node:assert/strict';
import { formatarDinheiro } from './formatarDinheiro.js';

// Intl's Brazilian currency format uses a non-breaking space after R$.
const espacoInquebravel = '\u00a0';

for (const [nome, valor, esperado] of [
  ['zero', 0, `R$${espacoInquebravel}0,00`],
  ['inteiro com duas casas', 42, `R$${espacoInquebravel}42,00`],
  ['centavos', 0.25, `R$${espacoInquebravel}0,25`],
  ['separador de milhar', 1234.56, `R$${espacoInquebravel}1.234,56`],
  ['saldo negativo', -1234.56, `-R$${espacoInquebravel}1.234,56`],
  ['arredondamento apenas da apresentação', 12.345, `R$${espacoInquebravel}12,35`],
  ['texto numérico com ponto decimal', '1234.56', `R$${espacoInquebravel}1.234,56`],
]) {
  test(`formatarDinheiro: ${nome}`, () => {
    assert.equal(formatarDinheiro(valor), esperado);
  });
}

test('formatarDinheiro não interpreta vírgula como separador decimal de entrada', () => {
  // Documenta o limite atual: formatar não substitui validar/converter formulário.
  assert.equal(formatarDinheiro('12,34'), `R$${espacoInquebravel}NaN`);
});

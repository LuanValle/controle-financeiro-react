export function calcularSaldo(transacoes){
    return transacoes
    .reduce((acc, transacao) => {
        if(transacao.tipo === "entrada"){
            return acc + transacao.valor;
        }
        return acc - transacao.valor;
    }, 0);
}
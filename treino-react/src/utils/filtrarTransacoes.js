export function filtrarTransacoes(transacoes, filtro){
    return transacoes
    .filter((transacao)=>{
        if(filtro === 'todos'){
            return true;
        }

        return transacao.tipo === filtro;
    })
}
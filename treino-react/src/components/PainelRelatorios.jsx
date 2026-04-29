import "./PainelRelatorios.css";

function PainelRelatorios({
    transacoes,
    formatarDinheiro

})
{
    //funçao para calcular o total gasto em uma categoria, recebe o nome da categoria e retorna o total gasto nessa categoria
    function calcularTotalPorCategoria(categoria){
    return transacoes
    .filter(t => t.categoria === categoria)
    .reduce((acumulador, t) => acumulador + t.valor, 0)
    }

    //cria uma lista de categorias unicas a partir das transaçoes, usando o set para garantir que sejam unicas e o filter para remover categorias vazias ou nulas
    const categoriasUnicas = [...new Set(
        transacoes
        .filter(t => t.tipo === 'saida')
        .map(t=> t.categoria)
        .filter(cat => cat !== undefined && cat !== null && cat !== '')
    )];

    const totalGeralSaidas = transacoes
    .filter(t => t.tipo === 'saida')
    .reduce((acumulador, t)=> acumulador + Number(t.valor), 0)
    
    return(
        <div className="painel-relatorios">
            <h2 className="titulo-relatorio">Resumo por Categoria</h2>

            <div className="lista-resumo">
            {categoriasUnicas.map(categoria => {
                const total = calcularTotalPorCategoria(categoria);
                return (
                    <div key={categoria} className="resumo-categoria">
                        <span className="resumo-nome">{categoria}</span>
                        <span className="resumo-valor">{formatarDinheiro(total)}</span>
                    </div>
                )
            })}
            </div>
            <div className="resumo-total">
                <span className="resumo-total-label">Total Geral de Gastos</span>
                <span className="resumo-total-valor">{formatarDinheiro(totalGeralSaidas)}</span>
            </div>
        </div>
    )
}
export default PainelRelatorios;
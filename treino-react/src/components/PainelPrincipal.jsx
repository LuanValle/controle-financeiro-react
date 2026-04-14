function PainelPrincipal({
    novaDescricao, setNovaDescricao,
    novoValor, setNovoValor,
    novaCategoria, setNovaCategoria,
    novaData, setNovaData,
    novoTipo, setNovoTipo,
    filtro, setFiltro,
    transacoes, transacoesFiltradas,
    formatarDinheiro, excluirTransacao,
    adicionarTransacao,
    carregando

}) {
    return (
        <div>
            <h3>Adicionar Transação</h3>
            <div className="painel-formulario">
                <input type="text" placeholder='Descrição' className='campo-entrada' value={novaDescricao} onChange={(evento) => setNovaDescricao(evento.target.value)} />

                <input type="number"
                    placeholder='valor'
                    className='campo-entrada'
                    value={novoValor}
                    onChange={(evento) => setNovoValor(evento.target.value)} />

                <select name="tipo" id="tipo" className='campo-entrada' value={novoTipo} onChange={(evento) => setNovoTipo(evento.target.value)} >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                </select>

                <button className='btn-adicionar' onClick={adicionarTransacao} disabled={carregando}>{carregando ? 'Salvando...' : 'Adicionar'}</button>
            </div>

            {/* Filtro de transações */}
            <div className='painel-filtros'>
                <button
                    className={filtro === 'todos' ? 'btn-filtro btn-filtro-ativo' : 'btn-filtro'} onClick={() => setFiltro('todos')}>Todos</button>
                <button className={filtro === 'entrada' ? 'btn-filtro btn-filtro-ativo' : 'btn-filtro'} onClick={() => setFiltro('entrada')}>Entradas</button>
                <button className={filtro === 'saida' ? 'btn-filtro btn-filtro-ativo' : 'btn-filtro'} onClick={() => setFiltro('saida')}>Saídas</button>
            </div>

            {/* Lista de transações */}
            {transacoes.length === 0 && (
                <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>
                    <p>Nenhuma transação encontrada.</p>
                </div>
            )}

            {/* O map percorre a lista de transaçoes e para cada transaçao ele cria um item de lista (li) com a descricao, valor e tipo da transaçao */}
            <ul className='lista-transacoes'>
                {transacoesFiltradas.map(transacao => (
                    <li key={transacao.id} className='transacao-item'
                        style={{
                            backgroundColor: transacao.tipo === 'entrada' ? '#dcfce7' : '#fee2e2'
                        }}>
                        <div className="transacao-info">
                            <span className="transacao-descricao">{transacao.descricao}</span>
                            <span className="transacao-valor">{formatarDinheiro(transacao.valor)}</span>
                        </div>
                        <button className='btn-excluir' onClick={() => excluirTransacao(transacao.id)} >x</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
{/* Fim da Tela do Controle Financeiro */ }

export default PainelPrincipal;
function PainelPrincipal({
    novaDescricao, setNovaDescricao,
    novoValor, setNovoValor,
    novoTipo, setNovoTipo,
    filtro, setFiltro,
    transacoes, transacoesFiltradas,
    formatarDinheiro, excluirTransacao,
    adicionarTransacao,
    carregando, setModalAberto,
    modalAberto, 
    novaCategoria, setNovaCategoria,
    iniciarEdicao, transacaoEmEdicao,
    prepararNovaTransacao, novaData, setNovaData


}) {
    return (
        <div>
            <button className='btn-adicionar btn-nova-transacao' onClick={() => prepararNovaTransacao()}>Nova transação</button>

            {modalAberto && (
            <div className="modal-overlay" onClick={() => setModalAberto(false)}>
                <div className="modal-content" onClick={(evento) => evento.stopPropagation()}>
                <h3 className="modal-titulo">{transacaoEmEdicao == null ? 'Adicionar' : 'Editar'} Transação</h3>

                {/* Campo de descriçao */}
                <input type="text" placeholder='Descrição' className='campo-entrada' value={novaDescricao} onChange={(evento) => setNovaDescricao(evento.target.value)} />

                {/* Campo de data */}
                <label className="modal-label">Data da Transação</label>
                <input type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="input-custom"/>

                {/* Campo de tipo */}
                <select name="tipo" id="tipo" className='campo-entrada' value={novoTipo} onChange={(evento) => setNovoTipo(evento.target.value)} >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                </select>


                {/* Campo de categoria */}
                <select className='campo-entrada' value={novaCategoria} onChange={(evento) => setNovaCategoria(evento.target.value)}>
                    {novoTipo === 'entrada' ? (
                        <>
                            <option value="Salário">Salário</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investimentos">Investimentos</option>
                            <option value="Presente">Presente</option>
                            <option value="Cobrancas">Cobranças</option>
                        </>
                    ) : (
                        <>
                            <option value="estudo">Estudo</option>
                            <option value="Alimentação">Alimentação</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Saúde">Saúde</option>
                            <option value="Lazer">Lazer</option>
                            <option value="diário">Diário</option>
                        </>
                    )}
                    <option value="Outros">Outros</option>
                </select>

                {/* Campo de valor */}
                <input type="number"
                    placeholder='valor'
                    className='campo-entrada'
                    value={novoValor}
                    onChange={(evento) => setNovoValor(evento.target.value)} />

                
                {/* Açoes do modal */}
                <div className="modal-acoes">
                    <button className='btn-filtro' onClick={() => setModalAberto(false)}>Cancelar</button>
                    <button className='btn-adicionar' onClick={adicionarTransacao} disabled={carregando}>{carregando ? 'Salvando...' : 'Adicionar'}</button>
                </div>
                </div>
            </div>
            )}
            

            {/* Filtro de transações */}
            <div className='painel-filtros'>
                <button className={filtro === 'todos' ? 'btn-filtro btn-filtro-ativo' : 'btn-filtro'} onClick={() => setFiltro('todos')}>Todos</button>
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

                        {/*area que mostra as informaçoes da transaçao */}
                        <div className="transacao-info">
                            <span className="transacao-descricao">{transacao.descricao}</span>
                            <span className={transacao.tipo === 'entrada' ? 'transacao-valor transacao-valor-entrada' : 'transacao-valor transacao-valor-saida'}>{formatarDinheiro(transacao.valor)}</span>
                            <span className="transacao-categoria">{transacao.categoria || 'Sem categoria'}</span>
                            <span className="transacao-data">📅 {transacao.criadoEm 
                                    ? transacao.criadoEm.toDate().toLocaleDateString('pt-BR')
                                    : "Sincronizando..."
                                    }</span>
                        </div>
                        <div className="transacao-acoes">
                            <button type="button" className="btn-editar" onClick={() => iniciarEdicao(transacao)} aria-label="Editar transacao">✏️</button>
                            <button type="button" className="btn-excluir" onClick={() => excluirTransacao(transacao.id)} aria-label="Excluir transacao">✕</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
{/* Fim da Tela do Controle Financeiro */ }

export default PainelPrincipal;
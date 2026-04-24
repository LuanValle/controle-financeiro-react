import { useState } from "react";
import "./PainelPlanejamento.css";

export default function PainelPlanejamento({
    transacoes, formatarDinheiro,
    saldoReal
}) {

    const [mesVisualizado, setMesVisualizado] = useState(new Date().getMonth() + 1); //inicia mostrando o mes atual
    const [anoVisualizado, setAnoVisualizado] = useState(new Date().getFullYear()); //inicia mostrando o ano atual

    //funçao para voltar o mes
    const mesAnterior = () => {
        if(mesVisualizado === 1) {
            setMesVisualizado(12);
            setAnoVisualizado(anoVisualizado - 1);
        } else {
            setMesVisualizado(mesVisualizado - 1);
        }
    }

    //funçao para avançar o mes
    const proximoMes = () => {
        if(mesVisualizado === 12) {
            setMesVisualizado(1);
            setAnoVisualizado(anoVisualizado + 1);
        } else {
            setMesVisualizado(mesVisualizado + 1);
        }
    }


    //filtra as transaçoes para mostrar apenas as do mes e ano selecionados
    const transacoesDoMes = transacoes.filter(t => t.mes === mesVisualizado && t.ano === anoVisualizado);


    const orcamento = saldoReal;

    const diasDoMes = Array.from({ length: 30 }, (_, index) => index + 1)
    const orcamentoDiario = orcamento / 30;

    //pega a data atual para destacar o dia atual na tabela
    const hoje = new Date();
    const diaHoje = hoje.getDate();
    const mesHoje = hoje.getMonth() + 1;
    const anoHoje = hoje.getFullYear();

    return (
        <section className="painel-planejamento">
            <h1 className="planejamento-titulo">Painel de Planejamento Financeiro</h1>
            <p className="planejamento-subtitulo">Aqui você pode planejar suas finanças, criar orçamentos e definir metas financeiras.</p>

            {/* Navegaçao entre meses */}
            <div className="planejamento-navegacao">
                <button onClick={mesAnterior} className="btn-navegacao">{"<"}</button>
                <h2 className="mes-atual">
                    {new Date(anoVisualizado, mesVisualizado - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={proximoMes} className="btn-navegacao">{">"}</button>
            </div>

            <div className="planejamento-tabela-wrapper">
                <table className="planejamento-tabela">
                    <thead>
                        <tr>
                            <th>Dia</th>
                            <th>Entradas</th>
                            <th>Saidas</th>
                            <th>Gasto diário</th>
                            <th>Meta diária</th>
                            <th>Saldo disponível</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diasDoMes.map((dia) => {

                            // filtra apenas transacoes da categoria diario.
                            const transacoesDoDia = transacoesDoMes.filter((t) => t.dia === dia && t.categoria === "diário");

                            const transacoesAcumuladas = transacoesDoMes.filter((t) => t.dia <= dia && t.categoria === "diário");
                            const gastoAcumulado = transacoesAcumuladas.reduce((soma, t) => soma + t.valor, 0);

                            // soma o que tiver em categoria diario no dia.
                            const gastoTotalDoDia = transacoesDoDia.reduce((soma, t) => soma + t.valor, 0);
                            const saldoDisponivel = orcamento - gastoAcumulado;

                            const diasRestantes = (30 - dia) + 1;
                            const metaReal = saldoDisponivel / diasRestantes;

                            const diaHoje = new Date().getDate();

                            //filtra todas as entradas do dia
                            const entradasDoDia = transacoesDoMes.filter(t => t.dia === dia && t.tipo === 'entrada');
                            const totalEntradas = entradasDoDia.reduce((soma, t) => soma + t.valor, 0);

                            //filtra todas as saidas do dia
                            const saidasDoDia = transacoesDoMes.filter(t => 
                                t.dia === dia &&
                                t.tipo === 'saida' &&
                                t.categoria !== 'diário'
                            );
                            const totalSaidas = saidasDoDia.reduce((soma, t) => soma + t.valor, 0);

                            //detalhes das saidas do dia
                            const detalhesSaidas = saidasDoDia.length > 0 
                            ? saidasDoDia.map(t => `${t.descricao}: ${formatarDinheiro(t.valor)}`).join('\n')
                            : 'Sem saídas';

                            //detalhes das entradas do dia
                            const detalhesEntradas = entradasDoDia.length > 0
                            ? entradasDoDia.map(t => `${t.descricao}: ${formatarDinheiro(t.valor)}`).join('\n')
                            : 'Sem entradas';

                            //verifica se o dia da linha é o dia atual para destacar a linha
                            const eHoje = dia === diaHoje && mesVisualizado === mesHoje && anoVisualizado === anoHoje;

                            return (
                                <tr key={dia} className={eHoje ? "linha-hoje" : ''}>

                                    {/*coluna dos dias */}
                                    <td>{dia}</td>

                                    {/*coluna das entradas do dia */}
                                    <td title={detalhesEntradas}>{formatarDinheiro(totalEntradas)}</td>

                                    {/*coluna das saidas do dia */}
                                    <td title={detalhesSaidas}>{formatarDinheiro(totalSaidas)}</td>

                                    {/*coluna do gasto real do dia, soma de todas as saidas do dia */}
                                    <td className={gastoTotalDoDia > metaReal ? "gasto-alto" : "gasto-baixo"}>{formatarDinheiro(gastoTotalDoDia)}</td>

                                    {/*coluna da meta real do dia, que é o saldo disponivel dividido pelos dias restantes */}
                                    <td>{formatarDinheiro(metaReal)}</td>

                                    {/*coluna do saldo disponivel, que é o orcamento menos o gasto acumulado */}
                                    <td className={saldoDisponivel >= 0 ? "saldo-positivo" : "saldo-negativo"}>{formatarDinheiro(saldoDisponivel)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>

    )
} 
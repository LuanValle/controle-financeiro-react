import { useState } from "react";
import "./PainelPlanejamento.css";

export default function PainelPlanejamento({
    transacoes, formatarDinheiro
}) {

    const [orcamento, setOrcamento] = useState(1000);

    const diasDoMes = Array.from({ length: 30 }, (_, index) => index + 1)
    const orcamentoDiario = orcamento / 30;

    return (
        <section className="painel-planejamento">
            <h1 className="planejamento-titulo">Painel de Planejamento Financeiro</h1>
            <p className="planejamento-subtitulo">Aqui você pode planejar suas finanças, criar orçamentos e definir metas financeiras.</p>

            <div className="planejamento-controles">
                <label htmlFor="orcamentoMensal" className="planejamento-label">Orçamento mensal</label>
                <input
                    id="orcamentoMensal"
                    type="number"
                    min="0"
                    value={orcamento}
                    onChange={(e) => setOrcamento(Number(e.target.value) || '')}
                />
            </div>

            <div className="planejamento-tabela-wrapper">
                <table className="planejamento-tabela">
                    <thead>
                        <tr>
                            <th>Dia</th>
                            <th>Gasto real</th>
                            <th>Meta diária</th>
                            <th>Saldo disponível</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diasDoMes.map((dia) => {

                            // filtra apenas transacoes da categoria diario.
                            const transacoesDoDia = transacoes.filter((t) => t.dia === dia && t.categoria === "diário");

                            const transacoesAcumuladas = transacoes.filter((t) => t.dia <= dia && t.categoria === "diário");
                            const gastoAcumulado = transacoesAcumuladas.reduce((soma, t) => soma + t.valor, 0);

                            // soma o que tiver em categoria diario no dia.
                            const gastoTotalDoDia = transacoesDoDia.reduce((soma, t) => soma + t.valor, 0);
                            const saldoDisponivel = orcamento - gastoAcumulado;

                            const diasRestantes = (30 - dia) + 1;
                            const metaReal = saldoDisponivel / diasRestantes;

                            const diaHoje = new Date().getDate();

                            return (
                                <tr key={dia} className={diaHoje === dia ? "linha-hoje" : ''}>
                                    <td>{dia}</td>
                                    <td>{formatarDinheiro(gastoTotalDoDia)}</td>
                                    <td>{formatarDinheiro(metaReal)}</td>
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
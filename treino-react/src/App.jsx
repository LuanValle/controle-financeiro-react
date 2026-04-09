import { use, useState } from 'react'
import { useEffect } from 'react'
import PainelReserva from './components/PainelReserva'
import PainelPrincipal from './components/PainelPrincipal'
import './App.css'

function App() {
  //useStats
  const [transacoes, setTransacoes] = useState(() => {
    const dinheiroNoCofre = localStorage.getItem('transacoes') //pega as transaçoes salvas no localstorage, se tiver alguma coisa salva, ele retorna a string, se nao tiver nada, ele retorna null
    if (dinheiroNoCofre) {//verifica se tem coisas salvas no localstorage
      return JSON.parse(dinheiroNoCofre) //converte a string de volta para um array de objetos
    }
    else {
      return [] //se nao tiver nada salvo, retorna um array vazio
    }
  })

  const [reserva, setReserva] = useState(() => { //criando a conta de reserva de emergencia.
    const reservaGuardada = localStorage.getItem('reserva_emergencia')//tentar pegar o que esta salvo no navegador com o nome 'reserva_emergencia'
    if (reservaGuardada) {
      return Number(reservaGuardada) //se tiver algo salvo, converte para numero e retorna o valor
    }
    else {
      return 0 //se nao tiver nada salvo, retorna zero como valor inicial da reserva
    }
  })

  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novoTipo, setNovoTipo] = useState('entrada');//ja começa com 'entrada' para vir como padrao essa opçao.
  const [filtro, setFiltro] = useState('todos')//filtro para mostrar todas as transaçoes, ou somente as de entrada ou somente as de saida
  const [valorInputReserva, setValorInputReserva] = useState('') //controla o que esta sendo digitado no campo da reserva.
  const [telaAtual, setTelaAtual] = useState('principal')//variavel para controlar qual tela esta sendo exibida, se a tela de controle ou a tela de relatorios


  //calcular o saldo total
  const resultadoSaldo = transacoes.reduce((acc, transacao) => {
    if (transacao.tipo === 'entrada') {
      return acc + transacao.valor
    } else {
      return acc - transacao.valor
    }
  }, 0)// serve para dizer que o reduce deve começar em zero, se nao ele da erro.

  //cor inteligente para o resultado do saldo, for + verde, for - vermelho
  const corSaldo = resultadoSaldo >= 0 ? '#22c55e' : '#ef4444'

  //filtro para mostrar somente as transaçoes de entrada, ou somente as de saida, ou todas as transaçoes
  const transacoesFiltradas = transacoes.filter(transacao => {
    if (filtro === 'todos') {
      return true //mostra todas as transaçoes
    } else {
      return transacao.tipo === filtro //mostra somente as transaçoes do tipo selecionado no filtro
    }
  })

  //funçao para adicionar valores
  function adicionarTransacao() {
    const novaTransacao = { //caixa da nova transaçao
      id: Date.now(), //gera um id unico baseado no tempo atual
      descricao: novaDescricao,
      valor: Number(novoValor), //garante que o valor seja um numero
      tipo: novoTipo
    }

    setTransacoes([...transacoes, novaTransacao]) //adiciona a nova transaçao a lista de transaçoes
    setNovaDescricao('') //limpa o campo de descricao
    setNovoValor('') //limpa o campo de valor
    setNovoTipo('entrada') //reseta o tipo para 'entrada'

    //se o valor for igual a zero, nao entra na lista de transaçoes, entao nao tem

  }

  //funçao para excluir transaçoes
  function excluirTransacao(idClicado) {
    setTransacoes(transacoes.filter((transacao) => {
      return transacao.id !== idClicado
    }))
  }

  //funçao para guardar na reserva de emergencia, toda vez que o valor da reserva mudar, ele salva o novo valor no localstorage
  function guardarReserva() {
    const valorDigitado = Number(valorInputReserva) //converte o valor digitado para numero
    if (valorDigitado > 0 && valorDigitado <= resultadoSaldo) { //verifica se o valor digitado é maior que zero e menor ou igual ao saldo total
      setReserva(reserva + valorDigitado) // pega o valor atual do cofre e soma com o que foi digitado

      //toda vez que guardar o valor, ele vai fazer uma transaçao de saida para o valor guardado.
      const transacaoTranferencia = {
        id: Date.now(),
        descricao: 'Aporte na reserva de Emergência',
        valor: valorDigitado,
        tipo: 'saida'
      }

      setTransacoes([...transacoes, transacaoTranferencia]) //adiciona a transaçao de saida do valor guardado na reserva

      setValorInputReserva('') //limpa o campo de entrada da reserva
    }
    else {
      alert('Valor inválido para guardar na reserva. Verifique se o valor é positivo e não excede o saldo total.')
      setValorInputReserva('') //limpa o campo de entrada da reserva caso o valor seja inválido
    }
  }

  //funçao para retirar dinheiro da reserva de emergencia, toda vez que o valor da reserva mudar, ele salva o novo valor no localstorage
  function resgatarReserva() {
    const valorDigitado = Number(valorInputReserva) //converte o valor digitado para numero
    if (valorDigitado > 0 && valorDigitado <= reserva) {
      setReserva(reserva - valorDigitado) // pega o valor atual do cofre e subtrai com o que foi digitado

      //toda vez que resgatar o valor, ele vai fazer uma transaçao de entrada para o valor resgatado.
      const transacaoTranferencia = {
        id: Date.now(),
        descricao: 'Resgate da reserva de Emergência',
        valor: valorDigitado,
        tipo: 'entrada'
      }

      setTransacoes([...transacoes, transacaoTranferencia]) //adiciona a transaçao de entrada do valor resgatado da reserva

      setValorInputReserva('') //limpa o campo de entrada da reserva
    }
    else {
      alert('Valor inválido para resgatar da reserva. Verifique se o valor é positivo e não excede o valor disponível na reserva.')
      setValorInputReserva('') //limpa o campo de entrada da reserva caso o valor seja inválido
    }
  }

  //salvar dados no localstorage
  useEffect(() => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes))//salva as transaçoes no localstorage como string
  }, [transacoes])//o useEffect é executado toda vez que a lista de transaçoes muda

  //sentinela da reserva de emergencia. Toda vez que a reserva mudar, ele salva o novo valor no localstorage
  useEffect(() => {
    localStorage.setItem('reserva_emergencia', reserva.toString()) //salva o valor da reserva no localstorage como string
  }, [reserva])//o useEffect é executado toda vez que o valor da reserva mudar

  //funçao para transformar numeros puro em Reais(R$)
  function formatarDinheiro(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }


  return (
    <div className="App">
      <h1>Meu Controle Financeiro</h1>

      {/*Menu de Navegação*/}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <button
          className={telaAtual === 'principal' ? 'btn-filtro btn-filtro-ativo' : 'btn-filtro'}
          onClick={() => setTelaAtual('principal')}
        >
          Dia a Dia
        </button>

        <button
          className={telaAtual === 'reserva' ? 'btn-filtro btn-filtro-ativo' : 'btn-filtro'}
          onClick={() => setTelaAtual('reserva')}
        >
          Reserva de Emergência
        </button>

      </div>

      <h2 style={{ color: corSaldo }}>Saldo Total: {formatarDinheiro(resultadoSaldo)}</h2>

      {/*Tela da Reserva de Emergência*/}
      {telaAtual === 'reserva' && (
        <PainelReserva
          reserva={reserva}
          formatarDinheiro={formatarDinheiro}
          valorInputReserva={valorInputReserva}
          setValorInputReserva={setValorInputReserva}
          guardarReserva={guardarReserva}
          resgatarReserva={resgatarReserva}
        />
      )}

      {/*Tela do Controle Financeiro*/}
      {telaAtual === 'principal' && (
        <PainelPrincipal
          novaDescricao={novaDescricao}
          setNovaDescricao={setNovaDescricao}
          novoValor={novoValor}
          setNovoValor={setNovoValor}
          novoTipo={novoTipo}
          setNovoTipo={setNovoTipo}
          adicionarTransacao={adicionarTransacao}
          transacoes={transacoes}
          filtro={filtro}
          setFiltro={setFiltro}
          transacoesFiltradas={transacoesFiltradas}
          excluirTransacao={excluirTransacao}
          formatarDinheiro={formatarDinheiro}
        />
      )}
    </div >

  )
}

export default App

  import { use, useState } from 'react'
  import { useEffect } from 'react';
  import './App.css'

  function App() {
    //useStats
    const [transacoes, setTransacoes] = useState(() => {
      const dinheiroNoCofre = localStorage.getItem('transacoes') //pega as transaçoes salvas no localstorage, se tiver alguma coisa salva, ele retorna a string, se nao tiver nada, ele retorna null
      if(dinheiroNoCofre){//verifica se tem coisas salvas no localstorage
        return JSON.parse(dinheiroNoCofre) //converte a string de volta para um array de objetos
      }
      else{
        return [] //se nao tiver nada salvo, retorna um array vazio
      }
    })

    const [reserva, setReserva] = useState(() => { //criando a conta de reserva de emergencia.
      const reservaGuardada = localStorage.getItem('reserva_emergencia')//tentar pegar o que esta salvo no navegador com o nome 'reserva_emergencia'
      if(reservaGuardada){
        return Number(reservaGuardada) //se tiver algo salvo, converte para numero e retorna o valor
      }
      else{
        return 0 //se nao tiver nada salvo, retorna zero como valor inicial da reserva
      }
    })

    const [novaDescricao, setNovaDescricao] = useState('');
    const [novoValor, setNovoValor] = useState('');
    const [novoTipo, setNovoTipo] = useState('entrada');//ja começa com 'entrada' para vir como padrao essa opçao.
    const [filtro, setFiltro] = useState('todos')//filtro para mostrar todas as transaçoes, ou somente as de entrada ou somente as de saida
    const [valorInputReserva, setValorInputReserva] = useState('') //controla o que esta sendo digitado no campo da reserva.
    const [telaAtual, setTelaAtual] = useState('controle')//variavel para controlar qual tela esta sendo exibida, se a tela de controle ou a tela de relatorios
    

    //calcular o saldo total
    const resultadoSaldo = transacoes.reduce((acc, transacao) => {
      if(transacao.tipo === 'entrada'){
        return acc + transacao.valor
      }else{
        return acc - transacao.valor
      }
    }, 0)// serve para dizer que o reduce deve começar em zero, se nao ele da erro.

    //cor inteligente para o resultado do saldo, for + verde, for - vermelho
    const corSaldo = resultadoSaldo >= 0 ? '#22c55e' : '#ef4444'

    //filtro para mostrar somente as transaçoes de entrada, ou somente as de saida, ou todas as transaçoes
    const transacoesFiltradas = transacoes.filter(transacao => {
      if(filtro === 'todos'){
        return true //mostra todas as transaçoes
      }else{
        return transacao.tipo === filtro //mostra somente as transaçoes do tipo selecionado no filtro
      }
    })

    //funçao para adicionar valores
    function adicionarTransacao(){
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
    function excluirTransacao(idClicado){
      setTransacoes(transacoes.filter((transacao) =>{
        return transacao.id !== idClicado
      }))
    }

    //funçao para guardar na reserva de emergencia, toda vez que o valor da reserva mudar, ele salva o novo valor no localstorage
    function guardarReserva(){
      const valorDigitado = Number(valorInputReserva) //converte o valor digitado para numero
      if(valorDigitado > 0 && valorDigitado <= resultadoSaldo){ //verifica se o valor digitado é maior que zero e menor ou igual ao saldo total
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
      else{
        alert('Valor inválido para guardar na reserva. Verifique se o valor é positivo e não excede o saldo total.')
        setValorInputReserva('') //limpa o campo de entrada da reserva caso o valor seja inválido
      }
    }

    //funçao para retirar dinheiro da reserva de emergencia, toda vez que o valor da reserva mudar, ele salva o novo valor no localstorage
    function resgatarReserva(){
      const valorDigitado = Number(valorInputReserva) //converte o valor digitado para numero
      if(valorDigitado > 0 && valorDigitado <= reserva){
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
      else{
        alert('Valor inválido para resgatar da reserva. Verifique se o valor é positivo e não excede o valor disponível na reserva.')
        setValorInputReserva('') //limpa o campo de entrada da reserva caso o valor seja inválido
      }
    }

    //salvar dados no localstorage
    useEffect(() => {
      localStorage.setItem('transacoes', JSON.stringify(transacoes))//salva as transaçoes no localstorage como string
    }, [transacoes])//o useEffect é executado toda vez que a lista de transaçoes muda

    //sentinela da reserva de emergencia. Toda vez que a reserva mudar, ele salva o novo valor no localstorage
    useEffect(()=>{
      localStorage.setItem('reserva_emergencia', reserva.toString()) //salva o valor da reserva no localstorage como string
    }, [reserva])//o useEffect é executado toda vez que o valor da reserva mudar

    //funçao para transformar numeros puro em Reais(R$)
    function formatarDinheiro(valor){
      return Number(valor).toLocaleString('pt-BR',{
        style: 'currency',
        currency: 'BRL'
      });
    }


    return (    
      <div className="App">
        <h1>Meu Controle Financeiro</h1>

        <h2 style={{color: corSaldo}}>Saldo Total: {formatarDinheiro(resultadoSaldo)}</h2>

        <div style={{backgroundColor: '#eff6ff', padding:'20px', borderRadius:'8px', marginBottom:'30px', border:'1px solid #bfdbfe'}}>
          <h3 style={{color: '#3b82f6'}}>
          Reserva de Emergência: {formatarDinheiro(reserva)}
          </h3>
          <input type="number"
          placeholder='Valor da reserva'
          className='campo-entrada'
          value={valorInputReserva}
          onChange={(evento)=> setValorInputReserva(evento.target.value)}
          />
          <button className='btn-adicionar' onClick={guardarReserva}>Guardar</button>
          <button className='btn-adicionar' onClick={resgatarReserva}>Resgatar</button>

        </div>



        <h3>Adicionar Transação</h3>
        <div className="painel-formulario">

        <input type="text" 
        placeholder='Descrição'
        className='campo-entrada'
        value={novaDescricao}
        onChange={(evento) => setNovaDescricao(evento.target.value)
        }/>

        <input type="number" 
        placeholder='valor'
        className='campo-entrada'
        value={novoValor}
        onChange={(evento) => setNovoValor(evento.target.value)} />

        <select name="tipo" id="tipo" className='campo-entrada' value={novoTipo} onChange={(evento)=> setNovoTipo(evento.target.value)} >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <button className='btn-adicionar' onClick={adicionarTransacao}>Adicionar</button>
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
          <div style={{textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>
            <p>Nenhuma transação encontrada.</p>
          </div>
        )}

        {/* O map percorre a lista de transaçoes e para cada transaçao ele cria um item de lista (li) com a descricao, valor e tipo da transaçao */}
        <ul className='lista-transacoes'>
          {transacoesFiltradas.map(transacao => (
            <li key={transacao.id} className='cartao-transacao'
            style={{
              backgroundColor: transacao.tipo === 'entrada' ? '#dcfce7' : '#fee2e2'
            }}>
              {transacao.descricao}: {formatarDinheiro(transacao.valor)} 
              <button className='btn-excluir' onClick={()=>excluirTransacao(transacao.id)} >x</button>
            </li>
          ))}
        </ul>
        
      </div>
    );
  }

  export default App
